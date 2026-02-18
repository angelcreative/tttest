import { ModalOverlay, Modal, Dialog } from 'react-aria-components'
import { TitanButton } from 'titan-compositions'

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

            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background: 'var(--surface-elevated)', color: 'var(--copy-primary)' }}
                >
                  adidas
                </div>
                <span className="text-xs" style={{ color: 'var(--copy-tertiary)' }}>Adidas</span>
                <span className="text-xs" style={{ color: 'var(--copy-tertiary)' }}>Your brand</span>
              </div>
              <div className="flex-1 flex justify-center" aria-hidden>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--copy-secondary)' }}>
                  <path d="M7 17L17 7M17 7h-6M17 7v6" />
                </svg>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm"
                  style={{ background: 'var(--button-primary)', color: 'var(--button-primary-label)' }}
                >
                  A
                </div>
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
