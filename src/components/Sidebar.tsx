import { useState } from 'react'
import { Home, FileText, CircleDot, Telescope, LayoutGrid, ChevronLeft, ChevronRight } from 'lucide-react'

interface NavItem {
  label: string
  icon?: React.ReactNode
  active?: boolean
  header?: boolean
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const nav: NavItem[] = [
    { label: 'Home', icon: <Home className="w-5 h-5 flex-shrink-0" />, active: false },
    { label: 'Reports', header: true },
    { label: 'All reports', icon: <FileText className="w-5 h-5 flex-shrink-0" /> },
    { label: 'Workflows', header: true },
    { label: 'Audience overlap', icon: <CircleDot className="w-5 h-5 flex-shrink-0" /> },
    { label: 'Creator discovery', icon: <Telescope className="w-5 h-5 flex-shrink-0" />, active: true },
    { label: 'More apps', icon: <LayoutGrid className="w-5 h-5 flex-shrink-0" /> },
  ]

  return (
    <aside
      className={`flex-shrink-0 bg-gray-100 border-r border-gray-200 flex flex-col py-4 transition-[width] duration-200 ${
        collapsed ? 'w-[4.5rem]' : 'w-56'
      }`}
    >
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        className="mx-2 mb-2 p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-200 flex items-center justify-center"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
      </button>
      {nav.map((item) => {
        if (item.header) {
          if (collapsed) return null
          return (
            <div key={item.label} className="px-4 pt-4 pb-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {item.label}
            </div>
          )
        }
        return (
          <a
            key={item.label}
            href="#"
            className={`mx-2 px-3 py-2 rounded-lg flex items-center gap-3 text-sm font-medium transition-colors ${
              item.active ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-200/70'
            } ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? item.label : undefined}
          >
            {item.icon}
            {!collapsed && <span className="truncate flex-1">{item.label}</span>}
          </a>
        )
      })}
    </aside>
  )
}
