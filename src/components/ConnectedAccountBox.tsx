import { User } from 'lucide-react'

/**
 * Caja de cuenta conectada — 100% Titan (tokens semánticos: surface, card, copy-slot).
 * Sin hex ni --color-* primitivos.
 */
interface ConnectedAccountBoxProps {
  /** Handle de la cuenta (ej. @adidas). */
  handle?: string
  /** Clase opcional para el contenedor. */
  className?: string
}

export function ConnectedAccountBox({ handle = '@adidas', className = '' }: ConnectedAccountBoxProps) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-m)',
        padding: 'var(--spacing-s) var(--spacing-m)',
        background: 'var(--surface-1)',
        border: 'var(--stroke-slot-width) solid var(--card-border)',
        borderRadius: 'var(--card-radius)',
      }}
    >
      <div
        style={{
          width: 'var(--spacing-xl)',
          height: 'var(--spacing-xl)',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '9999px',
          background: 'var(--surface-0)',
        }}
        aria-hidden
      >
        <User
          style={{
            width: 'var(--icon-size-m)',
            height: 'var(--icon-size-m)',
            color: 'var(--copy-slot-secondary)',
            strokeWidth: 'var(--icon-stroke-m)',
          }}
        />
      </div>
      <div style={{ minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontSize: 'var(--font-size-s)',
            lineHeight: 'var(--font-leading-s)',
            fontWeight: 'var(--text-weight-medium)',
            color: 'var(--copy-slot-secondary)',
          }}
        >
          Connected Account:
        </p>
        <p
          style={{
            margin: 0,
            fontSize: 'var(--font-size-s)',
            lineHeight: 'var(--font-leading-s)',
            fontWeight: 'var(--text-weight-semibold)',
            color: 'var(--copy-slot-primary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {handle}
        </p>
      </div>
    </div>
  )
}
