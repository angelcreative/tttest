import { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { TitanButton, TitanIconButton } from 'titan-compositions'
import { MethodCard } from './MethodCard'

export type TikTokMethodId = 'campaign' | 'brand-mentions'

interface ChooseTikTokMethodProps {
  onBack: () => void
  onNext: (methodId: TikTokMethodId) => void
}

const methods: { id: TikTokMethodId; title: string; description: string }[] = [
  {
    id: 'campaign',
    title: 'Adidas campaign',
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
    <div className="flex-1 flex flex-col min-w-0 overflow-auto w-full">
      <div
        className="flex-shrink-0 flex flex-wrap items-center justify-between gap-4 px-6 pt-6 pb-4"
        style={{ background: 'var(--surface-page)' }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <TitanIconButton variant="ghost" aria-label="Back" onPress={onBack}>
            <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
          </TitanIconButton>
          <h1 className="text-2xl font-semibold truncate m-0" style={{ color: 'var(--copy-primary)' }}>
            Choose TikTok method
          </h1>
        </div>
        <TitanButton
          variant="primary"
          onPress={handleNext}
          className="inline-flex items-center gap-2"
        >
          Next
          <ArrowRight className="w-4 h-4 shrink-0" strokeWidth={1.5} />
        </TitanButton>
      </div>

      <div className="flex-1 px-6 py-6 min-w-0" style={{ background: 'var(--surface-page)' }}>
        <div className="max-w-3xl mx-auto">
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
    </div>
  )
}
