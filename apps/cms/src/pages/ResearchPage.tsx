import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Plus, Pencil, Trash2, ArrowLeft, ExternalLink, Globe, RefreshCw, BookmarkPlus, Check } from 'lucide-react'
import {
  getCollection, getDocument, createDocument,
  updateDocument, deleteDocument
} from '../lib/firebase'
import {
  Btn, Card, Field, Input, Textarea,
  Toggle, SectionHead, StatusBadge, ConfirmDialog,
  EmptyState, Toast
} from '../components/ui'
import { THEMES, Theme } from '@arouj/types'

const THEME_OPTIONS = Object.entries(THEMES) as [Theme, { label: string }][]

interface CrossRefPub {
  doi: string; title: string; authors: string
  year: number | null; journal: string; abstract: string; url: string
}

const SEARCH_QUERIES = [
  'waste picker South Africa',
  'informal recycling reclaimers',
  'waste picker integration municipal',
  'reclaimer livelihoods informal economy',
]

async function fetchCrossRef(query: string): Promise<CrossRefPub[]> {
  const encoded = encodeURIComponent(query)
  const url = `https://api.crossref.org/works?query=${encoded}&rows=8&sort=relevance&filter=has-abstract:true&select=DOI,title,author,published-print,published-online,container-title,abstract,URL`
  const res = await fetch(url, { headers: { 'User-Agent': 'ARO-UJ Praxis CMS (praxis@uj.ac.za)' } })
  if (!res.ok) throw new Error('CrossRef fetch failed')
  const data = await res.json()
  return (data.message?.items ?? []).map((item: any) => ({
    doi:     item.DOI,
    title:   item.title?.[0] ?? 'Untitled',
    authors: item.author
      ? item.author.slice(0, 3).map((a: any) => `${a.family}${a.given ? ', ' + a.given[0] + '.' : ''}`).join('; ')
        + (item.author.length > 3 ? ' et al.' : '')
      : 'Unknown authors',
    year:    item['published-print']?.['date-parts']?.[0]?.[0]
          ?? item['published-online']?.['date-parts']?.[0]?.[0] ?? null,
    journal: item['container-title']?.[0] ?? '',
    abstract: (item.abstract ?? '').replace(/<[^>]*>/g, '').slice(0, 500),
    url:     item.URL ?? `https://doi.org/${item.DOI}`,
  }))
}

