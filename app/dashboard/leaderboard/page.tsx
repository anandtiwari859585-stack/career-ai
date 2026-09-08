import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CAREER_PROFILES } from '@/lib/data'

export default async function LeaderboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: leaders } = await supabase
    .from('leaderboard')
    .select('*')
    .limit(50)

  const myRank = leaders?.find(l => l.id === user.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white mb-1">🏅 Global Leaderboard</h1>
        <p className="text-slate-400 text-sm">Top students ranked by XP earned through assessments and milestones</p>
      </div>

      {myRank && (
        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-4 flex items-center gap-4">
          <div className="text-2xl font-extrabold text-indigo-400">#{myRank.rank}</div>
          <div className="flex-1">
            <div className="font-bold text-white text-sm">Your Rank</div>
            <div className="text-xs text-slate-400">{myRank.xp?.toLocaleString()} XP · Level {myRank.level} · {myRank.streak}🔥 streak</div>
          </div>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {leaders && leaders.length > 0 ? leaders.map((l, i) => {
          const isMe = l.id === user.id
          const careerIcon = l.career_match ? CAREER_PROFILES[l.career_match]?.icon : '🎓'
          return (
            <div key={l.id} className={`flex items-center gap-4 px-6 py-4 border-b border-slate-800 last:border-0 transition-colors ${isMe ? 'bg-indigo-500/10' : 'hover:bg-slate-800/40'}`}>
              {/* Rank */}
              <div className={`w-8 text-center font-extrabold ${
                i === 0 ? 'text-yellow-400 text-xl' : i === 1 ? 'text-slate-300 text-lg' : i === 2 ? 'text-orange-400 text-lg' : 'text-slate-600 text-sm'
              }`}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${l.rank}`}
              </div>
              {/* Avatar */}
              {l.avatar_url ? (
                <img src={l.avatar_url} alt="" className="w-9 h-9 rounded-full shrink-0"/>
              ) : (
                <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-base shrink-0">{careerIcon}</div>
              )}
              {/* Name */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white text-sm truncate">
                  {l.full_name || 'Anonymous Explorer'} {isMe && <span className="text-indigo-400 text-xs ml-1">(You)</span>}
                </div>
                <div className="text-xs text-slate-500">
                  {careerIcon} {l.career_match ? CAREER_PROFILES[l.career_match]?.title ?? l.career_match : 'Not assessed'}
                </div>
              </div>
              {/* Stats */}
              <div className="text-right shrink-0">
                <div className="font-bold text-white text-sm">{l.xp?.toLocaleString()} XP</div>
                <div className="text-xs text-slate-500">Lv.{l.level} · {l.streak}🔥</div>
              </div>
            </div>
          )
        }) : (
          <div className="text-center py-16 text-slate-500 text-sm">
            No entries yet. Complete your assessment to join the leaderboard!
          </div>
        )}
      </div>
    </div>
  )
}
