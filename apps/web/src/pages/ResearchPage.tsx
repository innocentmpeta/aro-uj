import { useState, useEffect } from 'react'
import PageHero from '../components/ui/PageHero'
import { ExternalLink, RefreshCw, BookOpen, Globe } from 'lucide-react'
import ThemeBadge from '../components/ui/ThemeBadge'
import { useCollection } from '../hooks/useFirestore'
import { Theme } from '@arouj/types'

// ── CrossRef API ───────────────────────────────────────────────────────────
const SEARCH_QUERIES = [
  'waste picker reclaimers South Africa',
  'informal recycling sector Africa',
  'waste picker integration municipal policy',
  'reclaimer livelihoods just transition',
  'extended producer responsibility waste pickers',
]

interface GlobalPub {
  doi: string
  title: string
  authors: string
  year: number | null
  journal: string
  abstract: string
  url: string
}

async function fetchGlobalPublications(query: string): Promise<GlobalPub[]> {
  const encoded = encodeURIComponent(query)
  const url = `https://api.crossref.org/works?query=${encoded}&rows=6&sort=relevance&filter=has-abstract:true&select=DOI,title,author,published-print,published-online,container-title,abstract,URL`
  const res = await fetch(url, {
    headers: { 'User-Agent': 'ARO-UJ Praxis Network (praxis@uj.ac.za)' }
  })
  if (!res.ok) throw new Error('CrossRef fetch failed')
  const data = await res.json()
  const items = data.message?.items ?? []
  return items.map((item: any) => ({
    doi:     item.DOI,
    title:   item.title?.[0] ?? 'Untitled',
    authors: item.author
      ? item.author.slice(0, 3).map((a: any) =>
          `${a.family}${a.given ? ', ' + a.given[0] + '.' : ''}`
        ).join('; ') + (item.author.length > 3 ? ' et al.' : '')
      : 'Unknown authors',
    year: item['published-print']?.['date-parts']?.[0]?.[0]
       ?? item['published-online']?.['date-parts']?.[0]?.[0]
       ?? null,
    journal: item['container-title']?.[0] ?? 'Unknown journal',
    abstract: (item.abstract ?? '').replace(/<[^>]*>/g, '').slice(0, 300) + '…',
    url: item.URL ?? `https://doi.org/${item.DOI}`,
  }))
}

// ── Network publication card (from Firestore) ──────────────────────────────
function NetworkPubCard({ pub }: { pub: any }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="bg-white rounded-2xl border border-border p-6 hover:border-forest transition-colors">
      <div className="flex flex-wrap gap-1.5 mb-3">
        {(pub.themes ?? []).map((t: Theme) => <ThemeBadge key={t} theme={t} size="sm" />)}
        {pub.openAccess && (
          <span className="tag text-[10px] px-2 py-0.5 bg-greenlight text-forest rounded-full font-body font-semibold">
            Open Access
          </span>
        )}
      </div>
      <h3 className="font-display font-bold text-ink text-small mb-1.5 leading-snug">
        {pub.title}
      </h3>
      <p className="font-body text-xs text-muted mb-0.5">{pub.authors}</p>
      <p className="font-body text-xs text-muted italic mb-3">
        {pub.journal}{pub.year ? ` · ${pub.year}` : ''}
      </p>
      {expanded && pub.abstract && (
        <p className="font-body text-xs text-muted leading-relaxed mb-3 border-t border-border pt-3">
          {pub.abstract}
        </p>
      )}
      <div className="flex items-center gap-3 pt-3 border-t border-border">
        {pub.abstract && (
          <button onClick={() => setExpanded(!expanded)}
            className="font-body text-xs text-muted hover:text-forest transition-colors">
            {expanded ? 'Hide abstract' : 'Show abstract'}
          </button>
        )}
        {pub.url && (
          <a href={pub.url} target="_blank" rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-1.5 font-body text-xs font-medium
                       text-forest hover:text-midgreen transition-colors">
            {pub.openAccess ? 'Read paper' : 'View record'}
            <ExternalLink size={11} />
          </a>
        )}
        {pub.documentPath && (
          <a href={pub.documentPath} download
            className="inline-flex items-center gap-1.5 font-body text-xs font-medium
                       text-forest hover:text-midgreen transition-colors">
            Download PDF <ExternalLink size={11} />
          </a>
        )}
      </div>
    </div>
  )
}

