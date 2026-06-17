import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react'
import { getCollection, getDocument, createDocument, updateDocument, deleteDocument, generateSlug, extractYouTubeId } from '../lib/firebase'
import {
  Btn, Card, Field, Input, Textarea, Select,
  Toggle, SectionHead, StatusBadge, ConfirmDialog,
  EmptyState, Toast
} from '../components/ui'
import { ImageUpload } from '../components/ui/ImageUpload'
import { THEMES, Theme } from '@arouj/types'

const THEME_OPTIONS = Object.entries(THEMES) as [Theme, { label: string }][]

const PROGRAMME_OPTIONS = [
  { value: 'wp1', label: 'Network Coordination & Community Engagement' },
  { value: 'wp2', label: 'Strengthening ARO Public Engagement' },
  { value: 'wp3', label: 'ARO-UJ Youth Camp' },
  { value: 'wp4', label: 'Professionalising the ARO Warehouse' },
  { value: 'wp5', label: 'Landfill Closures & a Just Transition' },
  { value: 'wp6', label: 'Alternative Employment & Livelihoods' },
  { value: 'wp7', label: 'Advancing Sustainability at UJ' },
  { value: 'wp8', label: 'Advancing Reclaimer Health & Wellbeing' },
  { value: 'wp9', label: 'Justice for Migrant Reclaimers' },
  { value: 'wp10', label: 'Gender Justice & Reclaiming' },
]

const OUTPUT_TYPES = ['Research', 'Training', 'Design', 'Legal', 'Infrastructure', 'Policy', 'Education', 'Advocacy']

