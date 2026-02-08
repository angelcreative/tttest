import { HelpCircle, Sparkles, ChevronDown } from 'lucide-react'

export function Header() {
  return (
    <header className="flex-shrink-0 flex items-center justify-between h-14 px-6 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-2">
        <img
          src={`${import.meta.env.BASE_URL}audiense-lockup-signal-core.svg`}
          alt="audiense"
          className="h-6 w-auto"
          style={{ aspectRatio: '559 / 94' }}
        />
      </div>
      <div className="flex items-center gap-4">
        <button type="button" className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100" aria-label="Help">
          <HelpCircle className="w-5 h-5" />
        </button>
        <button type="button" className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100" aria-label="Sparkle">
          <Sparkles className="w-5 h-5" />
        </button>
        <button type="button" className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-600 hover:bg-gray-400">
          A
        </button>
        <button type="button" className="p-1 text-gray-400" aria-label="Menu">
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
