import { Plug } from 'lucide-react'

/**
 * Tag compacto de cuenta conectada: icono plug + @handle.
 * Va sobre el título para ganar espacio (Brand mentions, Creator search, etc.).
 */
interface ConnectedAccountBoxProps {
  /** Handle de la cuenta (ej. @adidas). */
  handle?: string
  /** Clase opcional para el contenedor. */
  className?: string
}

export function ConnectedAccountBox({ handle = '@adidas', className = '' }: ConnectedAccountBoxProps) {
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--spacing-2xs, 6px)',
        padding: 'var(--spacing-2xs, 6px) var(--spacing-s, 12px)',
        background: 'var(--pill-background, var(--surface-1))',
        border: 'var(--stroke-slot-width) solid var(--card-border)',
        borderRadius: 'var(--pill-radius, var(--radius-pill, 9999px))',
        fontSize: 'var(--font-size-s)',
        fontWeight: 'var(--text-weight-medium)',
        color: 'var(--copy-slot-primary)',
      }}
      aria-label={`Connected account ${handle}`}
    >
      <Plug
        style={{
          width: 'var(--icon-size-s, 14px)',
          height: 'var(--icon-size-s, 14px)',
          color: 'var(--copy-slot-secondary)',
          flexShrink: 0,
        }}
        strokeWidth={2}
        aria-hidden
      />
      <span>{handle}</span>
    </span>
  )
}
