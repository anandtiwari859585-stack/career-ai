'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { QUIZ_QUESTIONS } from '@/lib/data'

const SKILL_DATA = {
  langs: ['Python','JavaScript','TypeScript','Java','C/C++','C#','Go','Rust','Ruby','Kotlin','Swift','PHP','R','MATLAB','Bash/Shell','Solidity'],
  frameworks: ['React','Angular','Vue.js','Next.js','Node.js','Express','Django','Flask','FastAPI','Spring Boot','TensorFlow','PyTorch','scikit-learn','Pandas','NumPy','Docker','Kubernetes','GraphQL','Redux','LangChain'],
  tools: ['Git/GitHub','Linux','AWS','Azure','GCP','Firebase','MongoDB','PostgreSQL','MySQL','Redis','Figma','Jira','VS Code','Postman','Jenkins','Terraform','Ansible','Kafka','Elasticsearch','Tableau'],
}

type Step = 'quiz' | 'profile' | 'github' | 'skills' | 'loading'

export default function AssessPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('quiz')
  const [qIdx, setQIdx] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])

  // Profile
  const [name, setName] = useState('')
  const [status, setStatus] = useState('')
  const [field, setField] = useState('')
  const [gpa, setGpa] = useState('')
  const [region, setRegion] = useState('india')

  // GitHub
  const [githubId, setGithubId] = useState('')
  const [githubStatus, setGithubStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')
  const [repos, setRepos] = useState<{name:string;lang:string|null;stars:number;desc:string|null}[]>([])
  const [projectDesc, setProjectDesc] = useState('')

  // Skills
  const [skills, setSkills] = useState<{langs:string[];frameworks:string[];tools:string[]}>({ langs:[], frameworks:[], tools:[] })
  const [workEnv, setWorkEnv] = useState('hybrid')
  const [jobPriority, setJobPriority] = useState('growth')
  const [companyType, setCompanyType] = useState('bigtech')
  const [extraNotes, setExtraNotes] = useState('')

  const [loadingMsg, setLoadingMsg] = useState(0)
  const LOADING_MSGS = ['Analyzing your quiz responses…','Fetching GitHub data…','Processing your skills…','Running AI career matching…','Building personalized roadmap…','Almost done…']

  // ── Quiz ──
  function selectAnswer(idx: number) {
    const updated = [...answers]
    updated[qIdx] = idx
    setAnswers(updated)
  }

  function nextQ() {
    if (qIdx < QUIZ_QUESTIONS.length - 1) setQIdx(qIdx + 1)
    else setStep('profile')
  }

  // ── GitHub ──
  let ghTimer: ReturnType<typeof setTimeout>
  async function fetchGitHub(username: string) {
    if (!username || username.length < 2) return
    clearTimeout(ghTimer)
    ghTimer = setTimeout(async () => {
      setGithubStatus('loading')
      try {
        const r = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=8&sort=updated`)
        if (!r.ok) throw new Error()
        const data = await r.json()
        setRepos(data.map((r: {name:string;language:string|null;stargazers_count:number;description:string|null}) => ({ name:r.name, lang:r.language, stars:r.stargazers_count, desc:r.description })))
        setGithubStatus('success')
      } catch {
        setGithubStatus('error')
        setRepos([])
      }
    }, 800)
  }

  // ── Skills toggle ──
  function toggleSkill(type: keyof typeof skills, val: string) {
    setSkills(prev => {
      const arr = prev[type]
      return { ...prev, [type]: arr.includes(val) ? arr.filter(s => s !== val) : [...arr, val] }
    })
  }

  // ── Submit ──
  async function submit() {
    setStep('loading')
    let i = 0
    const interval = setInterval(() => { i++; if (i < LOADING_MSGS.length) setLoadingMsg(i) }, 900)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizAnswers: answers,
          githubRepos: repos,
          skills,
          projectDesc,
          preferences: { workEnv, jobPriority, companyType, extraNotes },
          profile: { status, field, region, gpa, name },
        }),
      })
      clearInterval(interval)
      if (!res.ok) throw new Error()
      router.push('/dashboard')
      router.refresh()
    } catch {
      clearInterval(interval)
      router.push('/dashboard')
    }
  }

  const optLetters = ['A','B','C','D']

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-8">
        {(['quiz','profile','github','skills'] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step === s ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-950' :
              (['quiz','profile','github','skills'].indexOf(step) > i) ? 'bg-green-600 text-white' : 'bg-slate-800 text-slate-500'
            }`}>{['quiz','profile','github','skills'].indexOf(step) > i ? '✓' : i+1}</div>
            <span className={`text-xs hidden sm:block ${step === s ? 'text-white font-semibold' : 'text-slate-500'}`}>
              {['Quiz','Profile','GitHub','Skills'][i]}
            </span>
            {i < 3 && <div className="w-8 h-px bg-slate-700 mx-1"/>}
          </div>
        ))}
      </div>

      {/* ── QUIZ ── */}
      {step === 'quiz' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs text-slate-500 font-medium">Question {qIdx+1} of {QUIZ_QUESTIONS.length}</span>
            <div className="flex-1 mx-4 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all" style={{width:`${((qIdx+1)/QUIZ_QUESTIONS.length)*100}%`}}/>
            </div>
            <span className="text-xs text-indigo-400 font-semibold">{Math.round(((qIdx+1)/QUIZ_QUESTIONS.length)*100)}%</span>
          </div>

          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            {QUIZ_QUESTIONS[qIdx].scenario}
          </div>
          <h2 className="text-xl font-bold text-white mb-6 leading-relaxed">{QUIZ_QUESTIONS[qIdx].question}</h2>

          <div className="space-y-3 mb-8">
            {QUIZ_QUESTIONS[qIdx].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => selectAnswer(i)}
                className={`w-full text-left flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  answers[qIdx] === i
                    ? 'bg-indigo-500/15 border-indigo-500 shadow-lg shadow-indigo-500/10'
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                }`}
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                  answers[qIdx] === i ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400'
                }`}>{optLetters[i]}</span>
                <span className="text-sm text-slate-200">{opt.text}</span>
              </button>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => qIdx > 0 && setQIdx(qIdx - 1)}
              className={`text-sm px-5 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors ${qIdx === 0 ? 'invisible' : ''}`}
            >← Back</button>
            <button
              onClick={nextQ}
              disabled={answers[qIdx] === undefined}
              className="text-sm px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >{qIdx === QUIZ_QUESTIONS.length - 1 ? 'Finish Quiz →' : 'Next →'}</button>
          </div>
        </div>
      )}

      {/* ── PROFILE ── */}
      {step === 'profile' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white mb-2">👤 Your Profile</h2>
          <p className="text-slate-400 text-sm mb-6">Help us personalize your career roadmap.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Name <span className="text-slate-500 font-normal">(optional)</span></label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Current Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500">
                <option value="">Select status</option>
                {[['highschool','High School Student'],['undergraduate','Undergraduate (1st/2nd Year)'],['undergraduate3','Undergraduate (3rd/4th Year)'],['postgraduate','Postgraduate'],['fresher','Recent Graduate / Fresher'],['working','Working Professional']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Field of Study</label>
              <select value={field} onChange={e => setField(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500">
                <option value="">Select field</option>
                {[['cs','Computer Science / IT'],['ece','Electronics & Communication'],['mech','Mechanical Engineering'],['bio','Biology / Biotech'],['business','Business / Management'],['arts','Arts / Humanities'],['science','Science'],['other','Other']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">CGPA / Percentage <span className="text-slate-500 font-normal">(optional)</span></label>
              <input value={gpa} onChange={e => setGpa(e.target.value)} placeholder="e.g. 8.5 / 85%" className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500"/>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-2">Target Region</label>
              <select value={region} onChange={e => setRegion(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500">
                {[['india','India'],['usa','United States'],['uk','United Kingdom'],['canada','Canada'],['europe','Europe'],['australia','Australia']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <button onClick={() => setStep('quiz')} className="text-sm px-5 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors">← Back</button>
            <button onClick={() => setStep('github')} disabled={!status || !field} className="text-sm px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">Next →</button>
          </div>
        </div>
      )}

      {/* ── GITHUB ── */}
      {step === 'github' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-2">💻 GitHub Profile</h2>
            <p className="text-slate-400 text-sm mb-6">We&apos;ll analyze your public repos to understand your real technical depth.</p>
            <div className="relative mb-4">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none">github.com/</span>
              <input
                value={githubId}
                onChange={e => { setGithubId(e.target.value); fetchGitHub(e.target.value) }}
                placeholder="your-username"
                className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl pl-32 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            {githubStatus === 'loading' && <p className="text-xs text-yellow-400 flex gap-2">⏳ Looking up profile…</p>}
            {githubStatus === 'success' && <p className="text-xs text-green-400 flex gap-2">✅ Found {repos.length} public repositories</p>}
            {githubStatus === 'error' && <p className="text-xs text-red-400 flex gap-2">❌ User not found — check the username</p>}
            {repos.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {repos.map(r => (
                  <span key={r.name} className="bg-green-500/10 border border-green-500/20 text-green-300 text-xs px-3 py-1 rounded-full">
                    📦 {r.name}{r.lang ? ` · ${r.lang}` : ''}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-2">📄 Describe Your Projects</h2>
            <p className="text-slate-400 text-sm mb-4">Paste resume text or describe key projects — this helps the AI give better advice.</p>
            <textarea
              value={projectDesc}
              onChange={e => setProjectDesc(e.target.value)}
              rows={5}
              placeholder="e.g. Built a full-stack e-commerce app with React + Node.js. Created a sentiment analysis model using BERT. Contributed to open source..."
              className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 resize-none transition-colors"
            />
          </div>

          <div className="flex justify-between">
            <button onClick={() => setStep('profile')} className="text-sm px-5 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors">← Back</button>
            <button onClick={() => setStep('skills')} className="text-sm px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-colors">Next →</button>
          </div>
        </div>
      )}

      {/* ── SKILLS ── */}
      {step === 'skills' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-2">🛠️ Technical Skills</h2>
            <p className="text-slate-400 text-sm mb-6">Select everything you&apos;re comfortable with.</p>
            {(['langs','frameworks','tools'] as const).map(type => (
              <div key={type} className="mb-6">
                <div className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wide">
                  {type === 'langs' ? 'Programming Languages' : type === 'frameworks' ? 'Frameworks & Libraries' : 'Tools & Platforms'}
                </div>
                <div className="flex flex-wrap gap-2">
                  {SKILL_DATA[type].map(s => (
                    <button
                      key={s}
                      onClick={() => toggleSkill(type, s)}
                      className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                        skills[type].includes(s)
                          ? 'bg-indigo-500/15 border-indigo-500 text-indigo-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                      }`}
                    >{s}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-2">🎯 Career Preferences</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Work Environment</label>
                <select value={workEnv} onChange={e => setWorkEnv(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500">
                  {[['remote','Fully Remote'],['hybrid','Hybrid'],['office','Office / On-site'],['travel','Field / Travel']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Job Priority</label>
                <select value={jobPriority} onChange={e => setJobPriority(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500">
                  {[['salary','High Salary'],['growth','Fast Growth'],['wlb','Work-Life Balance'],['impact','Social Impact'],['learning','Continuous Learning'],['startup','Startup Culture']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Dream Company Type</label>
                <select value={companyType} onChange={e => setCompanyType(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500">
                  {[['bigtech','Big Tech (FAANG/MAANG)'],['startup','Early-stage Startup'],['mid','Mid-size Product Company'],['service','IT Services / Consulting'],['govt','Government / PSU'],['research','Research / Academia'],['own','Start My Own Business']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Anything else? <span className="text-slate-500 font-normal">(optional)</span></label>
              <textarea value={extraNotes} onChange={e => setExtraNotes(e.target.value)} rows={3} placeholder="e.g. I want to work in AI, I have interview anxiety, I'm self-taught..." className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 resize-none"/>
            </div>
          </div>

          <div className="flex justify-between">
            <button onClick={() => setStep('github')} className="text-sm px-5 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors">← Back</button>
            <button onClick={submit} className="text-sm px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold hover:opacity-90 transition-opacity">
              🔍 Analyze My Career →
            </button>
          </div>
        </div>
      )}

      {/* ── LOADING ── */}
      {step === 'loading' && (
        <div className="text-center py-24">
          <div className="relative w-20 h-20 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"/>
            <div className="absolute inset-3 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" style={{animationDirection:'reverse',animationDuration:'0.7s'}}/>
            <div className="absolute inset-6 rounded-full bg-indigo-500/10 flex items-center justify-center text-xl">🤖</div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">AI is Analyzing Your Profile</h2>
          <p className="text-slate-400 text-sm mb-8">Building your personalized career roadmap…</p>
          <div className="max-w-xs mx-auto space-y-3">
            {LOADING_MSGS.map((msg, i) => (
              <div key={i} className={`flex items-center gap-3 text-sm transition-all duration-500 ${i <= loadingMsg ? 'opacity-100' : 'opacity-20'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 ${i < loadingMsg ? 'bg-green-500 text-white' : i === loadingMsg ? 'bg-indigo-500 text-white animate-pulse' : 'bg-slate-700 text-slate-500'}`}>
                  {i < loadingMsg ? '✓' : '●'}
                </div>
                <span className={i <= loadingMsg ? 'text-slate-300' : 'text-slate-600'}>{msg}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
