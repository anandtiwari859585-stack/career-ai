import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { CAREER_PROFILES, QUIZ_QUESTIONS, type AssessmentInput } from '@/lib/data'

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')

function ruleBasedAnalysis(input: AssessmentInput) {
  const scores: Record<string, number> = {}

  // Quiz trait scoring
  input.quizAnswers.forEach((ansIdx, qIdx) => {
    if (ansIdx === undefined || ansIdx === null) return
    const traits = QUIZ_QUESTIONS[qIdx]?.options[ansIdx]?.traits ?? []
    traits.forEach(t => { scores[t] = (scores[t] ?? 0) + 1 })
  })

  // GitHub language hints
  input.githubRepos.forEach(r => {
    const l = (r.lang ?? '').toLowerCase()
    if (l === 'python') { scores.data = (scores.data ?? 0) + 1; scores.ml = (scores.ml ?? 0) + 1 }
    if (l === 'javascript' || l === 'typescript') { scores.software = (scores.software ?? 0) + 1; scores.frontend = (scores.frontend ?? 0) + 1 }
    if (['go', 'rust', 'c', 'c++', 'java', 'kotlin'].includes(l)) { scores.software = (scores.software ?? 0) + 1; scores.backend = (scores.backend ?? 0) + 1 }
    if (l === 'r') { scores.data = (scores.data ?? 0) + 2 }
    if (l === 'solidity') { scores.web3 = (scores.web3 ?? 0) + 2 }
  })

  // Skill hints
  const allSkills = [...input.skills.langs, ...input.skills.frameworks, ...input.skills.tools]
  const mlSkills = ['Python', 'TensorFlow', 'PyTorch', 'scikit-learn', 'R']
  const devopsSkills = ['Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Terraform', 'Ansible', 'Jenkins']
  mlSkills.forEach(s => { if (allSkills.includes(s)) { scores.ml = (scores.ml ?? 0) + 1; scores.data = (scores.data ?? 0) + 1 } })
  devopsSkills.forEach(s => { if (allSkills.includes(s)) scores.devops = (scores.devops ?? 0) + 1 })
  if (allSkills.includes('Figma')) scores.design = (scores.design ?? 0) + 2
  if (allSkills.includes('Bash/Shell')) scores.devops = (scores.devops ?? 0) + 1

  // Priority boost
  if (input.preferences.jobPriority === 'startup') scores.entrepreneur = (scores.entrepreneur ?? 0) + 2
  if (input.preferences.jobPriority === 'learning') scores.ml = (scores.ml ?? 0) + 1
  if (input.preferences.jobPriority === 'impact') { scores.data = (scores.data ?? 0) + 1; scores.entrepreneur = (scores.entrepreneur ?? 0) + 1 }

  // Map traits to career keys
  const careerScores: Record<string, number> = {}
  Object.entries(CAREER_PROFILES).forEach(([key, profile]) => {
    careerScores[key] = profile.traitMap.reduce((sum, t) => sum + (scores[t] ?? 0), 0)
  })

  const sorted = Object.entries(careerScores).sort((a, b) => b[1] - a[1])
  const topKey = sorted[0][0]
  const total = sorted.reduce((s, [, v]) => s + v, 0) || 1
  const matchScore = Math.min(95, Math.round((sorted[0][1] / total) * 100) + 40)

  return { topKey, matchScore, sorted, careerScores }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const input: AssessmentInput = await req.json()
    const rule = ruleBasedAnalysis(input)
    const profile = CAREER_PROFILES[rule.topKey]

    // Build OpenAI prompt
    const prompt = `You are a professional career guidance counselor analyzing a student's profile.

STUDENT PROFILE:
- Academic Status: ${input.profile.status}
- Field of Study: ${input.profile.field}
- Target Region: ${input.profile.region}
- GPA: ${input.profile.gpa || 'Not provided'}

QUIZ RESULTS (top career match by rule-based analysis): ${profile.title} (${rule.matchScore}% confidence)

GITHUB PROJECTS (${input.githubRepos.length} public repos):
${input.githubRepos.slice(0, 5).map(r => `- ${r.name} (${r.lang ?? 'unknown lang'}, ★${r.stars}): ${r.desc ?? 'no description'}`).join('\n') || 'None provided'}

TECHNICAL SKILLS:
- Languages: ${input.skills.langs.join(', ') || 'None selected'}
- Frameworks: ${input.skills.frameworks.join(', ') || 'None selected'}
- Tools: ${input.skills.tools.join(', ') || 'None selected'}

PROJECT DESCRIPTION:
${input.projectDesc || 'Not provided'}

CAREER PREFERENCES:
- Work Environment: ${input.preferences.workEnv}
- Priority: ${input.preferences.jobPriority}
- Dream Company: ${input.preferences.companyType}
- Extra notes: ${input.preferences.extraNotes || 'None'}

Based on this profile, provide a JSON response with EXACTLY this structure:
{
  "careerMatch": "${rule.topKey}",
  "confidence": ${rule.matchScore},
  "personalizedSummary": "3-4 sentence personalized analysis of why this career fits this specific student",
  "strengths": ["strength1", "strength2", "strength3"],
  "gaps": ["gap1", "gap2", "gap3"],
  "firstActionItem": "The single most important thing this student should do THIS WEEK",
  "personalizedQuote": "A unique motivational quote tailored to this student's situation (NOT a famous quote, write an original one)",
  "salaryInsight": "A specific salary insight for this student based on their region and background",
  "alternativePaths": ["alt1", "alt2"],
  "timeToFirstJob": "Realistic estimate e.g. 6-9 months with consistent effort",
  "redFlags": ["any concern or gap to address"],
  "celebrationPoints": ["something genuinely impressive about their current profile"]
}

Respond with ONLY valid JSON, no markdown, no extra text.`

    let aiAnalysis: Record<string, unknown> = {}

    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
      try {
        const model = genai.getGenerativeModel({ model: 'gemini-3.8-flash' })
        const result = await model.generateContent(prompt)
        const raw = result.response.text()
        const cleaned = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim()
        aiAnalysis = JSON.parse(cleaned)
      } catch (aiErr) {
        console.error('Gemini error, using fallback:', aiErr)
      }
    }

    // Fallback if OpenAI is not configured
    if (!aiAnalysis.personalizedSummary) {
      aiAnalysis = {
        careerMatch: rule.topKey,
        confidence: rule.matchScore,
        personalizedSummary: `Based on your quiz responses and technical background, ${profile.title} is your strongest career alignment. Your combination of ${input.skills.langs.slice(0, 2).join(' and ') || 'technical skills'} and project experience positions you well for this path. Your ${input.profile.field} background provides a solid foundation. Focus on building a strong portfolio and networking in this domain.`,
        strengths: [
          input.skills.langs.length > 3 ? `Strong multi-language background (${input.skills.langs.slice(0, 3).join(', ')})` : 'Broad technical curiosity',
          input.githubRepos.length > 0 ? `${input.githubRepos.length} public GitHub projects demonstrating initiative` : 'Eagerness to build and create',
          `Clear interest alignment with ${profile.title} domain`,
        ],
        gaps: [
          'Build more end-to-end portfolio projects with real-world use cases',
          'Strengthen system design fundamentals',
          'Practice mock interviews and technical communication',
        ],
        firstActionItem: `Open LeetCode right now and solve 1 easy problem related to ${profile.key === 'ml' ? 'arrays/math' : profile.key === 'design' ? 'UX fundamentals' : 'data structures'}. Start the habit today.`,
        personalizedQuote: `Every expert was once a beginner who refused to give up. Your journey into ${profile.title} starts with the very next step you take today.`,
        salaryInsight: `In ${input.profile.region === 'india' ? 'India' : 'your target region'}, entry-level ${profile.title} roles pay ${input.profile.region === 'india' ? profile.salaryIN.entry : profile.salaryUS.entry}. With 3–5 years of growth, you can realistically reach ${input.profile.region === 'india' ? profile.salaryIN.mid : profile.salaryUS.mid}.`,
        alternativePaths: profile.alts.slice(0, 2).map(a => a.title),
        timeToFirstJob: '6–12 months with consistent daily effort and portfolio building',
        redFlags: input.skills.langs.length === 0 ? ['No technical skills selected — start with one core language'] : ['Keep your GitHub active — recruiters check this'],
        celebrationPoints: [input.githubRepos.length > 0 ? `Already has ${input.githubRepos.length} public projects — ahead of many peers!` : 'Taking the initiative to plan your career early is a huge advantage'],
      }
    }

    // Save assessment to Supabase
    const { data: assessment, error: saveError } = await supabase
      .from('assessments')
      .insert({
        user_id: user.id,
        quiz_answers: input.quizAnswers,
        github_repos: input.githubRepos,
        skills: input.skills,
        project_desc: input.projectDesc,
        preferences: input.preferences,
        ai_analysis: aiAnalysis,
        career_match: rule.topKey,
        match_score: rule.matchScore,
      })
      .select()
      .single()

    if (saveError) throw saveError

    // Seed roadmap milestones
    const milestones = profile.roadmap.flatMap(phase =>
      phase.items.map((item, idx) => ({
        user_id: user.id,
        assessment_id: assessment.id,
        phase: phase.phase,
        milestone_index: idx,
        milestone_text: item,
        completed: false,
      }))
    )
    await supabase.from('roadmap_progress').insert(milestones)

    // Award XP + badges
    // Sync career_match to profile so leaderboard view works
    await supabase.from('profiles').update({ career_match: rule.topKey }).eq('id', user.id)
    await supabase.rpc('award_xp', { p_user_id: user.id, p_xp: 150 })
    await supabase.from('user_badges').upsert({ user_id: user.id, badge_key: 'first_assessment' }, { onConflict: 'user_id,badge_key' })
    await supabase.from('user_badges').upsert({ user_id: user.id, badge_key: 'quiz_complete' }, { onConflict: 'user_id,badge_key' })
    if (input.githubRepos.length > 0) {
      await supabase.from('user_badges').upsert({ user_id: user.id, badge_key: 'github_connected' }, { onConflict: 'user_id,badge_key' })
      await supabase.rpc('award_xp', { p_user_id: user.id, p_xp: 75 })
    }

    return NextResponse.json({ assessment, aiAnalysis, ruleAnalysis: rule })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