// ── Global publication card (from CrossRef) ────────────────────────────────
function GlobalPubCard({ pub }: { pub: GlobalPub }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="bg-white rounded-xl border border-border p-5 hover:border-border/80 transition-colors">
      <h3 className="font-body font-semibold text-ink text-xs mb-1.5 leading-snug line-clamp-3">
        {pub.title}
      </h3>
      <p className="font-body text-xs text-muted mb-0.5 line-clamp-1">{pub.authors}</p>
      <p className="font-body text-xs text-muted italic mb-2">
        {pub.journal}{pub.year ? ` · ${pub.year}` : ''}
      </p>
      {expanded && pub.abstract && (
        <p className="font-body text-xs text-muted leading-relaxed mb-2 border-t border-border pt-2">
          {pub.abstract}
        </p>
      )}
      <div className="flex items-center gap-3 pt-2 border-t border-border">
        {pub.abstract && (
          <button onClick={() => setExpanded(!expanded)}
            className="font-body text-xs text-muted hover:text-forest transition-colors">
            {expanded ? 'Less' : 'Abstract'}
          </button>
        )}
        <a href={pub.url} target="_blank" rel="noopener noreferrer"
          className="ml-auto inline-flex items-center gap-1 font-body text-xs text-forest
                     hover:text-midgreen transition-colors font-medium">
          View <ExternalLink size={10} />
        </a>
      </div>
    </div>
  )
}

