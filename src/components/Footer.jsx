export default function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-2 px-5 text-sm text-ink-soft md:flex-row md:px-8 lg:px-12">
        <span className="flex items-baseline gap-[2px] font-manrope text-base font-extrabold tracking-tight text-accent">
          zippd
          <span className="h-[5px] w-[5px] flex-shrink-0 translate-y-[-1px] rounded-full bg-electric" aria-hidden="true" />
        </span>
        <span>A portfolio demo — no real orders, no real payments.</span>
        <span>Built with React, Vite &amp; Supabase.</span>
      </div>
    </footer>
  )
}
