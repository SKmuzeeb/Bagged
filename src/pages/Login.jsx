import { useState } from 'react'
import { Mail } from 'lucide-react'
import { useAuthStore } from '../store/authStore.js'

export default function Login() {
  const [email, setEmail] = useState('')
  const sendMagicLink = useAuthStore((state) => state.sendMagicLink)
  const status = useAuthStore((state) => state.status)

  async function handleSubmit(event) {
    event.preventDefault()
    if (!email.trim()) return
    await sendMagicLink(email.trim())
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-5 py-20 text-center">
      {status === 'sent' ? (
        <>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent">
            <Mail size={22} />
          </div>
          <h1 className="mt-6 font-display text-4xl font-medium text-ink">Check your inbox</h1>
          <p className="mt-3 text-ink-soft">
            We've sent a sign-in link to <span className="font-medium text-ink">{email}</span>.
          </p>
        </>
      ) : (
        <>
          <h1 className="font-display text-4xl font-medium text-ink">Welcome</h1>
          <p className="mt-3 text-ink-soft">Sign in with your email — no password.</p>

          <form onSubmit={handleSubmit} className="mt-8 w-full space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              aria-label="Email address"
              className="w-full rounded-full border border-border bg-surface px-6 py-4 text-center text-base text-ink placeholder:text-ink-muted focus:border-ink/30 focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full rounded-full bg-accent px-6 py-4 text-sm font-medium text-surface transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:bg-ink-muted"
            >
              {status === 'sending' ? 'Sending…' : 'Send magic link'}
            </button>
          </form>
        </>
      )}
    </div>
  )
}
