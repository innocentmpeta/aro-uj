import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react'
import {
  getCollection, getDocument, createDocument,
  updateDocument, deleteDocument
} from '../lib/firebase'
import {
  Btn, Card, Field, Input, Textarea, Select,
  Toggle, SectionHead, StatusBadge, ConfirmDialog,
  EmptyState, Toast
} from '../components/ui'
import { ImageUpload } from '../components/ui/ImageUpload'

const ORG_OPTIONS = ['UJ', 'ARO', 'KU Leuven', 'Other']
const FACULTY_OPTIONS = [
  'Humanities — Sociology',
  'Humanities — Psychology',
  'Law — Public Law',
  'FADA — Industrial Design',
  'FADA — Fashion',
  'FADA — Visual Arts',
  'FADA — Multimedia',
  'FADA — Graphic Design',
  'Engineering & Built Environment — PEETS',
  'Science — Geography & Environmental Management',
  'Health Sciences — Environmental Health',
  'College of Business & Economics — Economics',
  'KU Leuven — HIVA Research Institute',
  'African Reclaimers Organisation',
  'Other',
]

// ── Team list ──────────────────────────────────────────────────────────────
export function TeamListPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  function load() {
    getCollection<any>('team').then(data => {
      setItems(data.sort((a, b) => (a.order ?? 99) - (b.order ?? 99)))
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [])

  async function handleDelete() {
    if (!deleteId) return
    try {
      await deleteDocument('team', deleteId)
      setDeleteId(null)
      setToast({ message: 'Team member removed', type: 'success' })
      load()
    } catch {
      setToast({ message: 'Could not delete — please try again', type: 'error' })
    }
    setTimeout(() => setToast(null), 3000)
  }

  const orgColor: Record<string, string> = {
    'UJ': 'bg-blue-50 text-blue-700',
    'ARO': 'bg-greenlight text-forest',
    'KU Leuven': 'bg-ink text-white',
    'Other': 'bg-surface text-muted',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <SectionHead
          title="Team Members"
          description="Researchers, designers, and community members in the network"
        />
        <Link to="/cms/team/new">
          <Btn><Plus size={15} /> Add team member</Btn>
        </Link>
      </div>

      {loading ? (
        <div className="font-body text-sm text-slate animate-pulse">Loading…</div>
      ) : items.length === 0 ? (
        <EmptyState
          message="No team members yet."
          action={<Link to="/cms/team/new"><Btn><Plus size={15} /> Add the first one</Btn></Link>}
        />
      ) : (
        <div className="space-y-2">
          {items.map(item => (
            <Card key={item.id} className="p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="font-body font-semibold text-sm text-ink mb-0.5">
                  {item.name}
                </div>
                <div className="font-body text-xs text-slate">{item.role} · {item.faculty}</div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`font-body text-xs font-semibold px-2.5 py-0.5 rounded-full ${orgColor[item.organisation] ?? orgColor['Other']}`}>
                  {item.organisation}
                </span>
                <StatusBadge published={item.published ?? true} />
                <Link to={`/cms/team/${item.id}`}>
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
        title="Remove this team member?"
        message="They will be removed from the team section on the About page."
        confirmLabel="Remove"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}

// ── Team form ──────────────────────────────────────────────────────────────
export function TeamFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = !id || id === 'new'

  const [form, setForm] = useState({
    name: '', role: '', faculty: '', organisation: 'UJ',
    bio: '', email: '', imageBase64: null as string | null, order: 99,
    published: true,
  })
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!isNew && id) {
      getDocument<any>('team', id).then(doc => {
        if (doc) setForm({
          name:         doc.name ?? '',
          role:         doc.role ?? '',
          faculty:      doc.faculty ?? '',
          organisation: doc.organisation ?? 'UJ',
          bio:          doc.bio ?? '',
          email:        doc.email ?? '',
          imageBase64:  doc.imageBase64 ?? null,
          order:        doc.order ?? 99,
          published:    doc.published ?? true,
        })
        setLoading(false)
      })
    }
  }, [id])

  function set(key: string, value: any) {
    setForm(f => ({ ...f, [key]: value }))
    setErrors(e => ({ ...e, [key]: '' }))
  }

  function validate() {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.role.trim()) errs.role = 'Role is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSave() {
    if (!validate()) return
    setSaving(true)
    try {
      const data = {
        name:         form.name.trim(),
        role:         form.role.trim(),
        faculty:      form.faculty,
        organisation: form.organisation,
        bio:          form.bio.trim(),
        email:        form.email.trim() || null,
        imageBase64:  form.imageBase64,
        order:        Number(form.order),
        published:    form.published,
      }
      if (isNew) await createDocument('team', data)
      else await updateDocument('team', id!, data)
      setToast({ message: isNew ? 'Team member added!' : 'Changes saved!', type: 'success' })
      setTimeout(() => navigate('/cms/team'), 1500)
    } catch {
      setToast({ message: 'Could not save — please try again', type: 'error' })
      setSaving(false)
    }
  }

  if (loading) return <div className="font-body text-sm text-slate animate-pulse p-8">Loading…</div>

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link to="/cms/team">
          <Btn variant="ghost" size="sm"><ArrowLeft size={14} /> Team</Btn>
        </Link>
        <h1 className="font-body font-bold text-xl text-ink">
          {isNew ? 'Add team member' : 'Edit team member'}
        </h1>
      </div>

      <div className="space-y-5">
        <Card className="p-5 space-y-4">
          <h2 className="font-body font-semibold text-sm text-ink border-b border-border pb-3">
            Basic information
          </h2>
          <Field label="Full name" required error={errors.name}>
            <Input value={form.name} onChange={e => set('name', e.target.value)}
              placeholder="e.g. Prof Melanie Samson" />
          </Field>
          <Field label="Role in the network" required error={errors.role}
            hint="e.g. Lead Principal Investigator, Co-Investigator, WP8 Leader">
            <Input value={form.role} onChange={e => set('role', e.target.value)}
              placeholder="Co-Investigator" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Organisation">
              <Select value={form.organisation} onChange={e => set('organisation', e.target.value)}>
                {ORG_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </Select>
            </Field>
            <Field label="Display order" hint="Lower numbers appear first">
              <Input type="number" value={form.order}
                onChange={e => set('order', parseInt(e.target.value) || 99)} />
            </Field>
          </div>
          <Field label="Faculty / Department">
            <Select value={form.faculty} onChange={e => set('faculty', e.target.value)}>
              <option value="">— Select faculty —</option>
              {FACULTY_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
            </Select>
          </Field>
          <Field label="Email address" hint="Optional — shown on the team card if provided">
            <Input type="email" value={form.email} onChange={e => set('email', e.target.value)}
              placeholder="m.samson@uj.ac.za" />
          </Field>
        </Card>

        <Card className="p-5 space-y-4">
          <h2 className="font-body font-semibold text-sm text-ink border-b border-border pb-3">
            Photo & bio
          </h2>
          <ImageUpload
            label="Portrait photo"
            value={form.imageBase64}
            onChange={v => set('imageBase64', v)}
            hint="Square portrait, clear face. Will be displayed as a circle."
          />
          <Field label="Short bio" hint="2–3 sentences. Appears on the About page team section.">
            <Textarea rows={3} value={form.bio} onChange={e => set('bio', e.target.value)}
              placeholder="Prof Samson is a sociologist specialising in waste picker rights…" />
          </Field>
        </Card>

        <Card className="p-5">
          <h2 className="font-body font-semibold text-sm text-ink border-b border-border pb-3 mb-4">
            Visibility
          </h2>
          <Toggle
            checked={form.published}
            onChange={v => set('published', v)}
            label={form.published ? 'Visible on the About page' : 'Hidden — not shown on site'}
            description="Turn off to hide this person without deleting them"
          />
        </Card>

        <div className="flex gap-3">
          <Btn onClick={handleSave} loading={saving}>
            {isNew ? 'Add team member' : 'Save changes'}
          </Btn>
          <Link to="/cms/team"><Btn variant="ghost">Cancel</Btn></Link>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}
