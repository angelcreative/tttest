import { TitanBreadcrumb } from 'titan-compositions'

export interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
  /** Navegación al hacer clic en este ítem (ancestros). Si no se pasa, el ítem sigue siendo clicable pero no hace nada. */
  onPress?: () => void
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[]
}

const DEFAULT_ITEMS: BreadcrumbItem[] = [{ label: 'Home', current: true }]

export function Breadcrumb({ items = DEFAULT_ITEMS }: BreadcrumbProps) {
  const last = items[items.length - 1]
  const ancestors = items.length > 1 ? items.slice(0, -1) : []
  const titanItems = ancestors.map((item, i) => ({
    id: `breadcrumb-${i}-${item.label}`,
    label: item.label,
    onPress: item.onPress,
  }))

  return (
    <div className="flex items-center px-6">
      <TitanBreadcrumb
        items={titanItems}
        currentLabel={last?.label ?? 'Home'}
        ariaLabel="Breadcrumb"
      />
    </div>
  )
}
