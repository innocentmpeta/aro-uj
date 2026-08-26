import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Save, X, ArrowUp, ArrowDown } from 'lucide-react'
import { getCollection, createDocument, updateDocument, deleteDocument } from '../lib/firebase'
import { ImageUpload } from '../components/ui/ImageUpload'
import {
  Btn, Card, Field, Input, Toggle,
  SectionHead, ConfirmDialog, Toast, EmptyState, StatusBadge
} from '../components/ui'

interface Partner {
  id: string
  name: string
  url: string
  type: string
  logoUrl: string | null
  order: number
  published: boolean
}

const EMPTY_FORM = { name: '', url: '', type: '', logoUrl: null as string | null }

export default function PartnersPage() {
  const [items, setItems]         = useState<Partner[]>([])
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
    getCollection<Partner>('partners').then(data => {
      setItems(data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)))
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [])

  function startEdit(item: Partner) {
    setEditingId(item.id)
    setForm({ name: item.name, url: item.url, type: item.type, logoUrl: item.logoUrl ?? null })
    setShowNew(false)
  }

  function cancelEdit() {
    setEditingId(null)
    setShowNew(false)
    setForm(EMPTY_FORM)
  }

  async function handleSave() {
    if (!form.name.trim()) {
      showToast('Partner name is required', 'error')
      return
    }
    setSaving(true)
    try {
      if (editingId) {
        await updateDocument('partners', editingId, {
          name: form.name.trim(), url: form.url.trim(), type: form.type.trim(), logoUrl: form.logoUrl,
        })
        showToast('Partner updated', 'success')
      } else {
        await createDocument('partners', {
          name: form.name.trim(), url: form.url.trim(), type: form.type.trim(), logoUrl: form.logoUrl,
          order: items.length,
        })
        showToast('Partner added — remember to publish it', 'success')
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
      await deleteDocument('partners', deleteId)
      setDeleteId(null)
      showToast('Partner removed', 'success')
      load()
    } catch {
      showToast('Could not delete — please try again', 'error')
    }
  }

  async function togglePublished(item: Partner) {
    await updateDocument('partners', item.id, { published: !item.published })
    load()
  }

  async function move(item: Partner, direction: -1 | 1) {
    const idx = items.findIndex(i => i.id === item.id)
    const swapWith = items[idx + direction]
    if (!swapWith) return
    await Promise.all([
      updateDocument('partners', item.id, { order: swapWith.order }),
      updateDocument('partners', swapWith.id, { order: item.order }),
    ])
    load()
  }

  function PartnerForm() {
    return (
      <div className="bg-surface rounded-xl border border-border p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Organisation name" required>
            <Input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. SERI"
              autoFocus
            />
          </Field>
          <Field label="Website URL">
            <Input
              value={form.url}
              onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
              placeholder="https://…"
            />
          </Field>
        </div>
        <Field label="Role / description" hint="Shown under the organisation name, e.g. 'Research & legal partner'">
          <Input
            value={form.type}
            onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
            placeholder="e.g. Lead partner — co-director of the network"
          />
        </Field>
        <ImageUpload
          value={form.logoUrl}
          onChange={url => setForm(f => ({ ...f, logoUrl: url }))}
          label="Logo (optional)"
        />
        <div className="flex gap-2 justify-end">
          <Btn variant="ghost" size="sm" onClick={cancelEdit}>
            <X size={13} /> Cancel
          </Btn>
          <Btn variant="primary" size="sm" loading={saving} onClick={handleSave}>
            <Save size={13} /> {editingId ? 'Save changes' : 'Add partner'}
          </Btn>
        </div>
      </div>
    )
  }

  return (
    <div>
      <SectionHead
        title="Partners & Funders"
        description="Manage the organisations shown in the About page's 'Partners & funders' grid."
      />

      {!showNew && !editingId && (
        <div className="mb-6">
          <Btn variant="primary" onClick={() => { setShowNew(true); setForm(EMPTY_FORM) }}>
            <Plus size={14} /> Add partner
          </Btn>
        </div>
      )}

      {showNew && !editingId && (
        <div className="mb-6"><PartnerForm /></div>
      )}

      {loading && <p className="font-body text-sm text-muted">Loading…</p>}

      {!loading && items.length === 0 && !showNew && (
        <EmptyState
          message="No partners added yet."
          action={<Btn variant="primary" onClick={() => setShowNew(true)}><Plus size={14} /> Add first partner</Btn>}
        />
      )}

      <Card className="overflow-hidden">
        <div className="divide-y divide-border">
          {items.map((item, idx) => (
            <div key={item.id}>
              {editingId === item.id ? (
                <div className="px-5 py-4"><PartnerForm /></div>
              ) : (
                <div className="px-5 py-3.5 flex items-center gap-3">
                  <div className="flex flex-col shrink-0">
                    <button onClick={() => move(item, -1)} disabled={idx === 0}
                      className="text-slate/30 hover:text-ink disabled:opacity-20"><ArrowUp size={12} /></button>
                    <button onClick={() => move(item, 1)} disabled={idx === items.length - 1}
                      className="text-slate/30 hover:text-ink disabled:opacity-20"><ArrowDown size={12} /></button>
                  </div>
                  {item.logoUrl && (
                    <img src={item.logoUrl} alt="" className="w-8 h-8 rounded object-contain shrink-0 border border-border" />
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="font-body text-sm text-ink">{item.name}</span>
                    <p className="font-body text-xs text-muted truncate">{item.type}</p>
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
        title="Remove partner?"
        message="This will remove the organisation from the Partners & funders grid."
        confirmLabel="Remove"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}
