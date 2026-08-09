export default function CategoryChipsMobile({ categories, activeCategory, onSelect }) {
  return (
    <div className="-mx-5 mb-6 flex gap-2 overflow-x-auto px-5 pb-1 lg:hidden">
      {categories.map((category) => {
        const isActive = category.slug === activeCategory
        return (
          <button
            key={category.slug}
            type="button"
            onClick={() => onSelect(category.slug)}
            className={`flex-shrink-0 rounded-full border px-4 py-2 text-sm transition-colors ${
              isActive
                ? 'border-accent bg-accent text-surface font-medium'
                : 'border-border bg-surface text-ink-soft hover:text-ink'
            }`}
          >
            {category.label}
          </button>
        )
      })}
    </div>
  )
}
