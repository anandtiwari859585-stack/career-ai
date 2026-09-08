import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardNav from '@/components/DashboardNav'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen flex flex-col relative" style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #0d0a1a 40%, #0a0f1a 100%)' }}>
      {/* Dot grid */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.025]"
        style={{ backgroundImage: 'radial-gradient(circle, #a78bfa 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      {/* Ambient orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[-100px] left-[5%]  w-[500px] h-[500px] rounded-full blur-[130px]" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[10%] right-[-60px] w-[400px] h-[400px] rounded-full blur-[110px]" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)' }} />
      </div>
      <DashboardNav user={user} profile={profile} />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 relative z-10">
        {children}
      </main>
    </div>
  )
}
