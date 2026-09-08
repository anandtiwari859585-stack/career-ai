import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BADGES } from '@/lib/data'

export default async function BadgesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: userBadges } = await supabase
    .from('user_badges')
    .select('badge_key, earned_at')
    .eq('user_id', user.id)

  const earnedKeys = new Set(userBadges?.map(b => b.badge_key) ?? [])
  const allBadges = Object.values(BADGES)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white mb-1">🏆 Badges & Achievements</h1>
        <p className="text-slate-400 text-sm">{earnedKeys.size} of {allBadges.length} badges earned</p>
      </div>

      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all"
          style={{ width: `${Math.round((earnedKeys.size / allBadges.length) * 100)}%` }}/>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allBadges.map(badge => {
          const earned = earnedKeys.has(badge.key)
          const earnedAt = userBadges?.find(b => b.badge_key === badge.key)?.earned_at
          return (
            <div key={badge.key} className={`rounded-2xl border p-5 transition-all ${
              earned
                ? 'bg-slate-900 border-yellow-500/30 shadow-lg shadow-yellow-500/5'
                : 'bg-slate-900/50 border-slate-800 opacity-50'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`text-4xl w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                  earned ? 'bg-yellow-500/15' : 'bg-slate-800 grayscale'
                }`}>{badge.icon}</div>
                <div className="flex-1">
                  <div className="font-bold text-white text-sm mb-1">{badge.name}</div>
                  <div className="text-xs text-slate-400 leading-relaxed mb-2">{badge.desc}</div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold ${earned ? 'text-yellow-400' : 'text-slate-600'}`}>+{badge.xp} XP</span>
                    {earned && earnedAt && (
                      <span className="text-xs text-slate-600">{new Date(earnedAt).toLocaleDateString()}</span>
                    )}
                    {!earned && <span className="text-xs text-slate-600">Locked 🔒</span>}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
