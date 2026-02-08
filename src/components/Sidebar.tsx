import { Home, FileText, CircleDot, Telescope, LayoutGrid, ChevronLeft, ChevronRight } from 'lucide-react'

interface NavItem {
  label: string
  icon?: React.ReactNode
  active?: boolean
  collapse?: boolean
  expand?: boolean
  header?: boolean
}

export function Sidebar() {
  const nav: NavItem[] = [
    { label: 'Home', icon: <Home className="w-5 h-5" />, active: false, collapse: true },
    { label: 'Reports', header: true },
    { label: 'All reports', icon: <FileText className="w-5 h-5" /> },
    { label: 'Workflows', header: true },
    { label: 'Audience overlap', icon: <CircleDot className="w-5 h-5" /> },
    { label: 'Creator discovery', icon: <Telescope className="w-5 h-5" />, active: true },
    { label: 'More apps', icon: <LayoutGrid className="w-5 h-5" />, expand: true },
  ]

  return (
    <aside className="w-56 flex-shrink-0 bg-gray-100 border-r border-gray-200 flex flex-col py-4">
      {nav.map((item) => {
        if (item.header) {
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
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
            {(item.collapse ?? item.expand) && (
              <span className="ml-auto text-gray-400">
                {item.collapse ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </span>
            )}
          </a>
        )
      })}
    </aside>
  )
}
