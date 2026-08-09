export default function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-2 px-5 text-sm text-ink-soft md:flex-row md:px-8 lg:px-12">
        <span className="font-display text-base text-ink">Tayaar</span>
        <span>A portfolio demo — no real orders, no real payments.</span>
        <span>Built with React, Vite &amp; Supabase.</span>
      </div>
    </footer>
  )
}
