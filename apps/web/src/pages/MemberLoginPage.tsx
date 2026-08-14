import { useState, FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@arouj/firebase-config'
import { LogIn, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function MemberLoginPage() {
  const { user, loading: authLoading } = useAuth()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)

  if (!authLoading && user) return <Navigate to="/members" replace />

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      // onAuthStateChanged in AuthContext will redirect automatically
    } catch {
      setError('Incorrect email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] bg-surface flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <div className="font-display font-bold text-forest text-xl mb-1">Reclaiming Praxis</div>
          <p className="font-body text-small text-muted">Member area</p>
        </div>

        <div className="bg-white rounded-2xl border border-border p-8">
          <h1 className="font-display font-bold text-ink text-h3 mb-6">Sign in</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 font-body text-small rounded-xl px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-body text-xs font-semibold text-muted uppercase tracking-wide block mb-1.5" htmlFor="email">
                Email address
              </label>
              <input
                id="email" type="email" required autoComplete="email"
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-border rounded-xl px-4 py-3 font-body text-small
                           focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest
                           placeholder:text-muted/40 transition-colors"
              />
            </div>

            <div>
              <label className="font-body text-xs font-semibold text-muted uppercase tracking-wide block mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password" type={showPw ? 'text' : 'password'} required autoComplete="current-password"
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-border rounded-xl px-4 py-3 pr-10 font-body text-small
                             focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest
                             placeholder:text-muted/40 transition-colors"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                  onClick={() => setShowPw(!showPw)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
              {loading ? 'Signing in…' : <><LogIn size={16} /> Sign in</>}
            </button>
          </form>
        </div>

        <p className="text-center font-body text-xs text-muted mt-4">
          Access is restricted to ARO-UJ Praxis Network members.<br />
          Contact the network coordinator if you need access.
        </p>
      </div>
    </div>
  )
}
