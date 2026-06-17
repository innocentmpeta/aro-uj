import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import ThemeBadge from '../components/ui/ThemeBadge'
import SiteImage from '../components/ui/SiteImage'
import VideoEmbed from '../components/ui/VideoEmbed'
import { PILLARS } from '@arouj/types'
import { useCollection } from '../hooks/useFirestore'

export default function ProjectDetailPage() {
  const { slug } = useParams()

  // Use the same real-time listener pattern that works everywhere else
  // publishedOnly: false so authenticated CMS preview also works
  const { data: projects, loading } = useCollection<any>('projects', { publishedOnly: false })

  // Only show "not found" once Firestore has actually responded
  if (loading) {
    return (
      <div className="container py-24 text-center">
        <p className="font-body text-muted animate-pulse">Loading…</p>
      </div>
    )
  }

  const project = projects.find((p: any) => p.slug === slug) ?? null

  if (!project) {
    return (
      <div className="container py-24 text-center">
        <p className="font-body text-muted mb-4">Project not found.</p>
        <Link to="/praxis-in-action" className="btn-outline">← Back to Praxis in Action</Link>
      </div>
    )
  }

  // Extract videoId from YouTube URL if stored as full URL
  const videoId = project.videoId
    ?? (project.videoUrl
      ? project.videoUrl.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1]
      : null)

  return (
    <div className="bg-white">
      {/* Back nav */}
      <div className="border-b border-border">
        <div className="container py-4">
          <Link to="/praxis-in-action"
            className="inline-flex items-center gap-2 font-body text-small text-muted
                       hover:text-forest transition-colors">
            <ArrowLeft size={14} /> Praxis in Action
          </Link>
        </div>
      </div>

      {/* Header */}
      <section className="section-sm bg-white">
        <div className="container max-w-3xl">
          <div className="flex flex-wrap gap-2 mb-4">
            {(project.themes ?? []).map((t: any) => <ThemeBadge key={t} theme={t} />)}
          </div>
          <h1 className="font-display font-bold text-ink mb-4"
              style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', lineHeight: 1.1 }}>
            {project.title}
          </h1>
          <div className="flex items-center gap-4 font-body text-small text-muted">
            <span>{project.years}</span>
            {(project.outputType ?? []).length > 0 && (
              <><span>·</span><span>{project.outputType.join(', ')}</span></>
            )}
          </div>
        </div>
      </section>

      {/* Media */}
      <div className="container max-w-3xl mb-12">
        {videoId ? (
          <VideoEmbed videoId={videoId} title={project.title} />
        ) : (
          <SiteImage
            src={project.imagePath}
            imageBase64={project.imageBase64}
            thumbnailBase64={project.thumbnailBase64}
            alt={project.title}
            aspectRatio="video"
            className="rounded-2xl"
          />
        )}
      </div>

      {/* Body */}
      <section className="container pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-5xl">
          <div className="lg:col-span-2 space-y-8">
            {project.challenge && (
              <div>
                <h2 className="font-display font-bold text-ink text-h3 mb-3">The challenge</h2>
                <p className="text-body text-muted leading-relaxed">{project.challenge}</p>
              </div>
            )}
            {project.collaboration && (
              <div>
                <h2 className="font-display font-bold text-ink text-h3 mb-3">The collaboration</h2>
                <p className="text-body text-muted leading-relaxed">{project.collaboration}</p>
              </div>
            )}
            {project.outcome && (
              <div>
                <h2 className="font-display font-bold text-ink text-h3 mb-3">What changed</h2>
                <p className="text-body text-muted leading-relaxed">{project.outcome}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            <div className="rounded-2xl border border-border p-6">
              <h3 className="font-body text-xs font-semibold tracking-widest uppercase text-muted mb-4">
                Project details
              </h3>
              <dl className="space-y-3">
                {[
                  ['Years',         project.years],
                  ['Output type',   (project.outputType ?? []).join(', ')],
                  ['Collaborators', project.collaborators],
                ].filter(([, v]) => v).map(([label, value]) => (
                  <div key={String(label)}>
                    <dt className="font-body text-xs text-muted">{label}</dt>
                    <dd className="font-body text-small text-ink mt-0.5">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {(project.pillars ?? []).length > 0 && (
              <div className="rounded-2xl border border-border p-6">
                <h3 className="font-body text-xs font-semibold tracking-widest uppercase text-muted mb-4">
                  Network pillars
                </h3>
                <div className="space-y-2">
                  {project.pillars.map((p: string) => (
                    <div key={p} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-forest mt-1.5 shrink-0" />
                      <span className="font-body text-small text-ink">
                        {PILLARS[p as keyof typeof PILLARS]?.label ?? p}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {project.documentPath && (
              <a href={project.documentPath} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 p-5 rounded-2xl border border-border
                           hover:border-forest transition-colors group">
                <ExternalLink size={16} className="text-forest shrink-0" />
                <div>
                  <div className="font-body text-small font-medium text-ink group-hover:text-forest transition-colors">
                    Download report
                  </div>
                  <div className="font-body text-xs text-muted">PDF</div>
                </div>
              </a>
            )}

            <Link to="/join" className="btn-join w-full justify-center">Join the Network</Link>
          </aside>
        </div>
      </section>
    </div>
  )
}