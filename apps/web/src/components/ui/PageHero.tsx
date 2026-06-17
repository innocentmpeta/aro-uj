/**
 * PageHero — consistent full-bleed hero used across all pages.
 *
 * IMAGE CONVENTION:
 *   Each page has its own folder under apps/web/public/images/<page>/
 *   Drop a file named hero.jpg into that folder and it appears automatically.
 *   Recommended: landscape, min 1920×1080px, natural light, under 400KB.
 *
 * VARIANTS:
 *   'dark'   — full-bleed photo with dark overlay, white text (default)
 *   'split'  — left: white text panel / right: photo (used on About)
 *   'light'  — full-bleed photo with lighter overlay, dark text
 */

interface PageHeroProps {
  /** Path to hero image e.g. /images/about/hero.jpg */
  imagePath: string
  /** Alt text for accessibility */
  imageAlt: string
  /** Small eyebrow label above the title */
  eyebrow?: string
  /** Main headline */
  title: string
  /** Subtitle / lead paragraph */
  lead?: string
  /** Visual variant */
  variant?: 'dark' | 'split' | 'light'
  /** Min height override — defaults differ per variant */
  minHeight?: string
}

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect fill='%23111111' width='1920' height='1080'/%3E%3C/svg%3E"

export default function PageHero({
  imagePath,
  imageAlt,
  eyebrow,
  title,
  lead,
  variant = 'dark',
  minHeight,
}: PageHeroProps) {

  // ── SPLIT variant (About page) ───────────────────────────────────────────
  if (variant === 'split') {
    return (
      <section className="border-b border-border overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left — text */}
          <div className="flex flex-col justify-center px-6 lg:px-10 py-16 lg:py-24 bg-white">
            {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
            <h1
              className="font-display font-bold text-ink mb-5"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', lineHeight: 1.08, letterSpacing: '-0.02em' }}
            >
              {title}
            </h1>
            {lead && (
              <p className="text-lead text-muted max-w-prose">{lead}</p>
            )}
          </div>
          {/* Right — photo */}
          <div
            className="relative bg-surface"
            style={{ minHeight: minHeight ?? '420px' }}
          >
            <img
              src={imagePath}
              alt={imageAlt}
              className="absolute inset-0 w-full h-full object-cover"
              onError={e => {
                (e.currentTarget as HTMLImageElement).src = PLACEHOLDER
              }}
            />
          </div>
        </div>
      </section>
    )
  }

  // ── DARK / LIGHT variants ────────────────────────────────────────────────
  const overlayClass =
    variant === 'light'
      ? 'bg-gradient-to-t from-white/80 via-white/40 to-transparent'
      : 'bg-gradient-to-t from-ink via-ink/60 to-transparent'

  const textColor   = variant === 'light' ? 'text-ink'  : 'text-white'
  const eyebrowColor = variant === 'light' ? 'text-forest' : 'text-white/50'
  const leadColor   = variant === 'light' ? 'text-muted' : 'text-white/75'

  return (
    <section
      className="relative flex items-end overflow-hidden bg-ink"
      style={{ minHeight: minHeight ?? '62vh' }}
    >
      {/* Background photo */}
      <div className="absolute inset-0">
        <img
          src={imagePath}
          alt={imageAlt}
          className={`w-full h-full object-cover ${variant === 'dark' ? 'opacity-40' : 'opacity-60'}`}
          onError={e => {
            (e.currentTarget as HTMLImageElement).src = PLACEHOLDER
          }}
        />
        <div className={`absolute inset-0 ${overlayClass}`} />
      </div>

      {/* Content */}
      <div className="relative container pb-14 pt-28 w-full">
        {eyebrow && (
          <p className={`eyebrow ${eyebrowColor} mb-4`}>{eyebrow}</p>
        )}
        <h1
          className={`font-display font-bold ${textColor} max-w-3xl mb-5`}
          style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.75rem)', lineHeight: 1.08, letterSpacing: '-0.02em' }}
        >
          {title}
        </h1>
        {lead && (
          <p className={`text-lead ${leadColor} max-w-xl`}>{lead}</p>
        )}
      </div>
    </section>
  )
}
