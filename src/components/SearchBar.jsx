import { Search } from 'lucide-react'

export default function SearchBar({ value, onChange, placeholder = 'Search products' }) {
  return (
    <div className="relative">
      <Search
        size={16}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
      />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full rounded-full border border-border bg-surface py-3 pl-11 pr-4 text-sm text-ink placeholder:text-ink-muted focus:border-ink/30 focus:outline-none focus:ring-2 focus:ring-accent/20"
      />
    </div>
  )
}
