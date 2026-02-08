import { TikTokLogo } from './TikTokLogo'
import { Check } from 'lucide-react'

interface MethodCardProps {
  title: string
  description: string
  selected: boolean
  onSelect: () => void
}

/** Reusable selection card with TikTok logo, title, description, and checkbox (Campaign / Brand mentions style). */
export function MethodCard({ title, description, selected, onSelect }: MethodCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative w-full text-left rounded-xl border-2 p-6 transition-colors ${
        selected
          ? 'bg-emerald-50 border-emerald-200'
          : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      <span
        className={`absolute top-4 right-4 w-6 h-6 rounded flex items-center justify-center border-2 ${
          selected ? 'bg-primary-600 border-primary-600' : 'border-gray-300 bg-white'
        }`}
        aria-hidden
      >
        {selected && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
      </span>
      <div className="flex gap-4">
        <TikTokLogo className="w-10 h-10 flex-shrink-0" />
        <div className="min-w-0">
          <p className="font-semibold text-gray-900">{title}</p>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
      </div>
    </button>
  )
}
