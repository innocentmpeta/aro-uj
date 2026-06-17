import { THEMES, Theme } from '@arouj/types'

interface ThemeBadgeProps {
  theme: Theme
  size?: 'sm' | 'md'
}

// Clean, low-saturation theme badges — no orange in the set
const THEME_STYLES: Record<Theme, { bg: string; color: string }> = {
  'health-wellbeing':    { bg: '#EEF6F0', color: '#1A5C2A' },
  'rights-justice':      { bg: '#F5F0E8', color: '#6B4200' },
  'design-environment':  { bg: '#EEF0F8', color: '#1A2E6B' },
  'knowledge-education': { bg: '#F4EEF8', color: '#4A1A6B' },
  'economic-justice':    { bg: '#F8F2EE', color: '#6B3A1A' },
}

export default function ThemeBadge({ theme, size = 'md' }: ThemeBadgeProps) {
  const t = THEMES[theme]
  const s = THEME_STYLES[theme]
  return (
    <span
      className={`tag ${size === 'sm' ? 'text-[10px] px-2.5 py-0.5' : 'text-xs px-3 py-1'}`}
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {t.label}
    </span>
  )
}
