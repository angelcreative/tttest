export interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[]
}

const DEFAULT_ITEMS: BreadcrumbItem[] = [{ label: 'Home', current: true }]

export function Breadcrumb({ items = DEFAULT_ITEMS }: BreadcrumbProps) {
  return (
    <nav
      className="flex items-center py-3 px-6 text-sm border-b border-[var(--divider)] bg-[var(--surface-page)]"
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center gap-2 list-none p-0 m-0">
        {items.map((item, i) => (
          <li key={item.label + i} className="flex items-center gap-2">
            {i > 0 && (
              <span className="text-[var(--copy-tertiary)]" aria-hidden>
                &gt;
              </span>
            )}
            {item.current ? (
              <span className="text-[var(--copy-tertiary)]" aria-current="page">
                {item.label}
              </span>
            ) : item.href ? (
              <a
                href={item.href}
                className="text-[var(--copy-secondary)] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)] focus-visible:ring-offset-1 rounded"
              >
                {item.label}
              </a>
            ) : (
              <span className="text-[var(--copy-tertiary)]">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
