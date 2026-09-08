'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CAREER_PROFILES, BADGES } from '@/lib/data'
import type { BadgeDefinition } from '@/lib/data'

type Milestone = {
  id: string
  phase: string
  milestone_index: number
  milestone_text: string
  completed: boolean
  completed_at: string | null
}

type Assessment = {
  id: string
  career_match: string
  match_score: number
  ai_analysis: Record<string, unknown>
  created_at: string
}

export default function RoadmapClient({
  milestones: initialMilestones,
  assessment,
  userBadges,
}: {
  milestones: Milestone[]
  assessment: Assessment | null
  userBadges: string[]
}) {
  const supabase = createClient()
  const [milestones, setMilestones] = useState(initialMilestones)
  const [newBadges, setNewBadges] = useState<BadgeDefinition[]>([])
  const [toggling, setToggling] = useState<string | null>(null)

  const profile = assessment ? CAREER_PROFILES[assessment.career_match] : null
  const completedCount = milestones.filter(m => m.completed).length
  const pct = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0

  async function toggleMilestone(id: string, current: boolean) {
    setToggling(id)
    setMilestones(prev => prev.map(m => m.id === id ? { ...m, completed: !current } : m))

    const res = await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ milestoneId: id, completed: !current }),
    })
    const data = await res.json()
    if (data.newBadges?.length > 0) setNewBadges(data.newBadges)
    setToggling(null)
  }

  const phases = ['early', 'mid', 'late']
  const phaseLabels: Record<string, { label: string; color: string; badge: string }> = {
    early: { label: 'Phase 1 · Foundation', color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10', badge: '🟣' },
    mid:   { label: 'Phase 2 · Growth',     color: 'text-purple-400 border-purple-500/30 bg-purple-500/10', badge: '🔵' },
    late:  { label: 'Phase 3 · Expert',     color: 'text-green-400 border-green-500/30 bg-green-500/10',   badge: '🟢' },
  }

  return (
    <div className="space-y-6">
      {/* Badge toast */}
      {newBadges.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {newBadges.map(b => (
            <div key={b.key} className="bg-yellow-500/20 border border-yellow-500/40 rounded-2xl p-4 flex items-center gap-3 shadow-xl backdrop-blur animate-bounce">
              <span className="text-3xl">{b.icon}</span>
              <div>
                <div className="text-xs font-bold text-yellow-300">🏆 New Badge Earned!</div>
                <div className="font-bold text-white">{b.name}</div>
                <div className="text-xs text-slate-400">+{b.xp} XP</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white mb-1">🗺️ Your Career Roadmap</h1>
            {profile && (
              <div className="flex items-center gap-2">
                <span className="text-2xl">{profile.icon}</span>
                <span className="text-slate-300 font-semibold">{profile.title}</span>
              </div>
            )}
          </div>
          <div className="text-right shrink-0">
            <div className="text-3xl font-extrabold text-indigo-400">{pct}%</div>
            <div className="text-xs text-slate-500">{completedCount}/{milestones.length} done</div>
          </div>
        </div>
        <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-green-500 rounded-full transition-all duration-700" style={{ width: `${pct}%` }}/>
        </div>
        <div className="flex justify-between text-xs text-slate-600 mt-1">
          <span>Start</span>
          <span>Expert Level</span>
        </div>
      </div>

      {/* AI Insights */}
      {assessment?.ai_analysis && (
        <div className="grid sm:grid-cols-2 gap-4">
          {typeof assessment.ai_analysis.firstActionItem === 'string' && (
            <div className="bg-indigo-500/10 border border-indigo-500/25 rounded-2xl p-5">
              <div className="text-xs font-bold text-indigo-400 mb-2">⚡ Do This Today</div>
              <p className="text-sm text-slate-300">{assessment.ai_analysis.firstActionItem}</p>
            </div>
          )}
          {typeof assessment.ai_analysis.timeToFirstJob === 'string' && (
            <div className="bg-green-500/10 border border-green-500/25 rounded-2xl p-5">
              <div className="text-xs font-bold text-green-400 mb-2">⏱️ Time to First Job</div>
              <p className="text-sm text-slate-300">{assessment.ai_analysis.timeToFirstJob}</p>
            </div>
          )}
        </div>
      )}

      {/* Roadmap phases */}
      {milestones.length > 0 ? phases.map(phase => {
        const phaseMilestones = milestones.filter(m => m.phase === phase)
        if (phaseMilestones.length === 0) return null
        const ph = phaseLabels[phase]
        const doneInPhase = phaseMilestones.filter(m => m.completed).length
        return (
          <div key={phase} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div className={`flex items-center gap-2 text-sm font-bold px-3 py-1.5 rounded-full border ${ph.color}`}>
                <span>{ph.badge}</span>
                <span>{ph.label}</span>
              </div>
              <span className="text-xs text-slate-500">{doneInPhase}/{phaseMilestones.length} completed</span>
            </div>
            <div className="space-y-3">
              {phaseMilestones.map(m => (
                <button
                  key={m.id}
                  onClick={() => toggleMilestone(m.id, m.completed)}
                  disabled={toggling === m.id}
                  className={`w-full text-left flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    m.completed
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                  } ${toggling === m.id ? 'opacity-50' : ''}`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    m.completed ? 'bg-green-500 border-green-500 text-white' : 'border-slate-600 text-transparent'
                  }`}>✓</div>
                  <span className={`text-sm flex-1 ${m.completed ? 'text-green-300 line-through decoration-green-700' : 'text-slate-300'}`}>
                    {m.milestone_text}
                  </span>
                  {m.completed && m.completed_at && (
                    <span className="text-xs text-slate-600 shrink-0">{new Date(m.completed_at).toLocaleDateString()}</span>
                  )}
                  {!m.completed && <span className="text-xs text-indigo-400 shrink-0">+50 XP</span>}
                </button>
              ))}
            </div>
          </div>
        )
      }) : (
        <div className="text-center py-16 text-slate-500">
          No roadmap yet. <a href="/dashboard/assess" className="text-indigo-400 hover:underline">Take the assessment first →</a>
        </div>
      )}

      {/* Promotion Track */}
      {profile && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="font-bold text-white mb-5">🏅 Promotion Track</h2>
          <div className="flex flex-wrap gap-3">
            {profile.promo.map((title, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5">
                  <div className="text-sm font-bold text-white">{title}</div>
                  <div className="text-xs text-slate-500">{profile.promoYrs[i]}</div>
                </div>
                {i < profile.promo.length - 1 && <span className="text-indigo-400 text-lg">›</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
