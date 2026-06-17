import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Plus, Pencil, Trash2, ArrowLeft, Download } from 'lucide-react'
import {
  getCollection, getDocument, createDocument,
  updateDocument, deleteDocument
} from '../lib/firebase'
import {
  Btn, Card, Field, Input, Textarea, Select,
  Toggle, SectionHead, StatusBadge, ConfirmDialog,
  EmptyState, Toast
} from '../components/ui'
import { THEMES, Theme } from '@arouj/types'

const THEME_OPTIONS = Object.entries(THEMES) as [Theme, { label: string }][]

const RESOURCE_TYPES = [
  'Teaching guide',
  'Workshop materials',
  'Case study',
  'Policy brief',
  'Factsheet',
  'Toolkit',
  'Video',
  'Report',
  'Other',
]

// ── Resources list ─────────────────────────────────────────────────────────
export function ResourcesListPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  function load() {
    getCollection<any>('resources').then(data => {
      setItems(data.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0)))
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [])

  async function handleDelete() {
    if (!deleteId) return
    try {
      await deleteDocument('resources', deleteId)
      setDeleteId(null)
      setToast({ message: 'Resource deleted', type: 'success' })
      load()
    } catch {
      setToast({ message: 'Could not delete — please try again', type: 'error' })
    }
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <SectionHead
          title="Free Downloads"
          description="Teaching resources, toolkits, and other materials available for free download"
        />
        <Link to="/cms/resources/new">
          <Btn><Plus size={15} /> Add resource</Btn>
        </Link>
      </div>

      {loading ? (
        <div className="font-body text-sm text-slate animate-pulse">Loading…</div>
      ) : items.length === 0 ? (
        <EmptyState
          message="No resources yet."
          action={<Link to="/cms/resources/new"><Btn><Plus size={15} /> Add the first one</Btn></Link>}
        />
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <Card key={item.id} className="p-4 flex items-center gap-4">
              <div className="p-2 bg-surface rounded-lg shrink-0">
                <Download size={14} className="text-muted" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-body font-semibold text-sm text-ink mb-0.5 truncate">
                  {item.title}
                </div>
                <div className="font-body text-xs text-slate">
                  {item.resourceType} · {item.description?.slice(0, 80)}…
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <StatusBadge published={item.published} />
                <Link to={`/cms/resources/${item.id}`}>
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

      <ConfirmDialog
        open={!!deleteId}
        title="Delete this resource?"
        message="It will be removed from the Teaching Resources page."
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}

// ── Resource form ──────────────────────────────────────────────────────────
export function ResourceFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = !id || id === 'new'

  const [form, setForm] = useState({
    title: '', description: '', resourceType: 'Teaching guide',
    documentPath: '', externalUrl: '',
    linkType: 'file' as 'file' | 'external',
    themes: [] as Theme[], published: false,
  })
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!isNew && id) {
      getDocument<any>('resources', id).then(doc => {
        if (doc) setForm({
          title:        doc.title ?? '',
          description:  doc.description ?? '',
          resourceType: doc.resourceType ?? 'Teaching guide',
          documentPath: doc.documentPath ?? '',
          externalUrl:  doc.externalUrl ?? '',
          linkType:     doc.externalUrl ? 'external' : 'file',
          themes:       doc.themes ?? [],
          published:    doc.published ?? false,
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
    if (!form.description.trim()) errs.description = 'Description is required'
    if (form.linkType === 'file' && !form.documentPath.trim()) {
      errs.documentPath = 'File path is required'
    }
    if (form.linkType === 'external' && !form.externalUrl.trim()) {
      errs.externalUrl = 'External link is required'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSave() {
    if (!validate()) return
    setSaving(true)
    try {
      const data = {
        title:        form.title.trim(),
        description:  form.description.trim(),
        resourceType: form.resourceType,
        documentPath: form.linkType === 'file' ? form.documentPath.trim() : null,
        externalUrl:  form.linkType === 'external' ? form.externalUrl.trim() : null,
        themes:       form.themes,
        published:    form.published,
      }
      if (isNew) await createDocument('resources', data)
      else await updateDocument('resources', id!, data)
      setToast({ message: isNew ? 'Resource added!' : 'Changes saved!', type: 'success' })
      setTimeout(() => navigate('/cms/resources'), 1500)
    } catch {
      setToast({ message: 'Could not save — please try again', type: 'error' })
      setSaving(false)
    }
  }

  if (loading) return <div className="font-body text-sm text-slate animate-pulse p-8">Loading…</div>

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link to="/cms/resources">
          <Btn variant="ghost" size="sm"><ArrowLeft size={14} /> Resources</Btn>
        </Link>
        <h1 className="font-body font-bold text-xl text-ink">
          {isNew ? 'Add resource' : 'Edit resource'}
        </h1>
      </div>

      <div className="space-y-5">
        <Card className="p-5 space-y-4">
          <h2 className="font-body font-semibold text-sm text-ink border-b border-border pb-3">
            Resource details
          </h2>
          <Field label="Title" required error={errors.title}>
            <Input value={form.title} onChange={e => set('title', e.target.value)}
              placeholder="e.g. Reclaimer Health & Safety Toolkit" />
          </Field>
          <Field label="Type">
            <Select value={form.resourceType} onChange={e => set('resourceType', e.target.value)}>
              {RESOURCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </Select>
          </Field>
          <Field label="Description" required error={errors.description}
            hint="2–3 sentences explaining what the resource is and who it's for">
            <Textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="A practical guide for facilitators running health and safety workshops with reclaimers…" />
          </Field>
        </Card>

        <Card className="p-5 space-y-4">
          <h2 className="font-body font-semibold text-sm text-ink border-b border-border pb-3">
            Download or link
          </h2>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={form.linkType === 'file'}
                onChange={() => set('linkType', 'file')} className="accent-forest" />
              <span className="font-body text-sm text-ink">File download</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={form.linkType === 'external'}
                onChange={() => set('linkType', 'external')} className="accent-forest" />
              <span className="font-body text-sm text-ink">External link</span>
            </label>
          </div>

          {form.linkType === 'file' ? (
            <Field label="File path" required error={errors.documentPath}
              hint="Place the file in apps/web/public/downloads/ and enter the path">
              <Input value={form.documentPath} onChange={e => set('documentPath', e.target.value)}
                placeholder="/downloads/reclaimer-health-toolkit.pdf" />
            </Field>
          ) : (
            <Field label="External URL" required error={errors.externalUrl}
              hint="Link to an external resource (Google Drive, external website, etc.)">
              <Input value={form.externalUrl} onChange={e => set('externalUrl', e.target.value)}
                placeholder="https://drive.google.com/..." />
            </Field>
          )}
        </Card>

        <Card className="p-5">
          <h2 className="font-body font-semibold text-sm text-ink border-b border-border pb-3 mb-4">Themes</h2>
          <div className="flex flex-wrap gap-2">
            {THEME_OPTIONS.map(([key, { label }]) => (
              <button key={key} type="button" onClick={() => toggleTheme(key)}
                className={`font-body text-xs px-4 py-2 rounded-full border transition-colors ${
                  form.themes.includes(key)
                    ? 'bg-forest text-white border-forest'
                    : 'border-border text-slate hover:border-forest hover:text-forest'
                }`}>
                {label}
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-body font-semibold text-sm text-ink border-b border-border pb-3 mb-4">
            Publishing
          </h2>
          <Toggle
            checked={form.published}
            onChange={v => set('published', v)}
            label={form.published ? 'Published — visible on Teaching Resources page' : 'Draft — not visible'}
          />
        </Card>

        <div className="flex gap-3">
          <Btn onClick={handleSave} loading={saving}>
            {isNew ? 'Add resource' : 'Save changes'}
          </Btn>
          <Link to="/cms/resources"><Btn variant="ghost">Cancel</Btn></Link>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}
