import { Button } from 'react-aria-components'
import { Check } from 'lucide-react'
import { TikTokLogo } from './TikTokLogo'

interface MethodCardProps {
  title: string
  description: string
  selected: boolean
  onSelect: () => void
}

/** Selection card aligned with NetworkCard: same border, selected background, Titan checkbox indicator. */
export function MethodCard({ title, description, selected, onSelect }: MethodCardProps) {
  return (
    <Button
      onPress={onSelect}
      className="relative w-full text-left rounded-xl border p-6 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)] focus-visible:ring-offset-2"
      style={{
        borderWidth: '1px',
        borderColor: 'var(--divider)',
        ...(selected ? { background: 'var(--tab-selected-background)' } : {}),
        boxShadow: 'var(--elevation-shadow-s, none)',
      }}
    >
      {/* Titan-compliant checkbox indicator: same tokens as TitanCheckboxField (.checkbox-box + .checkbox-mark) */}
      <div
        className="checkbox-root absolute top-4 right-4 pointer-events-none flex items-center justify-center"
        data-selected={selected ? true : undefined}
        aria-hidden
      >
        <span className="checkbox-box">
          <Check className="checkbox-mark" strokeWidth={3} />
        </span>
      </div>

      <div className="flex gap-4">
        <TikTokLogo className="w-10 h-10 flex-shrink-0" />
        <div className="min-w-0">
          <p className="font-semibold m-0" style={{ color: 'var(--copy-primary)' }}>{title}</p>
          <p className="text-sm mt-1 m-0" style={{ color: 'var(--copy-tertiary)' }}>{description}</p>
        </div>
      </div>
    </Button>
  )
}
