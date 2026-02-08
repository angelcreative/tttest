import type { WizardStep } from '../data/wizardSteps'
import { getStepsUpTo } from '../data/wizardSteps'

interface BreadcrumbsProps {
  currentStep: WizardStep
  onNavigate: (step: WizardStep) => void
}

/** Breadcrumb único del wizard: mismo en todas las pantallas, clicable para ir a pasos anteriores. */
export function Breadcrumbs({ currentStep, onNavigate }: BreadcrumbsProps) {
  const isCreatorSearch = currentStep === 'creator-search'
  const steps = isCreatorSearch
    ? [{ id: 'creator-search' as WizardStep, label: 'Creators search' }]
    : getStepsUpTo(currentStep)

  return (
    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4 flex-wrap" aria-label="Breadcrumb">
      <span className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onNavigate(isCreatorSearch ? 'choose-tiktok-method' : 'select-network')}
          className="hover:text-gray-900 font-medium transition-colors"
        >
          Home
        </button>
      </span>
      {steps.map((step) => (
        <span key={step.id} className="flex items-center gap-2">
          <span aria-hidden className="text-gray-400">›</span>
          {step.id === currentStep ? (
            <span className="text-gray-900 font-medium">{step.label}</span>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate(step.id)}
              className="hover:text-gray-900 transition-colors"
            >
              {step.label}
            </button>
          )}
        </span>
      ))}
    </nav>
  )
}
