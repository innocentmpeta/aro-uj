import { SDG, SDG_META } from '@arouj/types'

interface SDGBadgeProps {
  sdg: SDG
  size?: 'sm' | 'md'
  showLabel?: boolean
}

export default function SDGBadge({ sdg, size = 'sm', showLabel = false }: SDGBadgeProps) {
  const meta = SDG_META[sdg]
  if (!meta) return null   // guard against SDGs not in the metadata map
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full font-body font-bold
        ${size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-3 py-1'}`}
      style={{ backgroundColor: meta.color, color: '#FFFFFF' }}
      title={`SDG ${sdg}: ${meta.label}`}
    >
      <span>{sdg}</span>
      {showLabel && <span className="font-normal">{meta.label}</span>}
    </div>
  )
}

// Strip of multiple SDG badges
interface SDGStripProps {
  sdgs: SDG[]
  size?: 'sm' | 'md'
  showLabels?: boolean
  max?: number
}

export function SDGStrip({ sdgs, size = 'sm', showLabels = false, max }: SDGStripProps) {
  const visible = max ? sdgs.slice(0, max) : sdgs
  const hidden  = max ? sdgs.length - max : 0
  return (
    <div className="flex flex-wrap items-center gap-1">
      {visible.map(sdg => (
        <SDGBadge key={sdg} sdg={sdg} size={size} showLabel={showLabels} />
      ))}
      {hidden > 0 && (
        <span className="font-body text-xs text-muted">+{hidden} more</span>
      )}
    </div>
  )
}
