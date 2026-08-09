import { Link } from 'react-router-dom'

export default function EmptyState({ title, message, actionLabel, actionTo }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h2 className="text-4xl font-extrabold tracking-tight text-ink">{title}</h2>
      {message && <p className="mt-3 max-w-sm font-medium text-ink-soft">{message}</p>}
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="mt-6 text-sm font-bold text-accent underline-offset-4 hover:underline"
        >
          {actionLabel} →
        </Link>
      )}
    </div>
  )
}
