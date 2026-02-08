import { Check } from 'lucide-react'
import type { Network } from '../data/networks'
import { TikTokLogo } from './TikTokLogo'

interface NetworkCardProps {
  network: Network
  selected: boolean
  onSelect: () => void
}

function NetworkLogo({ id }: { id: string }) {
  if (id === 'tiktok') {
    return <TikTokLogo className="w-10 h-10" />
  }
  if (id === 'x') {
    return (
      <svg viewBox="0 0 24 24" className="w-10 h-10" fill="#000">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    )
  }
  if (id === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" className="w-10 h-10">
        <defs>
          <linearGradient id="ig" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fd5" />
            <stop offset="50%" stopColor="#ff543e" />
            <stop offset="100%" stopColor="#c837ab" />
          </linearGradient>
        </defs>
        <path fill="url(#ig)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    )
  }
  if (id === 'facebook') {
    return (
      <svg viewBox="0 0 24 24" className="w-10 h-10" fill="#1877F2">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    )
  }
  return null
}

export function NetworkCard({ network, selected, onSelect }: NetworkCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect()}
      className={`relative w-full text-left rounded-xl border-2 p-6 transition-colors cursor-pointer ${
        selected
          ? 'bg-emerald-50 border-primary-600 ring-2 ring-primary-600/20'
          : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      <span
        className={`absolute top-4 right-4 w-6 h-6 rounded flex items-center justify-center border-2 pointer-events-none ${
          selected ? 'bg-primary-600 border-primary-600' : 'border-gray-300 bg-white'
        }`}
        aria-hidden
      >
        {selected && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
      </span>
      <div className="flex flex-col gap-3">
        <NetworkLogo id={network.logo} />
        <div>
          <p className="font-semibold text-gray-900">{network.name}</p>
          <p className="text-sm text-gray-500 mt-0.5">{network.subtitle}</p>
        </div>
      </div>
    </button>
  )
}
