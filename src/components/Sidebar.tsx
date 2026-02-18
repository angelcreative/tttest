import { Button } from 'react-aria-components'
import { Home, FileText, Scale, Telescope, LayoutGrid, ChevronLeft, ChevronRight } from 'lucide-react'
import { TitanIconButton } from 'titan-compositions'

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
      className="sidebar"
      data-expanded={!collapsed}
    >
      <TitanIconButton
        variant="ghost"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        onPress={onToggle}
        className="sidebar-toggle"
      >
        {collapsed ? <ChevronRight /> : <ChevronLeft />}
      </TitanIconButton>

      {SIDEBAR_STRUCTURE.map((row) => {
        if (row.type === 'header') {
          return (
            <div key={row.label} className="sidebar-header">
              {row.label}
            </div>
          )
        }
        const { id, label, icon: Icon } = row
        const isActive = activeId === id
        return (
          <Button
            key={id}
            className="menu-item sidebar-item"
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="menu-item-start">
              <span className="menu-item-icon" aria-hidden>
                <Icon />
              </span>
              <span className="sidebar-item-label">{label}</span>
            </span>
          </Button>
        )
      })}
    </aside>
  )
}