// ── Skeleton loader ────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="animate-pulse space-y-3 rounded-xl border border-border p-5">
      <div className="h-3 bg-surface rounded w-3/4" />
      <div className="h-3 bg-surface rounded w-1/2" />
      <div className="h-3 bg-surface rounded w-1/3" />
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function ResearchPage() {
  const [activeQuery, setActiveQuery] = useState(SEARCH_QUERIES[0])
  const [globalPubs, setGlobalPubs]   = useState<GlobalPub[]>([])
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState<string | null>(null)
  const [lastFetched, setLastFetched] = useState<Date | null>(null)

  // Network publications from Firestore
  const { data: networkPubs, loading: networkLoading } = useCollection<any>(
    'publications', { publishedOnly: true }
  )

  async function loadGlobal(query: string) {
    setLoading(true)
    setError(null)
    try {
      const results = await fetchGlobalPublications(query)
      setGlobalPubs(results)
      setLastFetched(new Date())
    } catch {
      setError('Could not load the global feed right now. Please try again shortly.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadGlobal(activeQuery) }, [activeQuery])

  // Sort network pubs by year descending
  const sortedNetworkPubs = [...networkPubs].sort((a, b) => (b.year ?? 0) - (a.year ?? 0))

  return (
    <div className="bg-white">

      {/* ── HERO ────────────────────────────────────────────────────── */}
      <PageHero
        imagePath="/images/research/hero.jpg"
        imageAlt="Research and publications from the ARO-UJ Praxis Network"
        eyebrow="Knowledge from the network and the world"
        title="Research & Publications"
        lead="Publications from the ARO-UJ Praxis Network alongside a live feed of global research on reclaimers, informal recycling, and waste picker rights."
        variant="dark"
      />

      {/* ── INTRO ───────────────────────────────────────────────────────── */}
      <section className="section-sm bg-white border-b border-border">
        <div className="container max-w-3xl">
          <p className="text-body text-muted">
            Global publications are drawn from{' '}
            <a href="https://www.crossref.org" target="_blank" rel="noopener noreferrer"
              className="text-forest hover:underline">CrossRef</a>
            {' '}— an open academic index of peer-reviewed work.
            Results update in real time when you change the search topic below.
          </p>
        </div>
      </section>

      {/* ── NETWORK PUBLICATIONS — prominent, full-width ───────── */}
      <section className="section bg-white">
        <div className="container">
          <div className="flex items-start justify-between gap-4 mb-10">
            <div>
              <p className="eyebrow">ARO-UJ Praxis Network</p>
              <h2 className="section-heading mb-2">Network publications</h2>
              <p className="text-body text-muted max-w-2xl">
                Peer-reviewed articles, reports, and publications produced by
                ARO-UJ Praxis Network members — the primary research output of the network.
              </p>
            </div>
          </div>

          {networkLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} />)}
            </div>
          )}

          {!networkLoading && sortedNetworkPubs.length === 0 && (
            <div className="bg-surface rounded-2xl border border-dashed border-border p-12 text-center max-w-xl mx-auto">
              <BookOpen size={28} className="text-muted mx-auto mb-3" />
              <p className="font-body text-sm text-muted mb-1 font-semibold text-ink">
                Publications are being added
              </p>
              <p className="font-body text-xs text-muted">
                Network researchers can submit publications via the{' '}
                <a href="mailto:reclaimingpraxis@uj.ac.za" className="text-forest hover:underline">
                  website manager
                </a>.
              </p>
            </div>
          )}

          {sortedNetworkPubs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {sortedNetworkPubs.map((pub: any) => (
                <NetworkPubCard key={pub.id} pub={pub} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── GLOBAL FEED — secondary, clearly labelled ───────────── */}
      <section className="section bg-surface border-t border-border">
        <div className="container">
          <div className="max-w-3xl">
            <p className="eyebrow">Further reading</p>
            <h2 className="section-heading">Research from the field</h2>
            <p className="text-body text-muted mb-2">
              A curated live feed of peer-reviewed research on reclaimers,
              informal recycling, and waste picker rights — drawn from CrossRef.
              This is external research, not produced by the network.
            </p>
            <p className="font-body text-xs text-muted/60 mb-8">
              Results via{' '}
              <a href="https://www.crossref.org" target="_blank" rel="noopener noreferrer"
                className="hover:text-muted transition-colors">CrossRef</a>
              {' '}· Filtered to reclaimer-specific topics
            </p>

            {/* Topic selector */}
            <div className="mb-6">
              <p className="font-body text-xs text-muted uppercase tracking-widest font-semibold mb-2">
                Filter by topic
              </p>
              <div className="flex flex-wrap gap-2">
                {SEARCH_QUERIES.map(q => (
                  <button key={q} onClick={() => setActiveQuery(q)}
                    className={`font-body text-xs px-4 py-1.5 rounded-full border transition-colors ${
                      activeQuery === q
                        ? 'bg-ink text-white border-ink'
                        : 'border-border text-muted hover:border-ink hover:text-ink'
                    }`}>
                    {q}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 mt-3">
                <button onClick={() => loadGlobal(activeQuery)} disabled={loading}
                  className="inline-flex items-center gap-1.5 font-body text-xs text-muted
                             hover:text-forest transition-colors disabled:opacity-40">
                  <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                  Refresh
                </button>
                {lastFetched && !loading && (
                  <span className="font-body text-xs text-muted/60">
                    Updated {lastFetched.toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 p-4 mb-4">
                <p className="font-body text-xs text-red-700">{error}</p>
              </div>
            )}

            <div className="space-y-3">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} />)
                : globalPubs.length > 0
                ? globalPubs.map(pub => <GlobalPubCard key={pub.doi} pub={pub} />)
                : !error && (
                  <p className="font-body text-xs text-muted py-8 text-center">
                    No results found for this topic.
                  </p>
                )
              }
            </div>

            {!loading && globalPubs.length > 0 && (
              <div className="mt-4 p-4 bg-white rounded-xl border border-dashed border-border">
                <p className="font-body text-xs text-muted leading-relaxed">
                  <span className="font-semibold text-ink">Seen a relevant paper? </span>
                  The Website Manager can save any of these to the network's own library
                  via the CMS Research section.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── RELATED RESOURCES ─────────────────────────────────────────── */}
      <section className="section bg-white border-t border-border">
        <div className="container max-w-2xl text-center">
          <p className="eyebrow">Related</p>
          <h2 className="section-heading">Teaching & learning materials</h2>
          <p className="section-lead mx-auto mb-8">
            Looking for materials to use in a classroom or training setting?
            The network produces free, downloadable teaching resources.
          </p>
          <a href="/teaching-resources" className="btn-primary inline-flex items-center gap-2">
            Browse Teaching Resources <ExternalLink size={14} />
          </a>
        </div>
      </section>

    </div>
  )
}