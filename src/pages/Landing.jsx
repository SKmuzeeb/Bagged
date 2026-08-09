import { Link } from 'react-router-dom'
import { ArrowRight, Leaf, Users, Wallet } from 'lucide-react'
import { useInView } from '../hooks/useInView.js'
import PullQuote from '../components/PullQuote.jsx'
import { HERO_IMAGES } from '../lib/imageMap.js'
import { FEATURED_KIRANA } from '../data/kiranas.js'

function Reveal({ children, className = '' }) {
  const [ref, inView] = useInView()
  return (
    <div ref={ref} className={`${inView ? 'animate-fade-up' : 'opacity-0'} ${className}`}>
      {children}
    </div>
  )
}

const VALUE_PROPS = [
  {
    icon: Wallet,
    title: 'No delivery fees',
    description: 'You pick it up, so there’s nothing to pay for getting it to you.',
  },
  {
    icon: Leaf,
    title: 'Fresh, hand-picked',
    description: 'Your kirana selects each item themselves — the same way they always have.',
  },
  {
    icon: Users,
    title: 'Keep the human bond',
    description: 'A quick hello at the counter, not a stranger at your door.',
  },
]

const STEPS = [
  {
    number: '01',
    title: 'Browse your kirana',
    description: 'Open the shop and pick what you need, at your own pace.',
  },
  {
    number: '02',
    title: 'Choose a pickup time',
    description: 'Pick an hourly slot that fits your day — first available in 30 minutes.',
  },
  {
    number: '03',
    title: 'Walk in and collect',
    description: 'Pay at the counter like always. No waiting while it’s packed.',
  },
]

export default function Landing() {
  return (
    <div className="bg-bg">
      {/* Hero */}
      <section className="mx-auto max-w-[1280px] px-5 pb-16 pt-14 md:px-8 md:pb-24 md:pt-20 lg:px-12">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16">
          <div className="w-full lg:w-[58%]">
            <p className="mb-4 font-manrope text-xs font-bold uppercase tracking-wider text-accent">
              For your neighborhood.
            </p>
            <h1 className="font-manrope text-5xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-6xl lg:text-7xl">
              your kirana, zipped.
            </h1>
            <p className="mt-6 max-w-lg font-manrope text-lg font-medium leading-relaxed text-ink-soft">
              Order from your local kirana. Pick up when you're ready. Keep the bond, skip the wait.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-6">
              <Link
                to="/stores"
                className="rounded-full bg-accent px-7 py-3.5 font-manrope text-sm font-bold text-white transition-colors hover:bg-accent-hover"
              >
                Start ordering
              </Link>
              <a
                href="#how-it-works"
                className="font-manrope text-sm font-bold text-ink-soft transition-colors hover:text-ink"
              >
                How it works ↓
              </a>
            </div>
          </div>

          <div className="w-full lg:w-[42%]">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-border">
              <img
                src={HERO_IMAGES.storefront}
                alt="A neighborhood kirana storefront"
                className="h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = 'none'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="border-y-2 border-border bg-bg py-16 md:py-24">
        <Reveal className="mx-auto grid max-w-[1280px] grid-cols-1 gap-10 px-5 sm:grid-cols-3 md:px-8 lg:px-12">
          {VALUE_PROPS.map(({ icon: Icon, title, description }) => (
            <div key={title}>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                <Icon size={20} strokeWidth={2.5} />
              </div>
              <h3 className="mt-4 font-manrope text-lg font-bold text-ink">{title}</h3>
              <p className="mt-1.5 font-manrope text-sm font-medium leading-relaxed text-ink-soft">
                {description}
              </p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-24 py-16 md:py-24">
        <Reveal className="mx-auto max-w-[1280px] px-5 md:px-8 lg:px-12">
          <h2 className="mb-12 font-manrope text-4xl font-extrabold tracking-tight text-ink">how it works</h2>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
            {STEPS.map((step) => (
              <div key={step.number}>
                <span className="font-manrope text-5xl font-extrabold text-accent">{step.number}</span>
                <h3 className="mt-3 font-manrope text-lg font-bold text-ink">{step.title}</h3>
                <p className="mt-1.5 font-manrope text-sm font-medium leading-relaxed text-ink-soft">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Meet your kirana */}
      <section className="py-16 md:py-24">
        <Reveal className="mx-auto max-w-[1280px] px-5 md:px-8 lg:px-12">
          <div className="flex flex-col overflow-hidden rounded-3xl border-2 border-border bg-surface md:flex-row">
            <div className="aspect-[4/3] w-full md:aspect-auto md:w-[38%]">
              <img
                src={HERO_IMAGES.shopkeeperPortrait}
                alt={`${FEATURED_KIRANA.owner_name}, owner of ${FEATURED_KIRANA.name}`}
                className="h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = 'none'
                }}
              />
            </div>
            <div className="flex flex-1 flex-col justify-center p-8 md:p-12">
              <p className="font-manrope text-xs font-bold uppercase tracking-wider text-accent">
                Meet your kirana
              </p>
              <h3 className="mt-2 font-manrope text-3xl font-bold text-ink">{FEATURED_KIRANA.name}</h3>
              <p className="mt-1 font-manrope font-medium text-ink-soft">{FEATURED_KIRANA.owner_name}</p>
              <p className="mt-4 font-manrope text-sm font-medium leading-relaxed text-ink-soft">
                {FEATURED_KIRANA.address}
              </p>
              <p className="mt-3 font-manrope text-sm font-medium text-ink-muted">{FEATURED_KIRANA.tagline}</p>
              <p className="mt-4 font-manrope text-sm font-bold text-ink">7 AM – 10 PM, every day</p>
              <Link
                to="/stores"
                className="mt-5 inline-flex items-center gap-1.5 font-manrope text-sm font-bold text-accent hover:underline"
              >
                See all stores <ArrowRight size={15} strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Closing quote */}
      <section className="border-t-2 border-border py-20 md:py-28">
        <Reveal>
          <PullQuote>The best kirana knows your name. We just help you skip the wait.</PullQuote>
        </Reveal>
      </section>
    </div>
  )
}