// ── Research list page ─────────────────────────────────────────────────────
export function ResearchListPage() {
  const [items, setItems]           = useState<any[]>([])
  const [loading, setLoading]       = useState(true)
  const [deleteId, setDeleteId]     = useState<string | null>(null)
  const [toast, setToast]           = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [activeQuery, setActiveQuery] = useState(SEARCH_QUERIES[0])
  const [globalPubs, setGlobalPubs] = useState<CrossRefPub[]>([])
  const [globalLoading, setGlobalLoading] = useState(false)
  const [savedDois, setSavedDois]   = useState<Set<string>>(new Set())
  const [savingDoi, setSavingDoi]   = useState<string | null>(null)

  function load() {
    getCollection<any>('publications').then(data => {
      const sorted = data.sort((a: any, b: any) => (b.year ?? 0) - (a.year ?? 0))
      setItems(sorted)
      setSavedDois(new Set(data.map((p: any) => p.doi).filter(Boolean)))
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [])

  async function fetchGlobal(query: string) {
    setGlobalLoading(true)
    try {
      setGlobalPubs(await fetchCrossRef(query))
    } catch {
      setToast({ message: 'Could not load CrossRef feed', type: 'error' })
    } finally {
      setGlobalLoading(false)
    }
  }

  useEffect(() => { fetchGlobal(activeQuery) }, [activeQuery])

  async function handleDelete() {
    if (!deleteId) return
    try {
      await deleteDocument('publications', deleteId)
      setDeleteId(null)
      setToast({ message: 'Publication removed', type: 'success' })
      load()
    } catch {
      setToast({ message: 'Could not delete — please try again', type: 'error' })
    }
    setTimeout(() => setToast(null), 3000)
  }

  async function saveToLibrary(pub: CrossRefPub) {
    setSavingDoi(pub.doi)
    try {
      await createDocument('publications', {
        title: pub.title, authors: pub.authors,
        year: pub.year ?? new Date().getFullYear(),
        journal: pub.journal, abstract: pub.abstract,
        url: pub.url, doi: pub.doi,
        documentPath: null, themes: [], openAccess: false, published: false,
      })
      setSavedDois(prev => new Set([...prev, pub.doi]))
      setToast({ message: 'Saved as draft — edit it to add themes then publish', type: 'success' })
      load()
    } catch {
      setToast({ message: 'Could not save — please try again', type: 'error' })
    } finally {
      setSavingDoi(null)
      setTimeout(() => setToast(null), 4000)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <SectionHead title="Research & Publications"
          description="Papers and reports from network members — visible on the Research page" />
        <Link to="/cms/research/new"><Btn><Plus size={15} /> Add manually</Btn></Link>
      </div>

      {/* Saved publications */}
      {loading ? (
        <div className="font-body text-sm text-slate animate-pulse mb-8">Loading…</div>
      ) : items.length === 0 ? (
        <EmptyState message="No publications yet. Add one manually or save from the global feed below."
          action={<Link to="/cms/research/new"><Btn><Plus size={15} /> Add manually</Btn></Link>} />
      ) : (
        <div className="space-y-3 mb-10">
          {items.map((item: any) => (
            <Card key={item.id} className="p-4 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="font-body font-semibold text-sm text-ink mb-0.5 leading-snug">{item.title}</div>
                <div className="font-body text-xs text-slate">
                  {item.authors} · {item.journal}{item.year ? ` · ${item.year}` : ''}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {item.openAccess && (
                  <span className="font-body text-xs bg-greenlight text-forest px-2 py-0.5 rounded-full">Open Access</span>
                )}
                <StatusBadge published={item.published} />
                {item.url && (
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={13} className="text-muted hover:text-forest" />
                  </a>
                )}
                <Link to={`/cms/research/${item.id}`}>
                  <Btn variant="ghost" size="sm"><Pencil size={13} /> Edit</Btn>
                </Link>
                <Btn variant="ghost" size="sm" onClick={() => setDeleteId(item.id)}>
                  <Trash2 size={13} className="text-red-500" />
                </Btn>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* CrossRef save-to-library section */}
      <div className="border-t border-border pt-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-1.5 bg-surface rounded-lg border border-border">
            <Globe size={14} className="text-muted" />
          </div>
          <h2 className="font-body font-bold text-base text-ink">Save from global feed</h2>
        </div>
        <p className="font-body text-sm text-slate mb-5">
          Browse live results from CrossRef — the open academic index. Click{' '}
          <strong className="text-ink">Save to library</strong> to add any paper as a draft.
          Then edit it to add themes and publish it to the Research page.
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {SEARCH_QUERIES.map(q => (
            <button key={q} onClick={() => setActiveQuery(q)}
              className={`font-body text-xs px-4 py-1.5 rounded-full border transition-colors ${
                activeQuery === q ? 'bg-ink text-white border-ink' : 'border-border text-slate hover:border-ink hover:text-ink'
              }`}>
              {q}
            </button>
          ))}
          <button onClick={() => fetchGlobal(activeQuery)} disabled={globalLoading}
            className="inline-flex items-center gap-1.5 font-body text-xs text-muted hover:text-forest
                       transition-colors disabled:opacity-40 px-2">
            <RefreshCw size={12} className={globalLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {globalLoading ? (
          <div className="font-body text-sm text-slate animate-pulse">Loading CrossRef…</div>
        ) : (
          <div className="space-y-3">
            {globalPubs.map(pub => {
              const alreadySaved = savedDois.has(pub.doi)
              const isSaving     = savingDoi === pub.doi
              return (
                <Card key={pub.doi} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="font-body font-semibold text-sm text-ink mb-0.5 leading-snug">{pub.title}</div>
                      <div className="font-body text-xs text-slate mb-1">
                        {pub.authors} · {pub.journal}{pub.year ? ` · ${pub.year}` : ''}
                      </div>
                      {pub.abstract && (
                        <p className="font-body text-xs text-slate/70 leading-relaxed line-clamp-2">{pub.abstract}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <a href={pub.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink size={13} className="text-muted hover:text-forest" />
                      </a>
                      {alreadySaved ? (
                        <div className="inline-flex items-center gap-1.5 font-body text-xs
                                        text-forest bg-greenlight px-3 py-1.5 rounded-lg">
                          <Check size={12} /> Saved
                        </div>
                      ) : (
                        <Btn size="sm" variant="outline" loading={isSaving} onClick={() => saveToLibrary(pub)}>
                          <BookmarkPlus size={13} /> Save to library
                        </Btn>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      <ConfirmDialog open={!!deleteId} title="Delete this publication?"
        message="It will be removed from the Research page." confirmLabel="Delete" danger
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}

// ── Research form ──────────────────────────────────────────────────────────
export function ResearchFormPage() {
  const { id }   = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew    = !id || id === 'new'

  const [form, setForm] = useState({
    title: '', authors: '', year: new Date().getFullYear().toString(),
    journal: '', abstract: '', url: '', doi: '', documentPath: '',
    themes: [] as Theme[], openAccess: false, published: false,
  })
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving]   = useState(false)
  const [toast, setToast]     = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [errors, setErrors]   = useState<Record<string, string>>({})

  useEffect(() => {
    if (!isNew && id) {
      getDocument<any>('publications', id).then(doc => {
        if (doc) setForm({
          title: doc.title ?? '', authors: doc.authors ?? '',
          year: String(doc.year ?? new Date().getFullYear()),
          journal: doc.journal ?? '', abstract: doc.abstract ?? '',
          url: doc.url ?? '', doi: doc.doi ?? '',
          documentPath: doc.documentPath ?? '',
          themes: doc.themes ?? [], openAccess: doc.openAccess ?? false, published: doc.published ?? false,
        })
        setLoading(false)
      })
    }
  }, [id])

  function set(key: string, value: any) {
    setForm(f => ({ ...f, [key]: value }))
    setErrors(e => ({ ...e, [key]: '' }))
  }

  function toggleTheme(t: Theme) {
    set('themes', form.themes.includes(t) ? form.themes.filter(x => x !== t) : [...form.themes, t])
  }

  function validate() {
    const errs: Record<string, string> = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (!form.authors.trim()) errs.authors = 'Authors are required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSave() {
    if (!validate()) return
    setSaving(true)
    try {
      const data = {
        title: form.title.trim(), authors: form.authors.trim(),
        year: parseInt(form.year) || new Date().getFullYear(),
        journal: form.journal.trim(), abstract: form.abstract.trim(),
        url: form.url.trim() || null, doi: form.doi.trim() || null,
        documentPath: form.documentPath.trim() || null,
        themes: form.themes, openAccess: form.openAccess, published: form.published,
      }
      if (isNew) await createDocument('publications', data)
      else await updateDocument('publications', id!, data)
      setToast({ message: isNew ? 'Publication added!' : 'Changes saved!', type: 'success' })
      setTimeout(() => navigate('/cms/research'), 1500)
    } catch {
      setToast({ message: 'Could not save — please try again', type: 'error' })
      setSaving(false)
    }
  }

  if (loading) return <div className="font-body text-sm text-slate animate-pulse p-8">Loading…</div>

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link to="/cms/research"><Btn variant="ghost" size="sm"><ArrowLeft size={14} /> Research</Btn></Link>
        <h1 className="font-body font-bold text-xl text-ink">{isNew ? 'Add publication' : 'Edit publication'}</h1>
      </div>

      {!isNew && (
        <Card className="p-4 bg-amber-50 border-amber-200 mb-5">
          <p className="font-body text-sm text-amber-800">
            <strong>Saved from CrossRef?</strong> Add themes below then set Published to show on the Research page.
          </p>
        </Card>
      )}

      <div className="space-y-5">
        <Card className="p-5 space-y-4">
          <h2 className="font-body font-semibold text-sm text-ink border-b border-border pb-3">Publication details</h2>
          <Field label="Full title" required error={errors.title}>
            <Input value={form.title} onChange={e => set('title', e.target.value)}
              placeholder="Waste Picker Integration in South African Municipal Systems" />
          </Field>
          <Field label="Authors" required error={errors.authors} hint="Surname, Initial. Separate with semicolons.">
            <Input value={form.authors} onChange={e => set('authors', e.target.value)} placeholder="Samson, M.; Fourie, E." />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Year published">
              <Input type="number" value={form.year} onChange={e => set('year', e.target.value)} min="2000" max="2099" />
            </Field>
            <Field label="Journal">
              <Input value={form.journal} onChange={e => set('journal', e.target.value)} placeholder="Urban Forum" />
            </Field>
          </div>
          <Field label="Abstract or description">
            <Textarea rows={4} value={form.abstract} onChange={e => set('abstract', e.target.value)} placeholder="This paper examines…" />
          </Field>
        </Card>

        <Card className="p-5 space-y-4">
          <h2 className="font-body font-semibold text-sm text-ink border-b border-border pb-3">Links & access</h2>
          <Field label="DOI" hint="e.g. 10.1007/s12132-024-09512-w">
            <Input value={form.doi} onChange={e => set('doi', e.target.value)} placeholder="10.1007/..." />
          </Field>
          <Field label="Full URL">
            <Input value={form.url} onChange={e => set('url', e.target.value)} placeholder="https://doi.org/..." />
          </Field>
          <Field label="PDF path" hint="Place PDF in apps/web/public/downloads/">
            <Input value={form.documentPath} onChange={e => set('documentPath', e.target.value)} placeholder="/downloads/paper.pdf" />
          </Field>
          <Toggle checked={form.openAccess} onChange={v => set('openAccess', v)}
            label="Open access — freely available online" />
        </Card>

        <Card className="p-5">
          <h2 className="font-body font-semibold text-sm text-ink border-b border-border pb-3 mb-4">Themes</h2>
          <div className="flex flex-wrap gap-2">
            {THEME_OPTIONS.map(([key, { label }]) => (
              <button key={key} type="button" onClick={() => toggleTheme(key)}
                className={`font-body text-xs px-4 py-2 rounded-full border transition-colors ${
                  form.themes.includes(key) ? 'bg-forest text-white border-forest' : 'border-border text-slate hover:border-forest hover:text-forest'
                }`}>
                {label}
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-body font-semibold text-sm text-ink border-b border-border pb-3 mb-4">Publishing</h2>
          <Toggle checked={form.published} onChange={v => set('published', v)}
            label={form.published ? 'Published — visible on Research page' : 'Draft — not visible yet'} />
        </Card>

        <div className="flex gap-3">
          <Btn onClick={handleSave} loading={saving}>{isNew ? 'Add publication' : 'Save changes'}</Btn>
          <Link to="/cms/research"><Btn variant="ghost">Cancel</Btn></Link>
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}
