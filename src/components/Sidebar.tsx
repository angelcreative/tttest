import { Button } from 'react-aria-components'
import { Home, FileText, Scale, Telescope, LayoutGrid, ChevronLeft, ChevronRight } from 'lucide-react'

type SidebarItemId = 'home' | 'all-reports' | 'audience-overlap' | 'creator-discovery' | 'more'

const SIDEBAR_STRUCTURE: Array<
  | { type: 'header'; label: string }
  | { type: 'item'; id: SidebarItemId; label: string; icon: typeof Home }
> = [
  { type: 'item', id: 'home', label: 'Home', icon: Home },
  { type: 'header', label: 'REPORTS' },
  { type: 'item', id: 'all-reports', label: 'All reports', icon: FileText },
  { type: 'header', label: 'WORKFLOWS' },
  { type: 'item', id: 'audience-overlap', label: 'Audience overlap', icon: Scale },
  { type: 'item', id: 'creator-discovery', label: 'Creator discovery', icon: Telescope },
  { type: 'item', id: 'more', label: 'More apps', icon: LayoutGrid },
]

interface SidebarProps {
  collapsed?: boolean
  onToggle?: () => void
}

export function Sidebar({ collapsed = true, onToggle }: SidebarProps) {
  const activeId: SidebarItemId = 'creator-discovery'

  return (
    <aside
      className="titan-sidebar flex flex-col flex-shrink-0 border-r border-[var(--divider)]"
      style={{ width: collapsed ? '72px' : '14rem' }}
      data-expanded={!collapsed}
    >
      {/* Expand/collapse — encima de Home */}
      <Button
        onPress={onToggle}
        className="titan-sidebar-icon-btn mb-2"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <ChevronRight className="w-5 h-5 shrink-0" strokeWidth={1.5} />
        ) : (
          <ChevronLeft className="w-5 h-5 shrink-0" strokeWidth={1.5} />
        )}
      </Button>

      {SIDEBAR_STRUCTURE.map((row) => {
        if (row.type === 'header') {
          return (
            <div
              key={row.label}
              className="titan-sidebar-header px-4 pt-4 pb-1 text-xs font-semibold uppercase tracking-wider"
              style={{ color: 'var(--copy-tertiary)' }}
            >
              {row.label}
            </div>
          )
        }
        const { id, label, icon: Icon } = row
        const isActive = activeId === id
        return (
          <Button
            key={id}
            className={`titan-sidebar-item ${isActive ? 'is-active' : ''}`}
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon className="w-5 h-5 shrink-0" strokeWidth={1.5} />
            <span className="titan-sidebar-item-label truncate text-left flex-1">{label}</span>
          </Button>
        )
      })}
    </aside>
  )
}
