import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import RoadmapClient from './RoadmapClient'

export default async function RoadmapPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const [{ data: milestones }, { data: assessment }, { data: userBadges }] = await Promise.all([
    supabase.from('roadmap_progress').select('*').eq('user_id', user.id).order('phase').order('milestone_index'),
    supabase.from('assessments').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).single(),
    supabase.from('user_badges').select('badge_key').eq('user_id', user.id),
  ])

  return (
    <RoadmapClient
      milestones={milestones ?? []}
      assessment={assessment ?? null}
      userBadges={(userBadges ?? []).map(b => b.badge_key)}
    />
  )
}
