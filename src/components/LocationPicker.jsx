import { useState } from 'react'
import { ChevronDown, Locate, MapPin } from 'lucide-react'
import { useLocationStore } from '../store/locationStore.js'
import { AVAILABLE_CITIES, getNearestCity } from '../lib/location.js'
import { showToast } from './Toast.jsx'

// Small trigger meant to sit directly under the wordmark in the navbar —
// not a page-wide banner. Opens a compact dropdown to set or change the
// city that Stores.jsx filters by.
export default function LocationPicker() {
  const city = useLocationStore((state) => state.city)
  const setCity = useLocationStore((state) => state.setCity)
  const [open, setOpen] = useState(false)
  const [locating, setLocating] = useState(false)

  function handleUseMyLocation() {
    if (!navigator.geolocation) {
      showToast('Location access is not available in this browser.', 'error')
      return
    }

    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nearest = getNearestCity(position.coords.latitude, position.coords.longitude)
        setLocating(false)
        setOpen(false)
        if (nearest) {
          setCity(nearest)
          showToast(`Showing stores near ${nearest}.`, 'success')
        } else {
          showToast("We don't have stores near you yet.", 'error')
        }
      },
      () => {
        setLocating(false)
        showToast('Could not access your location — pick a city instead.', 'error')
      },
      { timeout: 8000 }
    )
  }

  function handleSelectCity(selected) {
    setCity(selected)
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex items-center gap-1 font-manrope text-xs font-bold text-ink-soft transition-colors hover:text-accent"
      >
        <MapPin size={12} strokeWidth={2.5} className="text-accent" />
        {city ?? 'Set location'}
        <ChevronDown
          size={11}
          strokeWidth={2.5}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close location picker"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-2xl border-2 border-border bg-surface p-2.5 shadow-[0_6px_0_rgba(0,0,0,0.08)]">
            <button
              type="button"
              onClick={handleUseMyLocation}
              disabled={locating}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 font-manrope text-sm font-bold text-accent transition-colors hover:bg-accent-soft disabled:opacity-60"
            >
              <Locate size={16} strokeWidth={2.5} />
              {locating ? 'Finding you…' : 'Use my current location'}
            </button>

            <div className="my-2 border-t-2 border-border" />

            <ul className="space-y-0.5">
              {AVAILABLE_CITIES.map((option) => (
                <li key={option}>
                  <button
                    type="button"
                    onClick={() => handleSelectCity(option)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 font-manrope text-sm font-medium transition-colors hover:bg-bg-alt ${
                      option === city ? 'bg-bg-alt text-ink' : 'text-ink-soft'
                    }`}
                  >
                    {option}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}
