import { Link, NavLink } from 'react-router-dom'
import { ShoppingBag, User } from 'lucide-react'
import { useCartStore } from '../store/cartStore.js'
import { useAuthStore } from '../store/authStore.js'

const NAV_LINKS = [
  { to: '/shop', label: 'Shop' },
  { to: '/#how-it-works', label: 'How it works' },
  { to: '/orders', label: 'Orders' },
]

export default function Navbar() {
  const itemCount = useCartStore((state) => state.items.length)
  const user = useAuthStore((state) => state.user)

  return (
    <header className="sticky top-0 z-40 h-20 border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-content items-center justify-between px-5 md:px-8 lg:px-12">
        <Link to="/" className="font-display text-2xl font-medium tracking-tight text-ink">
          Tayaar
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm transition-colors ${
                  isActive ? 'font-medium text-ink' : 'text-ink-soft hover:text-ink'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/cart"
            aria-label={`View bag, ${itemCount} item${itemCount === 1 ? '' : 's'}`}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-bg"
          >
            <ShoppingBag size={19} strokeWidth={1.75} />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[11px] font-medium text-surface">
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <Link
              to="/orders"
              aria-label="Your account"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-surface"
            >
              <User size={16} />
            </Link>
          ) : (
            <Link
              to="/login"
              className="rounded-full border border-ink px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-surface"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
