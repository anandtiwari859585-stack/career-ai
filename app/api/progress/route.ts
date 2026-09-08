import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { BADGES, levelFromXP, xpForLevel } from '@/lib/data'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { milestoneId, completed } = await req.json()

    // Update milestone
    await supabase
      .from('roadmap_progress')
      .update({ completed, completed_at: completed ? new Date().toISOString() : null })
      .eq('id', milestoneId)
      .eq('user_id', user.id)

    let newBadges: string[] = []

    if (completed) {
      // Award XP for completing a milestone
      await supabase.rpc('award_xp', { p_user_id: user.id, p_xp: 50 })

      // Count total completed milestones
      const { count } = await supabase
        .from('roadmap_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('completed', true)

      const total = count ?? 0
      const badgesToCheck: [number, string][] = [[1, 'milestone_1'], [5, 'milestone_5'], [10, 'milestone_10']]

      for (const [threshold, badgeKey] of badgesToCheck) {
        if (total >= threshold) {
          const { error } = await supabase
            .from('user_badges')
            .upsert({ user_id: user.id, badge_key: badgeKey }, { onConflict: 'user_id,badge_key' })
          if (!error) newBadges.push(badgeKey)
        }
      }
    }

    // Check level-up badges
    const { data: profile } = await supabase.from('profiles').select('xp, level').eq('id', user.id).single()
    if (profile) {
      const lvl = levelFromXP(profile.xp)
      if (lvl >= 5) await supabase.from('user_badges').upsert({ user_id: user.id, badge_key: 'level_5' }, { onConflict: 'user_id,badge_key' })
      if (lvl >= 10) await supabase.from('user_badges').upsert({ user_id: user.id, badge_key: 'level_10' }, { onConflict: 'user_id,badge_key' })
    }

    return NextResponse.json({ ok: true, newBadges: newBadges.map(k => BADGES[k]).filter(Boolean) })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
