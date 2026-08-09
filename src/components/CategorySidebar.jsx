export default function CategorySidebar({ categories, activeCategory, onSelect, inStockOnly, onToggleInStock }) {
  return (
    <aside className="hidden lg:block lg:w-[240px] lg:flex-shrink-0">
      <div className="sticky top-24 space-y-8">
        <div>
          <h2 className="mb-3 text-lg font-bold text-ink">Categories</h2>
          <nav className="flex flex-col">
            {categories.map((category) => {
              const isActive = category.slug === activeCategory
              return (
                <button
                  key={category.slug}
                  type="button"
                  onClick={() => onSelect(category.slug)}
                  className={`border-l-2 px-4 py-2.5 text-left text-sm transition-colors ${
                    isActive
                      ? 'border-accent bg-accent-soft font-medium text-ink'
                      : 'border-transparent text-ink-soft hover:text-ink'
                  }`}
                >
                  {category.label}
                </button>
              )
            })}
          </nav>
        </div>

        <label className="flex cursor-pointer items-center justify-between rounded-xl border border-border bg-surface px-4 py-3">
          <span className="text-sm text-ink">In stock only</span>
          <span className="relative inline-flex h-5 w-9 flex-shrink-0 items-center">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={onToggleInStock}
              className="peer sr-only"
            />
            <span className="absolute inset-0 rounded-full bg-border transition-colors peer-checked:bg-accent" />
            <span className="absolute left-0.5 h-4 w-4 rounded-full bg-surface shadow-sm transition-transform peer-checked:translate-x-4" />
          </span>
        </label>
      </div>
    </aside>
  )
}
