import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../store/authStore.js'

// Where the emailed magic link points: /auth/callback?token=<link token>.
// Exchanges that token for a session, then sends the user on their way.
export default function AuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const verifySession = useAuthStore((state) => state.verifySession)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      setError('This link is missing its token.')
      return
    }

    verifySession(token).then((result) => {
      if (result.ok) {
        navigate('/orders', { replace: true })
      } else {
        setError(result.error || 'This link is invalid or has expired.')
      }
    })
  }, [searchParams, verifySession, navigate])

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-5 py-20 text-center">
      {error ? (
        <>
          <h1 className="text-4xl font-extrabold tracking-tight text-ink lowercase">link expired.</h1>
          <p className="mt-3 text-ink-soft">{error}</p>
          <Link to="/login" className="mt-6 text-sm font-bold text-accent underline-offset-4 hover:underline">
            Request a new link →
          </Link>
        </>
      ) : (
        <>
          <h1 className="text-4xl font-extrabold tracking-tight text-ink lowercase">signing you in.</h1>
          <p className="mt-3 text-ink-soft">Just a moment…</p>
        </>
      )}
    </div>
  )
}
