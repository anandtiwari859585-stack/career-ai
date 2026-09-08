'use client'
import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import gsap from 'gsap'

export default function HomePage() {
  const headerRef = useRef<HTMLElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const h2Ref = useRef<HTMLHeadingElement>(null)
  const paraRef = useRef<HTMLParagraphElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Floating orbs
      gsap.to('.orb-1', { x: 40, y: -30, duration: 7, repeat: -1, yoyo: true, ease: 'sine.inOut' })
      gsap.to('.orb-2', { x: -30, y: 40, duration: 9, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.5 })
      gsap.to('.orb-3', { x: 25, y: 30, duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 3 })
      gsap.to('.orb-4', { x: -20, y: -35, duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.5 })

      // Grid shimmer
      gsap.to('.grid-overlay', { opacity: 0.04, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' })

      // Entrance timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo(headerRef.current, { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
        .fromTo(badgeRef.current, { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5 }, '-=0.1')
        .fromTo(h2Ref.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, '-=0.2')
        .fromTo(paraRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.5')
        .fromTo('.feature-pill', { y: 20, opacity: 0, scale: 0.85 }, { y: 0, opacity: 1, scale: 1, duration: 0.4, stagger: 0.07 }, '-=0.3')
        .fromTo(btnRef.current, { y: 25, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.5 }, '-=0.2')
        .fromTo(statsRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.2')

      // Button glow pulse
      gsap.to(btnRef.current, {
        boxShadow: '0 0 40px rgba(139,92,246,0.5), 0 0 80px rgba(139,92,246,0.2)',
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 2.5,
      })
    })
    return () => ctx.revert()
  }, [])

  function handleButtonHover(e: React.MouseEvent<HTMLButtonElement>, enter: boolean) {
    gsap.to(e.currentTarget, { scale: enter ? 1.06 : 1, duration: 0.25, ease: 'power2.out' })
  }

  async function signInWithGoogle() {
    gsap.to(btnRef.current, { scale: 0.93, duration: 0.1, yoyo: true, repeat: 1 })
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` },
    })
  }

  const features = ['🧠 Smart Quiz', '🤖 AI Roadmap', '💰 Salary Insights', '🏆 XP & Badges', '📊 Progress Tracker']

  return (
    <main className="min-h-screen flex flex-col overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #0d0a1a 40%, #0a0f1a 100%)' }}>

      {/* Subtle dot grid */}
      <div className="grid-overlay pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(circle, #a78bfa 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      {/* Animated orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="orb-1 absolute top-[-80px] left-[5%]  w-[500px] h-[500px] rounded-full blur-[120px]" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)' }} />
        <div className="orb-2 absolute top-[10%]  right-[-60px] w-[420px] h-[420px] rounded-full blur-[100px]" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)' }} />
        <div className="orb-3 absolute bottom-[5%]  left-[30%] w-[380px] h-[380px] rounded-full blur-[100px]" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)' }} />
        <div className="orb-4 absolute bottom-[20%] right-[10%] w-[300px] h-[300px] rounded-full blur-[80px]"  style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)' }} />
      </div>

      {/* Header */}
      <header ref={headerRef} className="relative z-10 opacity-0 px-6 py-5 flex items-center gap-3"
        style={{ borderBottom: '1px solid rgba(139,92,246,0.15)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)', boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}>
          🎓
        </div>
        <div>
          <h1 className="font-bold text-white tracking-tight">CareerAI</h1>
          <p className="text-xs" style={{ color: '#7c6aaa' }}>Student Career Guidance Platform</p>
        </div>
      </header>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center relative z-10">

        {/* Badge */}
        <div ref={badgeRef} className="opacity-0 inline-flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 tracking-wide"
          style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.35)', color: '#c4b5fd' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          AI-Powered Career Guidance
        </div>

        {/* Heading */}
        <h2 ref={h2Ref} className="opacity-0 text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-[1.1] tracking-tight"
          style={{ background: 'linear-gradient(135deg, #ffffff 0%, #e0d7ff 40%, #93c5fd 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Discover Your<br />Perfect Career Path
        </h2>

        {/* Paragraph */}
        <p ref={paraRef} className="opacity-0 text-lg max-w-2xl mb-10 leading-relaxed" style={{ color: '#8b7aa8' }}>
          Take a smart career quiz and let AI build you a personalized roadmap — with real salary data, promotion timelines, and gamified progress tracking.
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-12">
          {features.map(f => (
            <span key={f} className="feature-pill opacity-0 text-sm px-4 py-2 rounded-full font-medium"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(139,92,246,0.2)', color: '#a89cc8', backdropFilter: 'blur(8px)' }}>
              {f}
            </span>
          ))}
        </div>

        {/* Google Sign In Button */}
        <button
          ref={btnRef}
          onClick={signInWithGoogle}
          onMouseEnter={e => handleButtonHover(e, true)}
          onMouseLeave={e => handleButtonHover(e, false)}
          className="opacity-0 flex items-center gap-3 font-semibold px-8 py-4 rounded-2xl text-base mb-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #2563eb 100%)',
            color: '#ffffff',
            boxShadow: '0 4px 24px rgba(124,58,237,0.35)',
          }}
        >
          {/* shimmer overlay */}
          <span className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%)' }} />
          <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24">
            <path fill="#ffffff" fillOpacity="0.9" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#ffffff" fillOpacity="0.75" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#ffffff" fillOpacity="0.6" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#ffffff" fillOpacity="0.85" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="relative z-10">Continue with Google</span>
        </button>

        <p className="text-sm" style={{ color: '#4d4466' }}>No password required · Free forever · Your data stays yours</p>
      </div>

      {/* Stats bar */}
      <div ref={statsRef} className="opacity-0 relative z-10 py-8 px-4"
        style={{ borderTop: '1px solid rgba(139,92,246,0.1)', background: 'rgba(255,255,255,0.015)' }}>
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[['10', 'Career Paths'], ['50+', 'Skills Tracked'], ['100%', 'Free to Use']].map(([v, l]) => (
            <div key={l}>
              <div className="text-2xl font-extrabold" style={{ background: 'linear-gradient(135deg, #a78bfa, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{v}</div>
              <div className="text-sm mt-1" style={{ color: '#4d4466' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
