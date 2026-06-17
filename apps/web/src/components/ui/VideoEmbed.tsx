import LiteYouTubeEmbed from 'react-lite-youtube-embed'
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'

interface VideoEmbedProps {
  videoId: string
  title: string
  className?: string
}

export default function VideoEmbed({ videoId, title, className = '' }: VideoEmbedProps) {
  return (
    <div className={`rounded-2xl overflow-hidden shadow-md ${className}`}>
      <LiteYouTubeEmbed id={videoId} title={title} />
    </div>
  )
}
