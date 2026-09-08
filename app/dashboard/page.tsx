import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CAREER_PROFILES, levelFromXP, xpForLevel, BADGES } from '@/lib/data'

const card = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '1rem' }
const cardHover = 'transition-all duration-200'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const [{ data: profile }, { data: assessments }, { data: userBadges }, { data: progress }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('assessments').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('user_badges').select('badge_key, earned_at').eq('user_id', user.id),
    supabase.from('roadmap_progress').select('*').eq('user_id', user.id).order('phase').order('milestone_index'),
  ])

  const latestAssessment = assessments?.[0]
  const careerProfile = latestAssessment ? CAREER_PROFILES[latestAssessment.career_match] : null
  const xp = profile?.xp ?? 0
  const level = levelFromXP(xp)
  const currentLevelXP = xpForLevel(level - 1)
  const nextLevelXP = xpForLevel(level)
  const xpProgress = Math.round(((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100)
  const completedMilestones = progress?.filter(p => p.completed).length ?? 0
  const totalMilestones = progress?.length ?? 0

  return (
    <div className="space-y-6">

      {/* Welcome + XP bar */}
      <div className="p-6 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(37,99,235,0.08) 100%)', border: '1px solid rgba(139,92,246,0.25)' }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="avatar" className="w-14 h-14 rounded-full" style={{ border: '2px solid rgba(139,92,246,0.5)', boxShadow: '0 0 16px rgba(124,58,237,0.3)' }} />
            ) : (
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl" style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)', boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}>👤</div>
            )}
            <div>
              <h2 className="text-xl font-bold text-white">
                Welcome back, {profile?.full_name?.split(' ')[0] ?? 'Explorer'}! 👋
              </h2>
              <p className="text-sm" style={{ color: '#7c6aaa' }}>Level {level} Career Explorer</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-extrabold" style={{ background: 'linear-gradient(135deg, #a78bfa, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {xp.toLocaleString()} XP
            </div>
            <div className="text-xs" style={{ color: '#4d4466' }}>{nextLevelXP - xp} XP to Level {level + 1}</div>
          </div>
        </div>
        <div className="mt-5">
          <div className="flex justify-between text-xs mb-1.5" style={{ color: '#4d4466' }}>
            <span>Level {level}</span>
            <span style={{ color: '#a78bfa' }}>{xpProgress}%</span>
            <span>Level {level + 1}</span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${xpProgress}%`, background: 'linear-gradient(90deg, #7c3aed, #4f46e5, #2563eb)' }} />
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Assessments',    value: assessments?.length ?? 0,                        icon: '🗺️', color: '#a78bfa' },
          { label: 'Milestones Done',value: `${completedMilestones}/${totalMilestones}`,     icon: '✅', color: '#34d399' },
          { label: 'Badges Earned',  value: userBadges?.length ?? 0,                         icon: '🏆', color: '#fbbf24' },
          { label: 'Current Streak', value: `${profile?.streak ?? 0}d`,                      icon: '🔥', color: '#fb923c' },
        ].map(s => (
          <div key={s.label} className="p-4 text-center rounded-xl" style={card}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs mt-1" style={{ color: '#4d4466' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Career Match Card */}
        <div className="lg:col-span-2 space-y-6">
          {careerProfile ? (
            <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139,92,246,0.3)' }}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: '#a78bfa' }}>Your Career Match</div>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{careerProfile.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white">{careerProfile.title}</h3>
                      <span className="text-xs px-3 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', color: '#34d399' }}>
                        ✨ {careerProfile.match}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-3xl font-extrabold text-white">{latestAssessment.match_score}%</div>
                  <div className="text-xs" style={{ color: '#4d4466' }}>Match score</div>
                </div>
              </div>

              {/* AI Summary */}
              {latestAssessment.ai_analysis?.personalizedSummary && (
                <div className="rounded-xl p-4 mb-4" style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)' }}>
                  <div className="text-xs font-bold mb-2" style={{ color: '#c084fc' }}>🤖 AI Analysis</div>
                  <p className="text-sm leading-relaxed" style={{ color: '#a89cc8' }}>{latestAssessment.ai_analysis.personalizedSummary}</p>
                </div>
              )}

              {/* Strengths & Gaps */}
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-xs font-bold mb-2" style={{ color: '#34d399' }}>💪 Your Strengths</div>
                  <ul className="space-y-1">
                    {(latestAssessment.ai_analysis?.strengths ?? []).map((s: string, i: number) => (
                      <li key={i} className="text-xs flex gap-2" style={{ color: '#7c6aaa' }}>
                        <span style={{ color: '#34d399' }} className="shrink-0">→</span>{s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-xs font-bold mb-2" style={{ color: '#fb923c' }}>🎯 Areas to Improve</div>
                  <ul className="space-y-1">
                    {(latestAssessment.ai_analysis?.gaps ?? []).map((g: string, i: number) => (
                      <li key={i} className="text-xs flex gap-2" style={{ color: '#7c6aaa' }}>
                        <span style={{ color: '#fb923c' }} className="shrink-0">→</span>{g}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Do this today */}
              {latestAssessment.ai_analysis?.firstActionItem && (
                <div className="rounded-xl p-4" style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)' }}>
                  <div className="text-xs font-bold mb-1" style={{ color: '#a78bfa' }}>⚡ Do This Today</div>
                  <p className="text-sm" style={{ color: '#c4b5fd' }}>{latestAssessment.ai_analysis.firstActionItem}</p>
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <Link href="/dashboard/roadmap" className="flex-1 text-center text-white text-sm font-semibold py-2.5 rounded-xl transition-all"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)', boxShadow: '0 4px 16px rgba(124,58,237,0.3)' }}>
                  View Full Roadmap →
                </Link>
                <Link href="/dashboard/assess" className="flex-1 text-center text-sm font-semibold py-2.5 rounded-xl transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(139,92,246,0.2)', color: '#8b7aa8' }}>
                  Retake Assessment
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl p-10 text-center" style={card}>
              <div className="text-5xl mb-4">🗺️</div>
              <h3 className="text-xl font-bold text-white mb-2">Start Your Career Journey</h3>
              <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: '#7c6aaa' }}>Take the AI-powered career assessment to get your personalized roadmap, salary insights, and growth plan.</p>
              <Link href="/dashboard/assess" className="inline-flex items-center gap-2 text-white font-semibold px-8 py-3 rounded-xl transition-all"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)', boxShadow: '0 4px 20px rgba(124,58,237,0.35)' }}>
                Start Assessment →
              </Link>
            </div>
          )}

          {/* Roadmap Quick Progress */}
          {progress && progress.length > 0 && (
            <div className="rounded-2xl p-6" style={card}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white">📋 Roadmap Progress</h3>
                <Link href="/dashboard/roadmap" className="text-xs transition-colors" style={{ color: '#a78bfa' }}>View all →</Link>
              </div>
              <div className="h-2 rounded-full mb-4 overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full" style={{ width: `${totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0}%`, background: 'linear-gradient(90deg, #34d399, #059669)' }} />
              </div>
              <div className="space-y-2">
                {progress.slice(0, 4).map(m => (
                  <div key={m.id} className="flex items-center gap-3 p-3 rounded-xl"
                    style={m.completed
                      ? { background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)' }
                      : { background: 'rgba(255,255,255,0.03)' }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0"
                      style={m.completed
                        ? { background: '#059669', color: '#fff' }
                        : { background: 'rgba(255,255,255,0.06)', color: '#4d4466' }}>
                      {m.completed ? '✓' : '○'}
                    </div>
                    <span className="text-sm" style={{ color: m.completed ? '#6ee7b7' : '#8b7aa8', textDecoration: m.completed ? 'line-through' : 'none' }}>
                      {m.milestone_text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">

          {/* Motivational Quote */}
          {latestAssessment?.ai_analysis?.personalizedQuote && (
            <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(37,99,235,0.08))', border: '1px solid rgba(139,92,246,0.2)' }}>
              <div className="text-lg mb-3" style={{ color: '#a78bfa' }}>✦</div>
              <blockquote className="text-sm italic leading-relaxed" style={{ color: '#a89cc8' }}>
                "{latestAssessment.ai_analysis.personalizedQuote}"
              </blockquote>
            </div>
          )}

          {/* Badges */}
          <div className="rounded-2xl p-5" style={card}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-sm">🏆 Your Badges</h3>
              <span className="text-xs" style={{ color: '#4d4466' }}>{userBadges?.length ?? 0} earned</span>
            </div>
            {userBadges && userBadges.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {userBadges.slice(0, 9).map(ub => {
                  const badge = BADGES[ub.badge_key]
                  if (!badge) return null
                  return (
                    <div key={ub.badge_key} className="rounded-xl p-2 text-center" style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(139,92,246,0.2)' }} title={badge.desc}>
                      <div className="text-2xl">{badge.icon}</div>
                      <div className="text-xs mt-1 truncate" style={{ color: '#7c6aaa' }}>{badge.name}</div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-xs text-center py-4" style={{ color: '#4d4466' }}>Complete your first assessment to earn badges!</p>
            )}
          </div>

          {/* Salary Insight */}
          {careerProfile && (
            <div className="rounded-2xl p-5" style={card}>
              <h3 className="font-bold text-white text-sm mb-3">💰 Salary Snapshot</h3>
              <div className="space-y-2">
                {Object.entries(profile?.region === 'india' ? careerProfile.salaryIN : careerProfile.salaryUS).map(([lvl, salary]) => (
                  <div key={lvl} className="flex justify-between items-center">
                    <span className="text-xs capitalize" style={{ color: '#4d4466' }}>{lvl}</span>
                    <span className="text-xs font-semibold" style={{ color: '#c4b5fd' }}>{salary as string}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Leaderboard teaser */}
          <Link href="/dashboard/leaderboard" className={`block rounded-2xl p-5 ${cardHover}`} style={card}>
            <h3 className="font-bold text-white text-sm mb-1">🏅 Leaderboard</h3>
            <p className="text-xs" style={{ color: '#4d4466' }}>See how you rank against other students →</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
