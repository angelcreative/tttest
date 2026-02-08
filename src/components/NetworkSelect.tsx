import { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { NetworkId } from '../data/networks'
import { networks } from '../data/networks'
import { NetworkCard } from './NetworkCard'

interface NetworkSelectProps {
  onNext?: (selectedId: NetworkId) => void
}

export function NetworkSelect({ onNext }: NetworkSelectProps) {
  const [selectedId, setSelectedId] = useState<NetworkId | null>(null)

  const handleNext = () => {
    if (selectedId && onNext) onNext(selectedId)
  }

  const hasSelection = selectedId !== null

  return (
    <div className="max-w-4xl">
      {/* Sticky bar: breadcrumbs + actions so Next is always visible when scrolling */}
      <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-100 pb-4 mb-4 px-6 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              className="p-2 -ml-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 shrink-0"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-900 truncate">Select network</h1>
          </div>
          <button
            type="button"
            onClick={handleNext}
            disabled={!hasSelection}
            className={`px-5 py-2.5 font-medium rounded-lg inline-flex items-center gap-2 transition-colors shrink-0 ${
              hasSelection
                ? 'bg-primary-600 hover:bg-primary-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="px-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {networks.map((network) => (
          <NetworkCard
            key={network.id}
            network={network}
            selected={selectedId === network.id}
            onSelect={() => setSelectedId(network.id)}
          />
        ))}
      </div>
    </div>
  )
}
