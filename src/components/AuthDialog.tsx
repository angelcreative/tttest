import { ModalOverlay, Modal, Dialog } from 'react-aria-components'
import { ArrowLeftRight } from 'lucide-react'
import { TitanButton } from 'titan-compositions'

const ADIDAS_LOGO_URL = 'https://pbs.twimg.com/profile_images/1696070215354716160/3GW_BOtL_400x400.jpg'
const AUDIENSE_RING_LOGO_URL = 'https://pbs.twimg.com/profile_images/1950145815193714688/KQDVFYL9_400x400.jpg'

interface AuthDialogProps {
  networkName: string
  onClose: () => void
  onAuthorize?: () => void
}

const PERMISSIONS = [
  'Access your profile info (avatar, display name, like count, follower count, following count, verified status)',
  'Upload draft content to TikTok for further editing',
  'Read your additional profile information, such as bio description, profile link, and account verification status',
  'Read your profile engagement statistics, such as like count, follower count, following count, and video count',
  'Read your public videos on TikTok',
  'Post content to TikTok',
]

export function AuthDialog({ networkName, onClose, onAuthorize }: AuthDialogProps) {
  const handleAuthorize = () => {
    onAuthorize?.()
    onClose()
  }

  return (
    <ModalOverlay
      isOpen
      isDismissable
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose()
      }}
      className="dialog-overlay"
    >
      <Modal className="dialog-modal">
        <Dialog
          className="dialog-panel"
          aria-labelledby="auth-dialog-title"
          style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column', gap: 'var(--dialog-slot-gap)' }}
        >
          <div style={{ overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-m)' }}>
            <h2 id="auth-dialog-title" className="dialog-title">
              Authorize Audiense to access your {networkName} account?
            </h2>

            <div
              className="flex items-center justify-center"
              style={{ gap: 'var(--spacing-m)' }}
            >
              <div className="flex flex-col items-center gap-1 shrink-0">
                <img
                  src={ADIDAS_LOGO_URL}
                  alt="Your brand"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <span className="text-xs" style={{ color: 'var(--copy-tertiary)' }}>Your brand</span>
              </div>
              <div className="flex items-center justify-center shrink-0" style={{ color: 'var(--copy-secondary)' }} aria-hidden>
                <ArrowLeftRight className="w-6 h-6" strokeWidth={2} />
              </div>
              <div className="flex flex-col items-center gap-1 shrink-0">
                <img
                  src={AUDIENSE_RING_LOGO_URL}
                  alt="Audiense"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <span className="text-xs" style={{ color: 'var(--copy-tertiary)' }}>Audiense</span>
              </div>
            </div>

            <div>
              <p className="font-medium text-sm mb-2 m-0" style={{ color: 'var(--copy-primary)' }}>
                Audiense would like to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm m-0 mt-2" style={{ color: 'var(--copy-secondary)' }}>
                {PERMISSIONS.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <p className="text-sm m-0" style={{ color: 'var(--copy-secondary)' }}>
              You can manage this setting via &quot;Edit access&quot;. To revoke access after the authorization, go to
              TikTok mobile app &gt; &quot;Settings and privacy&quot; &gt; &quot;Security and login&quot; &gt; &quot;Manage
              app permissions&quot;.
            </p>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-sm self-start"
              style={{ color: 'var(--link-color)' }}
            >
              Edit access &gt;
            </a>

            <p className="text-sm m-0" style={{ color: 'var(--copy-secondary)' }}>
              Make sure you trust this website or app. By tapping &quot;Authorize&quot;, you agree to Audiense&apos;s
              Terms of Service and acknowledge that you have read its Privacy Policy.
            </p>
          </div>

          <footer className="dialog-footer flex-col gap-2 pt-2" style={{ flexShrink: 0 }}>
            <TitanButton variant="primary" onPress={handleAuthorize} className="w-full justify-center">
              Authorize
            </TitanButton>
            <TitanButton variant="tertiary" onPress={onClose} className="w-full justify-center">
              Cancel
            </TitanButton>
          </footer>
        </Dialog>
      </Modal>
    </ModalOverlay>
  )
}
