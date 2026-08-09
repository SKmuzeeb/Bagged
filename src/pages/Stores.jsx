import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, MapPin, Search, Store } from 'lucide-react'
import { KIRANAS } from '../data/kiranas.js'
import { useLocationStore } from '../store/locationStore.js'
import EmptyState from '../components/EmptyState.jsx'

function isKiranaOpenNow(kirana) {
  const now = new Date()
  const minutesNow = now.getHours() * 60 + now.getMinutes()

  const [openHour, openMinute] = kirana.hours_open.split(':').map(Number)
  const [closeHour, closeMinute] = kirana.hours_close.split(':').map(Number)

  return minutesNow >= openHour * 60 + openMinute && minutesNow < closeHour * 60 + closeMinute
}

function StoreCard({ kirana, onSelect }) {
  const open = isKiranaOpenNow(kirana)

  return (
    <button
      type="button"
      onClick={() => onSelect(kirana.id)}
      className="group relative flex cursor-pointer flex-col items-start rounded-3xl border-2 border-border bg-surface p-6 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-ink hover:shadow-[0_6px_0_rgba(0,0,0,0.08)]"
    >
      <span
        className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
          open ? 'bg-success text-white' : 'bg-ink-muted text-white'
        }`}
      >
        {open ? 'Open' : 'Closed'}
      </span>

      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
        <Store size={24} strokeWidth={2.5} />
      </div>

      <h3 className="mt-4 font-manrope text-xl font-bold text-ink">{kirana.name}</h3>
      <p className="mt-1 font-manrope text-base font-medium text-ink-soft">{kirana.owner_name}</p>

      <div className="mt-3 flex items-center gap-2 font-manrope text-sm font-medium text-ink-soft">
        <MapPin size={16} strokeWidth={2.5} className="flex-shrink-0" />
        <span>{kirana.locality}</span>
      </div>

      <p className="mt-3 font-manrope text-sm font-medium text-ink-muted">{kirana.tagline}</p>

      <ArrowRight
        size={20}
        strokeWidth={2.5}
        className="absolute bottom-6 right-6 text-ink opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      />
    </button>
  )
}

export default function Stores() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const city = useLocationStore((state) => state.city)

  const hasQuery = query.trim().length > 0

  const filteredKiranas = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const scoped = city ? KIRANAS.filter((kirana) => kirana.city === city) : KIRANAS

    if (!normalizedQuery) return scoped

    return scoped.filter((kirana) => {
      const haystack = `${kirana.name} ${kirana.locality} ${kirana.address}`.toLowerCase()
      return haystack.includes(normalizedQuery)
    })
  }, [query, city])

  // Without a city, "browse everything" is exactly how someone ends up
  // ordering from a store they can never walk into — so the default grid
  // stays gated behind picking a location. An explicit search still runs
  // across every city, since that's a deliberate lookup, not passive browsing.
  const showLocationPrompt = !city && !hasQuery

  return (
    <main className="min-h-screen bg-bg">
      {/* Hero */}
      <section className="mx-auto max-w-[1280px] px-5 py-16 text-center md:px-8 md:py-20 lg:px-12">
        <p className="mb-4 font-manrope text-xs font-bold uppercase tracking-widest text-accent">
          Find your kirana
        </p>
        <h1 className="mb-6 font-manrope text-6xl font-extrabold leading-[1.05] tracking-tight text-ink lg:text-7xl">
          find your kirana.
        </h1>
        <p className="mx-auto mb-8 max-w-2xl font-manrope text-lg font-medium text-ink-soft">
          One store at a time. Pick your kirana, browse their bag, walk in ready.
        </p>

        <div className="relative mx-auto max-w-2xl">
          <Search
            size={22}
            strokeWidth={2.5}
            className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-ink-soft"
          />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="search stores by name or area..."
            aria-label="Search stores by name or area"
            className="w-full rounded-2xl border-2 border-border bg-surface py-4 pl-14 pr-5 font-manrope text-base font-medium text-ink placeholder:font-medium placeholder:text-ink-muted focus:border-2 focus:border-accent focus:outline-none"
          />
        </div>
      </section>

      {/* Store grid */}
      <section className="mx-auto max-w-[1280px] px-5 pb-16 md:px-8 md:pb-20 lg:px-12">
        {showLocationPrompt ? (
          <EmptyState
            title="Set your location"
            message="Use the location picker above to find kiranas you can actually walk into for pickup."
            variant="zip"
          />
        ) : filteredKiranas.length === 0 ? (
          <EmptyState
            title="No stores found"
            message={
              city
                ? `No stores match that search in ${city} yet.`
                : 'Try a different store name or locality.'
            }
            variant="zip"
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredKiranas.map((kirana) => (
              <StoreCard key={kirana.id} kirana={kirana} onSelect={(id) => navigate(`/shop/${id}`)} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