// ── Projects list ──────────────────────────────────────────────────────────
export function ProjectsListPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  function load() {
    getCollection<any>('projects').then(data => {
      setItems(data.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0)))
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [])

  async function handleDelete() {
    if (!deleteId) return
    try {
      await deleteDocument('projects', deleteId)
      setDeleteId(null)
      setToast({ message: 'Project deleted', type: 'success' })
      load()
    } catch {
      setToast({ message: 'Could not delete — please try again', type: 'error' })
    }
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <SectionHead title="Network Projects" description="All praxis projects — visible in the Praxis in Action section" />
        <Link to="/cms/projects/new">
          <Btn><Plus size={15} /> Add project</Btn>
        </Link>
      </div>

      {loading ? (
        <div className="font-body text-sm text-slate animate-pulse">Loading…</div>
      ) : items.length === 0 ? (
        <EmptyState
          message="No projects yet."
          action={<Link to="/cms/projects/new"><Btn><Plus size={15} /> Add the first one</Btn></Link>}
        />
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <Card key={item.id} className="p-4 flex items-center gap-4">
              {item.imagePath && (
                <img src={item.imagePath} alt={item.title}
                  className="w-14 h-14 rounded-lg object-cover shrink-0 border border-border"
                  onError={e => (e.currentTarget.style.display = 'none')} />
              )}
              <div className="flex-1 min-w-0">
                <div className="font-body font-semibold text-sm text-ink mb-0.5 truncate">{item.title}</div>
                <div className="font-body text-xs text-slate truncate">{item.years} · {item.outputType?.join(', ')}</div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {item.featured && (
                  <span className="font-body text-xs bg-greenlight text-forest px-2 py-0.5 rounded-full">
                    Featured
                  </span>
                )}
                <StatusBadge published={item.published} />
                <Link to={`/cms/projects/${item.id}`}>
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
        title="Delete this project?"
        message="This cannot be undone. The project will be permanently removed from the website."
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}

// ── Project form ───────────────────────────────────────────────────────────
export function ProjectFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = !id || id === 'new'

  const [form, setForm] = useState({
    title: '', programmeId: '', years: '',
    challenge: '', collaboration: '', outcome: '',
    collaborators: '', outputType: [] as string[],
    themes: [] as Theme[],
    mediaType: 'image' as 'image' | 'video',
    imageBase64: null as string | null,
    thumbnailBase64: null as string | null, videoUrl: '',
    published: false, featured: false,
  })
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!isNew && id) {
      getDocument<any>('projects', id).then(doc => {
        if (doc) {
          setForm({
            title: doc.title ?? '',
            programmeId: doc.programmeId ?? '',
            years: doc.years ?? '',
            challenge: doc.challenge ?? '',
            collaboration: doc.collaboration ?? '',
            outcome: doc.outcome ?? '',
            collaborators: doc.collaborators ?? '',
            outputType: doc.outputType ?? [],
            themes: doc.themes ?? [],
            mediaType: doc.videoId ? 'video' : 'image',
            imageBase64: doc.imageBase64 ?? null,
            thumbnailBase64: doc.thumbnailBase64 ?? null,
            videoUrl: doc.videoId ? `https://youtube.com/watch?v=${doc.videoId}` : '',
            published: doc.published ?? false,
            featured: doc.featured ?? false,
          })
        }
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

  function toggleOutput(o: string) {
    set('outputType', form.outputType.includes(o) ? form.outputType.filter(x => x !== o) : [...form.outputType, o])
  }

  function validate() {
    const errs: Record<string, string> = {}
    if (!form.title.trim()) errs.title = 'A title is required'
    if (!form.challenge.trim()) errs.challenge = 'Describe the challenge this project addressed'
    if (!form.outcome.trim()) errs.outcome = 'Describe the outcome'
    if (form.mediaType === 'video' && form.videoUrl && !extractYouTubeId(form.videoUrl)) {
      errs.videoUrl = 'This doesn\'t look like a valid YouTube link'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSave() {
    if (!validate()) return
    setSaving(true)
    try {
      const videoId = form.mediaType === 'video' ? extractYouTubeId(form.videoUrl) : null
      const data = {
        title: form.title.trim(),
        programmeId: form.programmeId,
        years: form.years.trim(),
        challenge: form.challenge.trim(),
        collaboration: form.collaboration.trim(),
        outcome: form.outcome.trim(),
        collaborators: form.collaborators.trim(),
        outputType: form.outputType,
        themes: form.themes,
        imageBase64: form.mediaType === 'image' ? form.imageBase64 : null,
        thumbnailBase64: form.mediaType === 'video' ? form.thumbnailBase64 : null,
        videoId,
        published: form.published,
        featured: form.featured,
        slug: generateSlug(form.title),
      }
      if (isNew) await createDocument('projects', data)
      else await updateDocument('projects', id!, data)
      setToast({ message: isNew ? 'Project created!' : 'Changes saved!', type: 'success' })
      setTimeout(() => navigate('/cms/projects'), 1500)
    } catch {
      setToast({ message: 'Could not save — please try again', type: 'error' })
      setSaving(false)
    }
  }

  if (loading) return <div className="font-body text-sm text-slate animate-pulse p-8">Loading…</div>

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link to="/cms/projects">
          <Btn variant="ghost" size="sm"><ArrowLeft size={14} /> Projects</Btn>
        </Link>
        <h1 className="font-body font-bold text-xl text-ink">
          {isNew ? 'Add project' : 'Edit project'}
        </h1>
      </div>

      <div className="space-y-5">
        {/* Basic info */}
        <Card className="p-5 space-y-4">
          <h2 className="font-body font-semibold text-sm text-ink border-b border-border pb-3">Basic information</h2>
          <Field label="Project title" required error={errors.title}
            hint="Use plain language — avoid academic titles">
            <Input value={form.title} onChange={e => set('title', e.target.value)}
              placeholder="e.g. Solar heating & cooling — Selby sorting depot" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Programme" hint="Which work package does this belong to?">
              <Select value={form.programmeId} onChange={e => set('programmeId', e.target.value)}>
                <option value="">— Select a programme —</option>
                {PROGRAMME_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Select>
            </Field>
            <Field label="Year(s)" hint="e.g. 2023 or 2023–2024">
              <Input value={form.years} onChange={e => set('years', e.target.value)} placeholder="2024" />
            </Field>
          </div>
          <Field label="Who was involved" hint="List ARO members and UJ participants — no faculty labels">
            <Input value={form.collaborators} onChange={e => set('collaborators', e.target.value)}
              placeholder="ARO Selby depot reclaimers, UJ FEBE engineering students, Ms Nickey Janse van Rensburg" />
          </Field>
        </Card>

        {/* The story */}
        <Card className="p-5 space-y-4">
          <h2 className="font-body font-semibold text-sm text-ink border-b border-border pb-3">The project story</h2>
          <Field label="The challenge" required error={errors.challenge}
            hint="1–2 sentences: what problem or situation did this project address?">
            <Textarea rows={2} value={form.challenge} onChange={e => set('challenge', e.target.value)}
              placeholder="Reclaimers at the Selby sorting depot worked without adequate shelter or power…" />
          </Field>
          <Field label="The collaboration" hint="2–3 sentences: how did ARO and UJ work together?">
            <Textarea rows={3} value={form.collaboration} onChange={e => set('collaboration', e.target.value)}
              placeholder="Engineering students worked alongside ARO Selby depot reclaimers across two semesters…" />
          </Field>
          <Field label="What changed" required error={errors.outcome}
            hint="1–2 sentences: what was the concrete outcome?">
            <Textarea rows={2} value={form.outcome} onChange={e => set('outcome', e.target.value)}
              placeholder="Solar system installed and operational. Three reclaimers trained as the maintenance team…" />
          </Field>
        </Card>

        {/* Output types */}
        <Card className="p-5">
          <h2 className="font-body font-semibold text-sm text-ink border-b border-border pb-3 mb-4">Type of output</h2>
          <div className="flex flex-wrap gap-2">
            {OUTPUT_TYPES.map(o => (
              <button key={o} type="button" onClick={() => toggleOutput(o)}
                className={`font-body text-xs px-4 py-2 rounded-full border transition-colors ${
                  form.outputType.includes(o)
                    ? 'bg-forest text-white border-forest'
                    : 'border-border text-slate hover:border-forest hover:text-forest'
                }`}>
                {o}
              </button>
            ))}
          </div>
        </Card>

        {/* Themes */}
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

        {/* Media */}
        <Card className="p-5">
          <h2 className="font-body font-semibold text-sm text-ink border-b border-border pb-3 mb-4">Image or video</h2>
          <ImageUpload
            label="Project image or video"
            value={form.imageBase64}
            onChange={v => set('imageBase64', v)}
            allowVideo
            mediaType={form.mediaType}
            videoUrl={form.videoUrl}
            onMediaTypeChange={v => set('mediaType', v)}
            onVideoChange={v => set('videoUrl', v)}
          />
          {errors.videoUrl && <p className="font-body text-xs text-red-600 mt-2">{errors.videoUrl}</p>}
          {form.mediaType === 'video' && (
            <div className="mt-4 pt-4 border-t border-border">
              <ImageUpload
                label="Thumbnail image (shown on cards)"
                value={form.thumbnailBase64}
                onChange={v => set('thumbnailBase64', v)}
                hint="Upload a photo to display on project cards and the homepage. The video plays on the detail page."
              />
            </div>
          )}
        </Card>

        {/* Publish settings */}
        <Card className="p-5 space-y-4">
          <h2 className="font-body font-semibold text-sm text-ink border-b border-border pb-3">Publishing</h2>
          <Toggle checked={form.featured} onChange={v => set('featured', v)}
            label="Feature on the homepage"
            description="The featured project appears as the large story card on the home page" />
          <Toggle checked={form.published} onChange={v => set('published', v)}
            label={form.published ? 'Published — visible to visitors' : 'Draft — not visible to visitors'}
            description={form.published ? 'Turn off to hide without deleting' : 'Turn on when ready to go live'} />
        </Card>

        <div className="flex gap-3">
          <Btn onClick={handleSave} loading={saving}>{isNew ? 'Create project' : 'Save changes'}</Btn>
          <Link to="/cms/projects"><Btn variant="ghost">Cancel</Btn></Link>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}