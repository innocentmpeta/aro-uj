interface SectionNavItem {
  id: string
  label: string
}

export default function SectionNav({ items }: { items: SectionNavItem[] }) {
  return (
    <div className="sticky top-16 z-30 bg-white border-b border-border">
      <div className="container">
        <nav className="flex gap-1 overflow-x-auto py-3">
          {items.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className="font-body text-xs font-medium text-muted hover:text-forest
                         hover:bg-surface px-3 py-1.5 rounded-full whitespace-nowrap transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  )
}
