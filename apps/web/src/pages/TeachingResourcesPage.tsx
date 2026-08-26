import PageHero from '../components/ui/PageHero'
import ThemeBadge from '../components/ui/ThemeBadge'
import { Download, ExternalLink, FileText } from 'lucide-react'
import { useCollection, usePageContent } from '../hooks/useFirestore'

// Default text blocks — Firestore siteConfig/resourcesPage values override these when set.
// (The "contact us" paragraph keeps its mailto link in code — not exposed as a plain-text block.)
const DEFAULTS: Record<string, string> = {
  hero_title: 'Teaching Resources',
  hero_lead: 'Materials produced by the ARO-UJ Praxis Network — free to use, adapt, and share for educators, researchers, and students.',
  intro_p1: 'All materials on this page are produced through the ARO-UJ Praxis Network and are free to download, use, and adapt under Creative Commons licensing. We ask that you credit the network and ARO when using or reproducing materials.',
}

function useTxt(content: Record<string, string> | null, key: string): string {
  return (content && content[key]) ? content[key] : DEFAULTS[key] ?? ''
}

const RESOURCE_TYPE_COLORS: Record<string, string> = {
  'Teaching guide':     'bg-blue-50 text-blue-700',
  'Workshop materials': 'bg-purple-50 text-purple-700',
  'Case study':         'bg-greenlight text-forest',
  'Policy brief':       'bg-amber-50 text-amber-700',
  'Factsheet':          'bg-surface text-muted',
  'Toolkit':            'bg-greenlight text-forest',
  'Video':              'bg-red-50 text-red-700',
  'Report':             'bg-ink text-white',
}

export default function TeachingResourcesPage() {
  const { data: resources, loading } = useCollection<any>('resources', { publishedOnly: true })
  const { data: pageContent } = usePageContent('resourcesPage')
  const txt = (key: string) => useTxt(pageContent, key)

  return (
    <div className="bg-white">
      <PageHero
        imagePath="/images/resources/hero.jpg"
        imageUrl={pageContent?.heroImage}
        imageAlt="Teaching and learning resources from the network"
        eyebrow="Free downloads"
        title={txt('hero_title')}
        lead={txt('hero_lead')}
        variant="dark"
      />

      <section className="section bg-surface">
        <div className="container">

          {/* Intro */}
          <div className="max-w-2xl mb-12">
            <p className="eyebrow mb-4">About these resources</p>
            <p className="text-body text-muted leading-relaxed mb-4">
              {txt('intro_p1')}
            </p>
            <p className="text-body text-muted leading-relaxed">
              To request a resource in a different format, or to contribute materials to this
              library, contact{' '}
              <a href="mailto:praxis@uj.ac.za" className="text-forest hover:underline">
                praxis@uj.ac.za
              </a>
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="font-body text-sm text-muted animate-pulse py-8">
              Loading resources…
            </div>
          )}

          {/* Empty */}
          {!loading && resources.length === 0 && (
            <div className="text-center py-16 border border-dashed border-border rounded-2xl">
              <FileText size={32} className="text-muted mx-auto mb-4" />
              <p className="font-body text-small text-muted mb-2">
                Resources are being prepared and will appear here shortly.
              </p>
              <p className="font-body text-xs text-muted">
                Contact{' '}
                <a href="mailto:praxis@uj.ac.za" className="text-forest hover:underline">
                  praxis@uj.ac.za
                </a>{' '}
                to request specific materials.
              </p>
            </div>
          )}

          {/* Resources grid */}
          {!loading && resources.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource: any) => (
                <div key={resource.id}
                  className="bg-white rounded-2xl border border-border p-6 hover:border-forest
                             transition-colors flex flex-col">
                  {/* Type badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`font-body text-xs font-semibold px-2.5 py-0.5 rounded-full
                      ${RESOURCE_TYPE_COLORS[resource.resourceType] ?? 'bg-surface text-muted'}`}>
                      {resource.resourceType}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-bold text-ink text-small mb-2 leading-snug">
                    {resource.title}
                  </h3>

                  {/* Description */}
                  <p className="font-body text-xs text-muted leading-relaxed mb-4 flex-1">
                    {resource.description}
                  </p>

                  {/* Themes */}
                  {(resource.themes ?? []).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {resource.themes.map((t: any) =>
                        <ThemeBadge key={t} theme={t} size="sm" />
                      )}
                    </div>
                  )}

                  {/* Download / link button */}
                  <div className="pt-4 border-t border-border">
                    {resource.documentPath ? (
                      <a
                        href={resource.documentPath}
                        download
                        className="inline-flex items-center gap-2 font-body text-sm font-medium
                                   text-forest hover:text-midgreen transition-colors"
                      >
                        <Download size={15} />
                        Download
                      </a>
                    ) : resource.externalUrl ? (
                      <a
                        href={resource.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 font-body text-sm font-medium
                                   text-forest hover:text-midgreen transition-colors"
                      >
                        <ExternalLink size={15} />
                        Open resource
                      </a>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
