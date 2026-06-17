import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import ThemeBadge from '../components/ui/ThemeBadge'
import SiteImage from '../components/ui/SiteImage'
import { useCollection } from '../hooks/useFirestore'

export default function NewsPage() {
  const { data: news, loading } = useCollection<any>('news', { publishedOnly: true })

  return (
    <div className="bg-white">
      <PageHero
        imagePath="/images/news/hero.jpg"
        imageAlt="News and updates from the ARO-UJ Praxis Network"
        eyebrow="Latest"
        title="News & Updates"
        lead="Project news, events, policy updates, and publications from the ARO-UJ Praxis Network."
        variant="dark"
      />

      <section className="section bg-surface">
        <div className="container">
          {loading && (
            <div className="font-body text-sm text-muted animate-pulse py-8">Loading…</div>
          )}
          {!loading && news.length === 0 && (
            <p className="font-body text-muted py-8">No news items published yet.</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item: any) => (
              <Link
                key={item.id}
                to={`/news/${item.slug}`}
                className="card bg-white group block hover:shadow-md transition-shadow"
              >
                <SiteImage src={item.imagePath} imageBase64={item.imageBase64} thumbnailBase64={item.thumbnailBase64} alt={item.title} aspectRatio="video" />
                <div className="p-6">
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {(item.themes ?? []).map((t: any) =>
                      <ThemeBadge key={t} theme={t} size="sm" />
                    )}
                  </div>
                  <h2 className="font-display font-bold text-ink text-small mb-3 leading-snug
                                 group-hover:text-forest transition-colors">
                    {item.title}
                  </h2>
                  <p className="font-body text-xs text-muted leading-relaxed mb-4">
                    {item.excerpt}
                  </p>
                  <div className="flex items-center gap-1 font-body text-xs font-medium text-forest
                                  group-hover:gap-2 transition-all">
                    Read more <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}