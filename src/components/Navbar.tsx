import { Button } from 'react-aria-components'
import { Grip, HelpCircle, Sparkles, ChevronDown } from 'lucide-react'

export function Navbar() {
  return (
    <header className="titan-navbar flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-2">
        <Button className="titan-navbar-icon-btn" aria-label="Menu">
          <Grip className="w-5 h-5" strokeWidth={1.5} />
        </Button>
        <img
          src={`${import.meta.env.BASE_URL}audiense-lockup-signal-core.svg`}
          alt="audiense"
          className="h-6 w-auto"
          style={{ aspectRatio: '559 / 94' }}
        />
      </div>
      <div className="flex items-center gap-1">
        <Button className="titan-navbar-icon-btn" aria-label="Help">
          <HelpCircle className="w-5 h-5" strokeWidth={1.5} />
        </Button>
        <Button className="titan-navbar-icon-btn" aria-label="Sparkle">
          <Sparkles className="w-5 h-5" strokeWidth={1.5} />
        </Button>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium shrink-0"
          style={{
            background: 'var(--surface-hover)',
            color: 'var(--copy-primary)',
          }}
          aria-hidden
        >
          A
        </div>
        <Button className="titan-navbar-icon-btn" aria-label="User menu">
          <ChevronDown className="w-5 h-5" strokeWidth={1.5} />
        </Button>
      </div>
    </header>
  )
}
