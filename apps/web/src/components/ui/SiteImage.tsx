/**
 * SiteImage — handles image sources:
 *   1. thumbnailBase64 — preferred for cards when project has a video
 *   2. imageBase64     — base64 from Firestore upload
 *   3. src / imagePath — file path fallback
 *   4. null            — green placeholder
 */
interface SiteImageProps {
  src?: string | null
  imageBase64?: string | null
  thumbnailBase64?: string | null  // card thumbnail for video items
  alt: string
  className?: string
  aspectRatio?: 'video' | 'square' | 'portrait' | 'auto'
}

const ASPECT = {
  video:   'aspect-video',
  square:  'aspect-square',
  portrait:'aspect-[3/4]',
  auto:    '',
}

export default function SiteImage({
  src, imageBase64, thumbnailBase64, alt, className = '', aspectRatio = 'auto'
}: SiteImageProps) {
  // Priority: thumbnail (for video cards) → base64 → file path
  const source = thumbnailBase64 || imageBase64 || src || null
  const aspect = ASPECT[aspectRatio]

  if (!source) {
    return (
      <div className={`${aspect} bg-greenlight flex items-center justify-center ${className}`}>
        <span className="font-body text-xs text-forest/50">Image coming soon</span>
      </div>
    )
  }

  return (
    <img
      src={source}
      alt={alt}
      className={`${aspect} object-cover ${className}`}
      onError={e => {
        const img = e.currentTarget
        img.style.display = 'none'
        const placeholder = document.createElement('div')
        placeholder.className = `${aspect} bg-greenlight flex items-center justify-center`
        placeholder.innerHTML = '<span style="font-size:0.75rem;color:rgba(26,92,42,0.5)">Image coming soon</span>'
        img.parentElement?.appendChild(placeholder)
      }}
    />
  )
}