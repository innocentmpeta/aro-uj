import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import ThemeBadge from '../components/ui/ThemeBadge'
import SiteImage from '../components/ui/SiteImage'
import VideoEmbed from '../components/ui/VideoEmbed'
import { useCollection } from '../hooks/useFirestore'

export default function NewsDetailPage() {
  const { slug } = useParams()
  const { data: allNews, loading } = useCollection<any>('news', { publishedOnly: true })

  if (loading) {
    return (
      <div className="container py-24 text-center">
        <p className="font-body text-muted animate-pulse">Loading…</p>
      </div>
    )
  }

  const item = allNews.find((n: any) => n.slug === slug) ?? null

  if (!item) {
    return (
      <div className="container py-24 text-center">
        <p className="font-body text-muted mb-4">Article not found.</p>
        <Link to="/news" className="btn-outline">← Back to News</Link>
      </div>
    )
  }

  return (
    <div className="bg-white">
      {/* Back nav */}
      <div className="border-b border-border">
        <div className="container py-4">
          <Link to="/news"
            className="inline-flex items-center gap-2 font-body text-small text-muted
                       hover:text-forest transition-colors">
            <ArrowLeft size={14} /> News & Updates
          </Link>
        </div>
      </div>

      {/* Article header */}
      <section className="section-sm bg-white">
        <div className="container max-w-3xl">
          <div className="flex flex-wrap gap-2 mb-5">
            {(item.themes ?? []).map((t: any) => <ThemeBadge key={t} theme={t} />)}
          </div>
          <h1 className="font-display font-bold text-ink mb-6"
              style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', lineHeight: 1.1 }}>
            {item.title}
          </h1>
          <p className="section-lead text-muted">{item.excerpt}</p>
        </div>
      </section>

      {/* Media */}
      {(item.imagePath || item.videoId) && (
        <div className="container max-w-3xl mb-10">
          {item.videoId ? (
            <VideoEmbed videoId={item.videoId} title={item.title} />
          ) : (
            <SiteImage
              src={item.imagePath} imageBase64={item.imageBase64} thumbnailBase64={item.thumbnailBase64}
              alt={item.title}
              aspectRatio="video"
              className="rounded-2xl"
            />
          )}
        </div>
      )}

      {/* Article body */}
      <section className="container max-w-3xl pb-20">
        {item.body && item.body !== `<p>${item.excerpt}</p>` ? (
          <div
            className="prose prose-lg max-w-none text-muted leading-relaxed"
            dangerouslySetInnerHTML={{ __html: item.body }}
          />
        ) : (
          <div className="bg-surface rounded-2xl border border-dashed border-border p-8 text-center">
            <p className="font-body text-muted text-sm">
              The full article will be published here soon.
            </p>
          </div>
        )}

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-border">
          <Link to="/news"
            className="inline-flex items-center gap-2 font-body text-small text-muted
                       hover:text-forest transition-colors">
            <ArrowLeft size={14} /> Back to all news
          </Link>
        </div>
      </section>
    </div>
  )
}