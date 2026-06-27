import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Save, X, GripVertical } from 'lucide-react'
import { getCollection, createDocument, updateDocument, deleteDocument } from '../lib/firebase'
import {
  Btn, Card, Field, Input, Select,
  SectionHead, ConfirmDialog, Toast, EmptyState
} from '../components/ui'

// ── UJ faculties (fixed list — departments belong to these) ───────────────
const UJ_FACULTIES = [
  'Humanities',
  'Art, Design & Architecture (FADA)',
  'Engineering & Built Environment (FEBE)',
  'Science',
  'Health Sciences',
  'College of Business & Economics (CBE)',
  'Law',
  'Education',
]

interface Department {
  id: string
  name: string
  faculty: string
  acronym: string
  published: boolean
  createdAt?: any
}

const EMPTY_FORM = { name: '', faculty: '', acronym: '' }

export default function FacultiesPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading]         = useState(true)
  const [editingId, setEditingId]     = useState<string | null>(null)
  const [showNew, setShowNew]         = useState(false)
  const [form, setForm]               = useState(EMPTY_FORM)
  const [deleteId, setDeleteId]       = useState<string | null>(null)
  const [saving, setSaving]           = useState(false)
  const [toast, setToast]             = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [filterFaculty, setFilterFaculty] = useState<string>('all')

  function showToast(message: string, type: 'success' | 'error') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  function load() {
    getCollection<Department>('departments').then(data => {
      setDepartments(data.sort((a, b) => {
        if (a.faculty < b.faculty) return -1
        if (a.faculty > b.faculty) return 1
        return a.name.localeCompare(b.name)
      }))
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [])

  function startEdit(dept: Department) {
    setEditingId(dept.id)
    setForm({ name: dept.name, faculty: dept.faculty, acronym: dept.acronym })
    setShowNew(false)
  }

  function cancelEdit() {
    setEditingId(null)
    setShowNew(false)
    setForm(EMPTY_FORM)
  }

  async function handleSave() {
    if (!form.name.trim() || !form.faculty) {
      showToast('Department name and faculty are required', 'error')
      return
    }
    setSaving(true)
    try {
      if (editingId) {
        await updateDocument('departments', editingId, {
          name: form.name.trim(),
          faculty: form.faculty,
          acronym: form.acronym.trim(),
          published: true,
        })
        showToast('Department updated', 'success')
      } else {
        await createDocument('departments', {
          name: form.name.trim(),
          faculty: form.faculty,
          acronym: form.acronym.trim(),
        })
        showToast('Department added', 'success')
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
      await deleteDocument('departments', deleteId)
      setDeleteId(null)
      showToast('Department removed', 'success')
      load()
    } catch {
      showToast('Could not delete — please try again', 'error')
    }
  }

  // Group by faculty for display
  const faculties = UJ_FACULTIES.filter(f =>
    filterFaculty === 'all' || f === filterFaculty
  )
  const displayed = filterFaculty === 'all'
    ? departments
    : departments.filter(d => d.faculty === filterFaculty)

  const grouped = faculties.reduce<Record<string, Department[]>>((acc, f) => {
    acc[f] = displayed.filter(d => d.faculty === f)
    return acc
  }, {})

  // Inline form component
  function DeptForm() {
    return (
      <div className="bg-surface rounded-xl border border-border p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="Department name" required>
            <Input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Sociology"
              autoFocus
            />
          </Field>
          <Field label="Faculty" required>
            <Select
              value={form.faculty}
              onChange={e => setForm(f => ({ ...f, faculty: e.target.value }))}
            >
              <option value="">— Select faculty —</option>
              {UJ_FACULTIES.map(fac => (
                <option key={fac} value={fac}>{fac}</option>
              ))}
            </Select>
          </Field>
          <Field label="Acronym / short name">
            <Input
              value={form.acronym}
              onChange={e => setForm(f => ({ ...f, acronym: e.target.value }))}
              placeholder="e.g. PEETS"
            />
          </Field>
        </div>
        <div className="flex gap-2 justify-end">
          <Btn variant="ghost" size="sm" onClick={cancelEdit}>
            <X size={13} /> Cancel
          </Btn>
          <Btn variant="primary" size="sm" loading={saving} onClick={handleSave}>
            <Save size={13} /> {editingId ? 'Save changes' : 'Add department'}
          </Btn>
        </div>
      </div>
    )
  }

  return (
    <div>
      <SectionHead
        title="Faculties & Departments"
        description="Manage the departments that appear in project forms. Adding a department here makes it available when creating or editing a project."
      />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Select
          className="sm:w-64"
          value={filterFaculty}
          onChange={e => setFilterFaculty(e.target.value)}
        >
          <option value="all">All faculties</option>
          {UJ_FACULTIES.map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </Select>
        {!showNew && !editingId && (
          <Btn variant="primary" onClick={() => { setShowNew(true); setForm(EMPTY_FORM) }}>
            <Plus size={14} /> Add department
          </Btn>
        )}
      </div>

      {/* New department form */}
      {showNew && !editingId && (
        <div className="mb-6">
          <DeptForm />
        </div>
      )}

      {loading && (
        <p className="font-body text-sm text-muted">Loading…</p>
      )}

      {!loading && departments.length === 0 && !showNew && (
        <EmptyState
          message="No departments added yet. Add a department to get started."
          action={
            <Btn variant="primary" onClick={() => setShowNew(true)}>
              <Plus size={14} /> Add first department
            </Btn>
          }
        />
      )}

      {/* Grouped by faculty */}
      <div className="space-y-6">
        {faculties.map(faculty => {
          const depts = grouped[faculty] ?? []
          if (filterFaculty === 'all' && depts.length === 0) return null

          return (
            <Card key={faculty} className="overflow-hidden">
              <div className="px-5 py-3 bg-surface border-b border-border flex items-center justify-between">
                <h2 className="font-body font-semibold text-sm text-ink">{faculty}</h2>
                <span className="font-body text-xs text-muted">
                  {depts.length} department{depts.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="divide-y divide-border">
                {depts.length === 0 ? (
                  <div className="px-5 py-4">
                    <p className="font-body text-xs text-muted/60 italic">
                      No departments listed — add one using the button above.
                    </p>
                  </div>
                ) : (
                  depts.map(dept => (
                    <div key={dept.id}>
                      {editingId === dept.id ? (
                        <div className="px-5 py-4">
                          <DeptForm />
                        </div>
                      ) : (
                        <div className="px-5 py-3.5 flex items-center gap-3">
                          <GripVertical size={14} className="text-slate/20 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <span className="font-body text-sm text-ink">{dept.name}</span>
                            {dept.acronym && (
                              <span className="ml-2 font-body text-xs text-muted bg-surface
                                border border-border px-2 py-0.5 rounded-full">
                                {dept.acronym}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Btn variant="ghost" size="sm" onClick={() => startEdit(dept)}>
                              <Pencil size={12} /> Edit
                            </Btn>
                            <Btn variant="ghost" size="sm" onClick={() => setDeleteId(dept.id)}>
                              <Trash2 size={12} className="text-red-400" />
                            </Btn>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </Card>
          )
        })}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Remove department?"
        message="This will remove the department from the list. Existing projects that reference it won't be affected."
        confirmLabel="Remove"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}
