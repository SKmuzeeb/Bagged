export default function PullQuote({ children }) {
  return (
    <blockquote className="mx-auto max-w-2xl text-center">
      <p className="text-3xl font-extrabold leading-snug tracking-tight text-ink">{children}</p>
    </blockquote>
  )
}
