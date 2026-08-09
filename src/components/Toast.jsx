import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle2, Info, XCircle } from 'lucide-react'

// A minimal imperative toast system: call `showToast(message)` from
// anywhere, and mount <ToastContainer /> once near the root (see App.jsx).
// No external library — just a module-level subscriber list and a portal.

let nextId = 0
let toasts = []
let listeners = []

function notify() {
  listeners.forEach((listener) => listener(toasts))
}

export function showToast(message, type = 'info', duration = 3500) {
  const id = ++nextId
  toasts = [...toasts, { id, message, type }]
  notify()
  setTimeout(() => {
    toasts = toasts.filter((toast) => toast.id !== id)
    notify()
  }, duration)
  return id
}

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
}

export default function ToastContainer() {
  const [items, setItems] = useState(toasts)

  useEffect(() => {
    listeners.push(setItems)
    return () => {
      listeners = listeners.filter((listener) => listener !== setItems)
    }
  }, [])

  if (typeof document === 'undefined') return null

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex flex-col items-center gap-2 px-4">
      {items.map((toast) => {
        const Icon = ICONS[toast.type] || ICONS.info
        return (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto flex max-w-sm items-center gap-2 rounded-full border border-border bg-ink px-4 py-3 text-sm text-surface shadow-card"
          >
            <Icon size={16} className="flex-shrink-0" />
            <span>{toast.message}</span>
          </div>
        )
      })}
    </div>,
    document.body
  )
}
