'use client'
import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClientComponentClient()
  const router = useRouter()

  const login = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else router.push('/dashboard')
    setLoading(false)
  }

  const s = {
    page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: '#F5F0E8' },
    card: { background: 'white', borderRadius: 20, padding: 36, width: '100%', maxWidth: 380, boxShadow: '0 4px 40px rgba(0,0,0,0.08)' },
    title: { fontFamily: 'Georgia, serif', fontSize: 30, marginBottom: 4, color: '#1C1A17' },
    sub: { fontSize: 14, color: '#8A8178', marginBottom: 28 },
    label: { fontSize: 12, color: '#8A8178', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: 6 },
    input: { width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #EDE7D9', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'sans-serif' },
    btn: { width: '100%', padding: 13, background: '#1C1A17', color: '#F5F0E8', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: 'pointer', marginTop: 4 },
    error: { background: '#fde8e8', color: '#c0392b', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 },
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.title}>Family OS 🌿</div>
        <div style={s.sub}>Sign in to your family dashboard</div>
        {error && <div style={s.error}>{error}</div>}
        <div style={{ marginBottom: 14 }}>
          <label style={s.label}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} style={s.input} placeholder="you@email.com" />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={s.label}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} style={s.input} placeholder="••••••••" />
        </div>
        <button onClick={login} disabled={loading} style={s.btn}>
          {loading ? 'Signing in…' : 'Sign in →'}
        </button>
      </div>
    </div>
  )
}
