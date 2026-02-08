import { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { MethodCard } from './MethodCard'
import { PreviewPanel } from './PreviewPanel'

export type TikTokMethodId = 'campaign' | 'brand-mentions'

interface ChooseTikTokMethodProps {
  onBack: () => void
  onNext: (methodId: TikTokMethodId) => void
}

const methods: { id: TikTokMethodId; title: string; description: string }[] = [
  {
    id: 'campaign',
    title: 'Campaign',
    description:
      'Find creators for your campaign or create a new campaign or add them to an existing campaign',
  },
  {
    id: 'brand-mentions',
    title: 'Brand mentions',
    description: 'Find creators that mentioned your brand and send link requests',
  },
]

export function ChooseTikTokMethod({ onBack, onNext }: ChooseTikTokMethodProps) {
  const [selectedId, setSelectedId] = useState<TikTokMethodId>('brand-mentions')

  const handleNext = () => onNext(selectedId)

  return (
    <div className="p-6 flex gap-6 flex-1 min-w-0">
      <div className="flex-1 max-w-3xl min-w-0">
        <div className="flex items-center justify-between mb-6">
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
            className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg flex items-center gap-2 transition-colors"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
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
      <div className="w-72 flex-shrink-0 hidden lg:block">
        <PreviewPanel />
      </div>
    </div>
  )
}
