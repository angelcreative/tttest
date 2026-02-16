import { useState } from 'react'
import { ArrowLeft, ArrowRight, User } from 'lucide-react'
import { MethodCard } from './MethodCard'

export type TikTokMethodId = 'campaign' | 'brand-mentions'

interface ChooseTikTokMethodProps {
  onBack: () => void
  onNext: (methodId: TikTokMethodId) => void
}

const methods: { id: TikTokMethodId; title: string; description: string }[] = [
  {
    id: 'campaign',
    title: 'Campaign Collab',
    description:
      'Find creators based on specified criteria to invite to new or existing campaigns.',
  },
  {
    id: 'brand-mentions',
    title: 'Brand mentions',
    description: 'Find creators who mentioned your brand and send link requests.',
  },
]

export function ChooseTikTokMethod({ onBack, onNext }: ChooseTikTokMethodProps) {
  const [selectedId, setSelectedId] = useState<TikTokMethodId>('campaign')

  const handleNext = () => onNext(selectedId)

  return (
    <div className="p-6 flex-1 min-w-0">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="p-2 -ml-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">Choose TikTok method</h1>
          </div>
          <button
            type="button"
            onClick={handleNext}
            className="titan-btn-primary px-5 py-2.5 rounded-lg inline-flex items-center justify-center gap-2"
          >
            Next
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Connected Account — misma sección que Creator Search / Brand Mentions */}
        <div
          className="flex items-center gap-4 rounded-xl border px-4 py-3 mb-6"
          style={{ background: 'var(--surface-1)', borderColor: 'var(--divider)' }}
        >
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
            style={{ background: 'var(--color-black-100)' }}
          >
            <User className="h-5 w-5" style={{ color: 'var(--copy-secondary)' }} strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium" style={{ color: 'var(--copy-tertiary)' }}>Connected Account:</p>
            <p className="truncate text-sm font-semibold" style={{ color: 'var(--copy-primary)' }}>@adidas</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {methods.map((method) => (
            <MethodCard
              key={method.id}
              title={method.title}
              description={method.description}
              selected={selectedId === method.id}
              onSelect={() => setSelectedId(method.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
