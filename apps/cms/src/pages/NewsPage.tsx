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

// ── News list ──────────────────────────────────────────────────────────────
export function NewsListPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  function load() {
    getCollection<any>('news').then(data => {
      setItems(data.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0)))
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [])

  async function handleDelete() {
    if (!deleteId) return
    try {
      await deleteDocument('news', deleteId)
      setDeleteId(null)
      setToast({ message: 'News item deleted', type: 'success' })
      load()
    } catch {
      setToast({ message: 'Could not delete — please try again', type: 'error' })
    }
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <SectionHead title="News & Updates" description="Articles, events, and announcements" />
        <Link to="/cms/news/new">
          <Btn><Plus size={15} /> Add news item</Btn>
        </Link>
      </div>

      {loading ? (
        <div className="font-body text-sm text-slate animate-pulse">Loading…</div>
      ) : items.length === 0 ? (
        <EmptyState
          message="No news items yet."
          action={<Link to="/cms/news/new"><Btn><Plus size={15} /> Add the first one</Btn></Link>}
        />
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <Card key={item.id} className="p-4 flex items-center gap-4">
              {/* Thumbnail */}
              {item.imagePath && (
                <img src={item.imagePath} alt={item.title}
                  className="w-14 h-14 rounded-lg object-cover shrink-0 border border-border"
                  onError={e => (e.currentTarget.style.display = 'none')} />
              )}
              <div className="flex-1 min-w-0">
                <div className="font-body font-semibold text-sm text-ink mb-0.5 truncate">{item.title}</div>
                <div className="font-body text-xs text-slate truncate">{item.excerpt}</div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <StatusBadge published={item.published} />
                <Link to={`/cms/news/${item.id}`}>
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
        title="Delete this news item?"
        message="This cannot be undone. The item will be permanently removed."
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}

// ── News form (create + edit) ──────────────────────────────────────────────
export function NewsFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = !id || id === 'new'

  const [form, setForm] = useState({
    title: '', excerpt: '', body: '',
    themes: [] as Theme[],
    mediaType: 'image' as 'image' | 'video',
    imageBase64: null as string | null, videoUrl: '',
    published: false,
  })
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!isNew && id) {
      getDocument<any>('news', id).then(doc => {
        if (doc) {
          setForm({
            title: doc.title ?? '',
            excerpt: doc.excerpt ?? '',
            body: doc.body ?? '',
            themes: doc.themes ?? [],
            mediaType: doc.videoId ? 'video' : 'image',
            imageBase64: doc.imageBase64 ?? null,
            videoUrl: doc.videoId ? `https://youtube.com/watch?v=${doc.videoId}` : '',
            published: doc.published ?? false,
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

  function toggleTheme(theme: Theme) {
    set('themes', form.themes.includes(theme)
      ? form.themes.filter(t => t !== theme)
      : [...form.themes, theme])
  }

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!form.title.trim()) errs.title = 'A title is required'
    if (!form.excerpt.trim()) errs.excerpt = 'A short summary is required'
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
        excerpt: form.excerpt.trim(),
        body: form.body.trim() || `<p>${form.excerpt.trim()}</p>`,
        themes: form.themes,
        imageBase64: form.mediaType === 'image' ? form.imageBase64 : null,
        videoId,
        published: form.published,
        slug: generateSlug(form.title),
      }
      if (isNew) {
        await createDocument('news', data)
      } else {
        await updateDocument('news', id!, data)
      }
      setToast({ message: isNew ? 'News item created!' : 'Changes saved!', type: 'success' })
      setTimeout(() => navigate('/cms/news'), 1500)
    } catch {
      setToast({ message: 'Could not save — please try again', type: 'error' })
      setSaving(false)
    }
  }

  if (loading) return <div className="font-body text-sm text-slate animate-pulse p-8">Loading…</div>

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link to="/cms/news">
          <Btn variant="ghost" size="sm"><ArrowLeft size={14} /> News</Btn>
        </Link>
        <h1 className="font-body font-bold text-xl text-ink">
          {isNew ? 'Add news item' : 'Edit news item'}
        </h1>
      </div>

      <div className="space-y-5">
        {/* Title */}
        <Card className="p-5 space-y-4">
          <h2 className="font-body font-semibold text-sm text-ink border-b border-border pb-3">
            Basic information
          </h2>
          <Field label="Headline" required error={errors.title}
            hint="The title that appears on the news card and article page">
            <Input value={form.title} onChange={e => set('title', e.target.value)}
              placeholder="e.g. ARO launches new campaign for landfill reclaimers" />
          </Field>
          <Field label="Short summary" required error={errors.excerpt}
            hint="2–3 sentences shown on the news card. Keep it under 200 characters.">
            <Textarea rows={3} value={form.excerpt}
              onChange={e => set('excerpt', e.target.value)}
              placeholder="A brief description of the news item…" />
          </Field>
          <Field label="Full article" hint="Optional — leave blank to use the summary as the article body">
            <Textarea rows={6} value={form.body}
              onChange={e => set('body', e.target.value)}
              placeholder="Write the full article here…" />
          </Field>
        </Card>

        {/* Themes */}
        <Card className="p-5">
          <h2 className="font-body font-semibold text-sm text-ink border-b border-border pb-3 mb-4">
            Themes
          </h2>
          <p className="font-body text-xs text-slate mb-3">
            Select the themes this news item relates to. Choose at least one.
          </p>
          <div className="flex flex-wrap gap-2">
            {THEME_OPTIONS.map(([key, { label }]) => (
              <button key={key} type="button"
                onClick={() => toggleTheme(key)}
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
          <h2 className="font-body font-semibold text-sm text-ink border-b border-border pb-3 mb-4">
            Image or video
          </h2>
          <ImageUpload
            label="News image or video"
            value={form.imageBase64}
            onChange={v => set('imageBase64', v)}
            allowVideo
            mediaType={form.mediaType}
            videoUrl={form.videoUrl}
            onMediaTypeChange={v => set('mediaType', v)}
            onVideoChange={v => set('videoUrl', v)}
          />
          {errors.videoUrl && <p className="font-body text-xs text-red-600 mt-2">{errors.videoUrl}</p>}
        </Card>

        {/* Publish */}
        <Card className="p-5">
          <h2 className="font-body font-semibold text-sm text-ink border-b border-border pb-3 mb-4">
            Publishing
          </h2>
          <Toggle
            checked={form.published}
            onChange={v => set('published', v)}
            label={form.published ? 'Published — visible to visitors' : 'Draft — not visible to visitors'}
            description={form.published
              ? 'Turn this off to hide the item without deleting it'
              : 'Turn this on when the item is ready to go live'}
          />
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Btn onClick={handleSave} loading={saving}>
            {isNew ? 'Create news item' : 'Save changes'}
          </Btn>
          <Link to="/cms/news">
            <Btn variant="ghost">Cancel</Btn>
          </Link>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}