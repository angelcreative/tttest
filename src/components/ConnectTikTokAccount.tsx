import { useState } from 'react'
import { ArrowLeft, Pencil, ArrowRight, ShieldCheck } from 'lucide-react'

interface ConnectTikTokAccountProps {
  onBack: () => void
  onContinue: () => void
}

/** Fake authenticator: connect brand TikTok account (Brand mentions flow). */
export function ConnectTikTokAccount({ onBack, onContinue }: ConnectTikTokAccountProps) {
  const [brandName, setBrandName] = useState('ADIDAS')

  return (
    <div className="p-6 flex flex-1 min-w-0 justify-center">
      <div className="w-full max-w-md flex flex-col items-center text-center">
        <img
          src={`${import.meta.env.BASE_URL}connect-illustration.png`}
          alt=""
          className="w-full max-w-sm h-auto my-4"
        />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Connect your brand&apos;s TikTok account
        </h1>
        <p className="text-gray-600 text-sm mb-8">
          Connect your brand&apos;s TikTok account to use it in reports.
        </p>

        <div className="w-full text-left mb-4">
          <label htmlFor="brand-name" className="block text-sm font-medium text-gray-500 mb-1.5">
            Enter your brand name
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Pencil className="w-4 h-4" />
            </span>
            <input
              id="brand-name"
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="ADIDAS"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="w-full px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          Continue with TikTok
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm">
          <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
          <span>
            <span className="text-green-600 font-medium">Secure Verification</span>
            <span className="text-gray-500 ml-1">Official OAuth standard</span>
          </span>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="mt-8 flex items-center gap-2 text-gray-500 hover:text-gray-700"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>
    </div>
  )
}
