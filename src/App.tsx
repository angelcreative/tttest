import { useState } from 'react'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { Breadcrumbs } from './components/Breadcrumbs'
import { NetworkSelect } from './components/NetworkSelect'
import { ChooseTikTokMethod } from './components/ChooseTikTokMethod'
import { ConnectTikTokAccount } from './components/ConnectTikTokAccount'
import { BrandMentions } from './components/BrandMentions'
import { CreatorSearch } from './components/CreatorSearch'
import type { WizardStep } from './data/wizardSteps'
import type { NetworkId } from './data/networks'
import type { TikTokMethodId } from './components/ChooseTikTokMethod'

function App() {
  const [step, setStep] = useState<WizardStep>('select-network')

  const handleMethodNext = (methodId: TikTokMethodId) => {
    if (methodId === 'campaign') {
      setStep('creator-search')
    } else if (methodId === 'brand-mentions') {
      setStep('connect-tiktok')
    }
  }

  return (
    <div className="h-full w-full flex bg-gray-50 text-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-auto flex flex-col">
          <div className="flex-shrink-0 px-6 pt-6 pb-4 bg-gray-50 border-b border-gray-100">
            <Breadcrumbs currentStep={step} onNavigate={setStep} />
          </div>
          {step === 'select-network' && (
            <NetworkSelect onNext={(_id: NetworkId) => setStep('choose-tiktok-method')} />
          )}
          {step === 'choose-tiktok-method' && (
            <ChooseTikTokMethod
              onBack={() => setStep('select-network')}
              onNext={handleMethodNext}
            />
          )}
          {step === 'connect-tiktok' && (
            <ConnectTikTokAccount
              onBack={() => setStep('choose-tiktok-method')}
              onContinue={() => setStep('brand-mentions')}
            />
          )}
          {step === 'brand-mentions' && (
            <BrandMentions onBack={() => setStep('connect-tiktok')} />
          )}
          {step === 'creator-search' && (
            <CreatorSearch onBack={() => setStep('choose-tiktok-method')} />
          )}
        </main>
      </div>
    </div>
  )
}

export default App
export type { WizardStep }
