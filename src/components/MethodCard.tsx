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
      className={`relative w-full text-left rounded-xl border p-6 transition-colors ${
        selected
          ? 'border-[var(--divider)]'
          : 'bg-white border-[var(--divider)] hover:border-[var(--color-black-200)] hover:bg-[var(--surface-hover)]'
      }`}
      style={{
        borderWidth: '1px',
        ...(selected ? { background: 'var(--color-teal-100)' } : {}),
      }}
    >
      <span
        className={`absolute top-4 right-4 w-6 h-6 rounded flex items-center justify-center border-2 ${
          selected
            ? 'bg-[var(--button-primary)] border-[var(--button-primary)]'
            : 'border-[var(--color-black-200)] bg-white'
        }`}
        aria-hidden
      >
        {selected && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
      </span>
      <div className="flex gap-4">
        <TikTokLogo className="w-10 h-10 flex-shrink-0" />
        <div className="min-w-0">
          <p className="font-semibold" style={{ color: 'var(--copy-primary)' }}>{title}</p>
          <p className="text-sm mt-1" style={{ color: 'var(--copy-tertiary)' }}>{description}</p>
        </div>
      </div>
    </button>
  )
}
