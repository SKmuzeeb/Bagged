export default function PullQuote({ children }) {
  return (
    <blockquote className="mx-auto max-w-2xl text-center">
      <p className="font-display text-3xl italic leading-snug text-ink" style={{ fontVariationSettings: "'opsz' 40" }}>
        {children}
      </p>
    </blockquote>
  )
}
