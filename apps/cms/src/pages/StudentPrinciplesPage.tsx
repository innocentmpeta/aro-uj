import { useEffect, useState } from 'react'
import {
  Plus, Pencil, Trash2, Save, X, ArrowUp, ArrowDown,
  ShieldCheck, Users, Link2, Ban, Scale, BookOpen, Heart, Lightbulb,
} from 'lucide-react'
import { getCollection, createDocument, updateDocument, deleteDocument } from '../lib/firebase'
import {
  Btn, Card, Field, Input, Textarea, Select, Toggle,
  SectionHead, ConfirmDialog, Toast, EmptyState, StatusBadge
} from '../components/ui'

// Fixed icon set — must match the identical map in
// apps/web/src/pages/StudentPracticumPage.tsx (icon names are stored as strings)
export const PRINCIPLE_ICONS: Record<string, React.ElementType> = {
  ShieldCheck, Users, Link2, Ban, Scale, BookOpen, Heart, Lightbulb,
}

interface Principle {
  id: string
  heading: string
  body: string
  icon: string
  order: number
  published: boolean
}

const EMPTY_FORM = { heading: '', body: '', icon: Object.keys(PRINCIPLE_ICONS)[0] }

export default function StudentPrinciplesPage() {
  const [items, setItems]         = useState<Principle[]>([])
  const [loading, setLoading]     = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showNew, setShowNew]     = useState(false)
  const [form, setForm]           = useState(EMPTY_FORM)
  const [deleteId, setDeleteId]   = useState<string | null>(null)
  const [saving, setSaving]       = useState(false)
  const [toast, setToast]         = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  function showToast(message: string, type: 'success' | 'error') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  function load() {
    getCollection<Principle>('studentPrinciples').then(data => {
      setItems(data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)))
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [])

  function startEdit(item: Principle) {
    setEditingId(item.id)
    setForm({ heading: item.heading, body: item.body, icon: item.icon })
    setShowNew(false)
  }

  function cancelEdit() {
    setEditingId(null)
    setShowNew(false)
    setForm(EMPTY_FORM)
  }

  async function handleSave() {
    if (!form.heading.trim() || !form.body.trim()) {
      showToast('Heading and description are required', 'error')
      return
    }
    setSaving(true)
    try {
      if (editingId) {
        await updateDocument('studentPrinciples', editingId, {
          heading: form.heading.trim(), body: form.body.trim(), icon: form.icon,
        })
        showToast('Principle updated', 'success')
      } else {
        await createDocument('studentPrinciples', {
          heading: form.heading.trim(), body: form.body.trim(), icon: form.icon,
          order: items.length,
        })
        showToast('Principle added — remember to publish it', 'success')
      }
      cancelEdit()
      load()
    } catch {
      showToast('Could not save — please try again', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    try {
      await deleteDocument('studentPrinciples', deleteId)
      setDeleteId(null)
      showToast('Principle removed', 'success')
      load()
    } catch {
      showToast('Could not delete — please try again', 'error')
    }
  }

  async function togglePublished(item: Principle) {
    await updateDocument('studentPrinciples', item.id, { published: !item.published })
    load()
  }

  async function move(item: Principle, direction: -1 | 1) {
    const idx = items.findIndex(i => i.id === item.id)
    const swapWith = items[idx + direction]
    if (!swapWith) return
    await Promise.all([
      updateDocument('studentPrinciples', item.id, { order: swapWith.order }),
      updateDocument('studentPrinciples', swapWith.id, { order: item.order }),
    ])
    load()
  }

  function PrincipleForm() {
    return (
      <div className="bg-surface rounded-xl border border-border p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Heading" required>
            <Input
              value={form.heading}
              onChange={e => setForm(f => ({ ...f, heading: e.target.value }))}
              placeholder="e.g. Informed consent"
              autoFocus
            />
          </Field>
          <Field label="Icon">
            <Select value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}>
              {Object.keys(PRINCIPLE_ICONS).map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </Select>
          </Field>
        </div>
        <Field label="Description" required>
          <Textarea
            rows={3}
            value={form.body}
            onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
            placeholder="One or two sentences explaining this principle."
          />
        </Field>
        <div className="flex gap-2 justify-end">
          <Btn variant="ghost" size="sm" onClick={cancelEdit}>
            <X size={13} /> Cancel
          </Btn>
          <Btn variant="primary" size="sm" loading={saving} onClick={handleSave}>
            <Save size={13} /> {editingId ? 'Save changes' : 'Add principle'}
          </Btn>
        </div>
      </div>
    )
  }

  return (
    <div>
      <SectionHead
        title="Student Research Principles"
        description="Manage the principle cards shown on the Student Research page. Add as many as you need."
      />

      {!showNew && !editingId && (
        <div className="mb-6">
          <Btn variant="primary" onClick={() => { setShowNew(true); setForm(EMPTY_FORM) }}>
            <Plus size={14} /> Add principle
          </Btn>
        </div>
      )}

      {showNew && !editingId && (
        <div className="mb-6"><PrincipleForm /></div>
      )}

      {loading && <p className="font-body text-sm text-muted">Loading…</p>}

      {!loading && items.length === 0 && !showNew && (
        <EmptyState
          message="No principles added yet."
          action={<Btn variant="primary" onClick={() => setShowNew(true)}><Plus size={14} /> Add first principle</Btn>}
        />
      )}

      <Card className="overflow-hidden">
        <div className="divide-y divide-border">
          {items.map((item, idx) => {
            const Icon = PRINCIPLE_ICONS[item.icon] ?? ShieldCheck
            return (
              <div key={item.id}>
                {editingId === item.id ? (
                  <div className="px-5 py-4"><PrincipleForm /></div>
                ) : (
                  <div className="px-5 py-3.5 flex items-center gap-3">
                    <div className="flex flex-col shrink-0">
                      <button onClick={() => move(item, -1)} disabled={idx === 0}
                        className="text-slate/30 hover:text-ink disabled:opacity-20"><ArrowUp size={12} /></button>
                      <button onClick={() => move(item, 1)} disabled={idx === items.length - 1}
                        className="text-slate/30 hover:text-ink disabled:opacity-20"><ArrowDown size={12} /></button>
                    </div>
                    <div className="p-1.5 bg-greenlight rounded-lg shrink-0">
                      <Icon size={16} className="text-forest" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-body text-sm text-ink">{item.heading}</span>
                      <p className="font-body text-xs text-muted truncate">{item.body}</p>
                    </div>
                    <StatusBadge published={item.published} />
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Toggle size="sm" checked={item.published} onChange={() => togglePublished(item)} />
                      <Btn variant="ghost" size="sm" onClick={() => startEdit(item)}>
                        <Pencil size={12} /> Edit
                      </Btn>
                      <Btn variant="ghost" size="sm" onClick={() => setDeleteId(item.id)}>
                        <Trash2 size={12} className="text-red-400" />
                      </Btn>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Card>

      <ConfirmDialog
        open={!!deleteId}
        title="Remove principle?"
        message="This will remove the principle card from the Student Research page."
        confirmLabel="Remove"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}
