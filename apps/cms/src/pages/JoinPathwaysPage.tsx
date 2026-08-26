import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Save, X, ArrowUp, ArrowDown } from 'lucide-react'
import { getCollection, createDocument, updateDocument, deleteDocument } from '../lib/firebase'
import {
  Btn, Card, Field, Input, Textarea, Toggle,
  SectionHead, ConfirmDialog, Toast, EmptyState, StatusBadge
} from '../components/ui'

interface Pathway {
  id: string
  audience: string
  heading: string
  body: string
  actionLabel: string
  actionHref: string
  internal: boolean
  order: number
  published: boolean
}

const EMPTY_FORM = { audience: '', heading: '', body: '', actionLabel: '', actionHref: '', internal: false }

export default function JoinPathwaysPage() {
  const [items, setItems]         = useState<Pathway[]>([])
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
    getCollection<Pathway>('joinPathways').then(data => {
      setItems(data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)))
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [])

  function startEdit(item: Pathway) {
    setEditingId(item.id)
    setForm({
      audience: item.audience, heading: item.heading, body: item.body,
      actionLabel: item.actionLabel, actionHref: item.actionHref, internal: item.internal,
    })
    setShowNew(false)
  }

  function cancelEdit() {
    setEditingId(null)
    setShowNew(false)
    setForm(EMPTY_FORM)
  }

  async function handleSave() {
    if (!form.audience.trim() || !form.heading.trim()) {
      showToast('Audience and heading are required', 'error')
      return
    }
    setSaving(true)
    try {
      const payload = {
        audience: form.audience.trim(), heading: form.heading.trim(), body: form.body.trim(),
        actionLabel: form.actionLabel.trim(), actionHref: form.actionHref.trim(), internal: form.internal,
      }
      if (editingId) {
        await updateDocument('joinPathways', editingId, payload)
        showToast('Pathway updated', 'success')
      } else {
        await createDocument('joinPathways', { ...payload, order: items.length })
        showToast('Pathway added — remember to publish it', 'success')
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
      await deleteDocument('joinPathways', deleteId)
      setDeleteId(null)
      showToast('Pathway removed', 'success')
      load()
    } catch {
      showToast('Could not delete — please try again', 'error')
    }
  }

  async function togglePublished(item: Pathway) {
    await updateDocument('joinPathways', item.id, { published: !item.published })
    load()
  }

  async function move(item: Pathway, direction: -1 | 1) {
    const idx = items.findIndex(i => i.id === item.id)
    const swapWith = items[idx + direction]
    if (!swapWith) return
    await Promise.all([
      updateDocument('joinPathways', item.id, { order: swapWith.order }),
      updateDocument('joinPathways', swapWith.id, { order: item.order }),
    ])
    load()
  }

  function PathwayForm() {
    return (
      <div className="bg-surface rounded-xl border border-border p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Audience label" required hint="e.g. 'UJ Students'">
            <Input
              value={form.audience}
              onChange={e => setForm(f => ({ ...f, audience: e.target.value }))}
              placeholder="e.g. UJ Students"
              autoFocus
            />
          </Field>
          <Field label="Heading" required>
            <Input
              value={form.heading}
              onChange={e => setForm(f => ({ ...f, heading: e.target.value }))}
              placeholder="e.g. Participate in the practicum"
            />
          </Field>
        </div>
        <Field label="Description">
          <Textarea
            rows={3}
            value={form.body}
            onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
          />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Button text">
            <Input
              value={form.actionLabel}
              onChange={e => setForm(f => ({ ...f, actionLabel: e.target.value }))}
              placeholder="e.g. Learn about the practicum"
            />
          </Field>
          <Field label="Link" hint="An internal page path (e.g. /student-practicum) or a mailto: link">
            <Input
              value={form.actionHref}
              onChange={e => setForm(f => ({ ...f, actionHref: e.target.value }))}
              placeholder="/student-practicum or mailto:praxis@uj.ac.za"
            />
          </Field>
        </div>
        <Toggle
          size="sm"
          checked={form.internal}
          onChange={val => setForm(f => ({ ...f, internal: val }))}
          label="Internal page link"
          description="On — links within the site (fast navigation). Off — mailto or external link."
        />
        <div className="flex gap-2 justify-end">
          <Btn variant="ghost" size="sm" onClick={cancelEdit}>
            <X size={13} /> Cancel
          </Btn>
          <Btn variant="primary" size="sm" loading={saving} onClick={handleSave}>
            <Save size={13} /> {editingId ? 'Save changes' : 'Add pathway'}
          </Btn>
        </div>
      </div>
    )
  }

  return (
    <div>
      <SectionHead
        title="Join Pathways"
        description="Manage the pathway cards shown on the Join page ('Find your pathway')."
      />

      {!showNew && !editingId && (
        <div className="mb-6">
          <Btn variant="primary" onClick={() => { setShowNew(true); setForm(EMPTY_FORM) }}>
            <Plus size={14} /> Add pathway
          </Btn>
        </div>
      )}

      {showNew && !editingId && (
        <div className="mb-6"><PathwayForm /></div>
      )}

      {loading && <p className="font-body text-sm text-muted">Loading…</p>}

      {!loading && items.length === 0 && !showNew && (
        <EmptyState
          message="No pathways added yet."
          action={<Btn variant="primary" onClick={() => setShowNew(true)}><Plus size={14} /> Add first pathway</Btn>}
        />
      )}

      <Card className="overflow-hidden">
        <div className="divide-y divide-border">
          {items.map((item, idx) => (
            <div key={item.id}>
              {editingId === item.id ? (
                <div className="px-5 py-4"><PathwayForm /></div>
              ) : (
                <div className="px-5 py-3.5 flex items-center gap-3">
                  <div className="flex flex-col shrink-0">
                    <button onClick={() => move(item, -1)} disabled={idx === 0}
                      className="text-slate/30 hover:text-ink disabled:opacity-20"><ArrowUp size={12} /></button>
                    <button onClick={() => move(item, 1)} disabled={idx === items.length - 1}
                      className="text-slate/30 hover:text-ink disabled:opacity-20"><ArrowDown size={12} /></button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-body text-xs font-semibold uppercase tracking-wide text-forest">{item.audience}</span>
                    <p className="font-body text-sm text-ink truncate">{item.heading}</p>
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
          ))}
        </div>
      </Card>

      <ConfirmDialog
        open={!!deleteId}
        title="Remove pathway?"
        message="This will remove the pathway card from the Join page."
        confirmLabel="Remove"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}
