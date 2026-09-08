'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { levelFromXP } from '@/lib/data'

type Profile = {
  full_name: string | null
  avatar_url: string | null
  xp: number
  level: number
  streak: number
  career_match?: string | null
} | null

export default function DashboardNav({ user, profile }: { user: { email?: string }, profile: Profile }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const level = levelFromXP(profile?.xp ?? 0)

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const navItems = [
    { href: '/dashboard',             label: '🏠 Home' },
    { href: '/dashboard/assess',      label: '🧠 Assess' },
    { href: '/dashboard/roadmap',     label: '🗺️ Roadmap' },
    { href: '/dashboard/exams',       label: '📋 Exams' },
    { href: '/dashboard/badges',      label: '🏆 Badges' },
    { href: '/dashboard/leaderboard', label: '🏅 Leaderboard' },
  ]

  return (
    <header className="sticky top-0 z-40" style={{ background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(139,92,246,0.15)' }}>
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">

        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)', boxShadow: '0 0 14px rgba(124,58,237,0.4)' }}>
            🎓
          </div>
          <span className="font-extrabold text-white hidden sm:block text-sm tracking-tight">CareerAI</span>
        </Link>

        {/* Nav */}
        <nav className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-200"
              style={pathname === item.href
                ? { background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(37,99,235,0.2))', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.35)' }
                : { color: '#6b5f8a', border: '1px solid transparent' }
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User info + signout */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span className="font-bold" style={{ color: '#a78bfa' }}>{profile?.xp?.toLocaleString() ?? 0} XP</span>
            <span style={{ color: '#3d3552' }}>·</span>
            <span style={{ color: '#6b5f8a' }}>Lv.{level}</span>
            {(profile?.streak ?? 0) > 0 && (
              <>
                <span style={{ color: '#3d3552' }}>·</span>
                <span className="text-orange-400">{profile?.streak}🔥</span>
              </>
            )}
          </div>
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="avatar" className="w-7 h-7 rounded-full" style={{ border: '1px solid rgba(139,92,246,0.4)' }} />
          ) : (
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs" style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(139,92,246,0.3)' }}>👤</div>
          )}
          <button onClick={signOut} className="text-xs transition-colors" style={{ color: '#4d4466' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
            onMouseLeave={e => (e.currentTarget.style.color = '#4d4466')}>
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}
