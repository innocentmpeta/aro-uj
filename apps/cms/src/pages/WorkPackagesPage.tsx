import { useEffect, useState } from 'react'
import { Pencil, Save, X, ChevronDown, ChevronUp } from 'lucide-react'
import { getCollection, setDocument } from '../lib/firebase'
import { Btn, Card, SectionHead, Toast, Field, Input, Textarea } from '../components/ui'

// ── Canonical WP definitions (code + default title/summary) ───────────────
const WP_DEFAULTS = [
  { id: 'wp1',  code: 'WP1',  leader: 'Humanities',
    title: 'Multi-Faculty Community Engagement & Coordination',
    summary: 'Overall project management, stakeholder oversight, and coordination of activities across all participating UJ faculties and ARO.' },
  { id: 'wp2',  code: 'WP2',  leader: 'Humanities',
    title: 'Strengthening ARO Public Engagement',
    summary: 'Multi-disciplinary research and multi-media interventions to improve resident support for reclaimers and reclaimer-led separation at source.' },
  { id: 'wp3',  code: 'WP3',  leader: 'TBC',
    title: 'ARO-UJ Youth Camp',
    summary: 'An annual winter camp providing reclaimers\' children with multi-disciplinary educational activities and access to UJ.' },
  { id: 'wp4',  code: 'WP4',  leader: 'FEBE',
    title: 'Professionalising ARO Warehouse & Service Provision',
    summary: 'Coordinating UJ faculty support to improve ARO Recycling Company\'s warehouse management, logistics, and business operations.' },
  { id: 'wp5',  code: 'WP5',  leader: 'Humanities',
    title: 'Landfill Closures & a Just Transition',
    summary: 'Supporting ARO\'s campaign to negotiate social plans and retrenchment packages for reclaimers ahead of Johannesburg landfill closures.' },
  { id: 'wp6',  code: 'WP6',  leader: 'FADA',
    title: 'Alternative Employment for Reclaimers',
    summary: 'Developing new income-generation programmes, cooperatives, and companies — including sewing, e-waste recycling, and eco-product design.' },
  { id: 'wp7',  code: 'WP7',  leader: 'FEBE',
    title: 'Advancing Sustainable Development at UJ',
    summary: 'Integrating reclaimers into UJ\'s waste management system and supporting green procurement policy reform.' },
  { id: 'wp8',  code: 'WP8',  leader: 'Humanities',
    title: 'Advancing Reclaimer Health & Wellbeing',
    summary: 'Participatory research and community-led interventions to address health risks, psychosocial wellbeing, and gender equality among reclaimers.' },
  { id: 'wp9',  code: 'WP9',  leader: 'Law',
    title: 'Justice for Migrant Reclaimers',
    summary: 'Research and advocacy to strengthen ARO\'s support for migrant reclaimers seeking legal status, social protection, and employment rights.' },
  { id: 'wp10', code: 'WP10', leader: 'Humanities',
    title: 'Gender Justice & Reclaiming',
    summary: 'Creating spaces for ARO members to engage on gender issues in the sector and developing feminist strategies to promote gender justice.' },
]

interface WPData {
  id: string
  code: string
  title: string
  summary: string
  leader: string
}

interface EditState {
  title: string
  summary: string
  leader: string
}

export default function WorkPackagesPage() {
  const [wpData, setWpData] = useState<Record<string, WPData>>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<EditState>({ title: '', summary: '', leader: '' })
  const [saving, setSaving] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  function showToast(message: string, type: 'success' | 'error') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    getCollection<WPData>('workPackages').then(docs => {
      const map: Record<string, WPData> = {}
      docs.forEach(d => { map[d.id] = d })
      setWpData(map)
    })
  }, [])

  function getDisplayData(def: typeof WP_DEFAULTS[0]): WPData {
    return wpData[def.id]
      ? { ...def, ...wpData[def.id] }
      : { ...def }
  }

  function startEdit(def: typeof WP_DEFAULTS[0]) {
    const d = getDisplayData(def)
    setEditingId(def.id)
    setEditForm({ title: d.title, summary: d.summary, leader: d.leader })
    setExpandedId(def.id)
  }

  function cancelEdit() {
    setEditingId(null)
  }

  async function saveEdit(id: string, code: string) {
    setSaving(true)
    try {
      const payload: WPData = { id, code, ...editForm }
      await setDocument('workPackages', id, payload)
      setWpData(prev => ({ ...prev, [id]: payload }))
      setEditingId(null)
      showToast('Work package updated', 'success')
    } catch {
      showToast('Could not save — please try again', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <SectionHead
        title="Work Packages"
        description="Edit the title, summary, and WP leader shown on the home page work packages grid. Changes are live immediately."
      />

      <div className="space-y-3">
        {WP_DEFAULTS.map(def => {
          const d = getDisplayData(def)
          const isEditing  = editingId === def.id
          const isExpanded = expandedId === def.id

          return (
            <Card key={def.id} className="overflow-hidden">
              {/* Header row */}
              <div
                className="px-5 py-4 flex items-center gap-4 cursor-pointer select-none"
                onClick={() => !isEditing && setExpandedId(isExpanded ? null : def.id)}
              >
                {/* Code badge */}
                <span className="font-body text-[10px] font-bold tracking-widest uppercase
                                 text-forest bg-green-50 border border-green-200
                                 px-2.5 py-1 rounded-full shrink-0 w-12 text-center">
                  {def.code}
                </span>

                {/* Title */}
                <div className="flex-1 min-w-0">
                  <div className="font-body font-semibold text-sm text-ink truncate">{d.title}</div>
                  <div className="font-body text-xs text-slate/50 mt-0.5">Led by {d.leader}</div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {!isEditing && (
                    <Btn variant="ghost" size="sm"
                      onClick={e => { e.stopPropagation(); startEdit(def) }}>
                      <Pencil size={13} /> Edit
                    </Btn>
                  )}
                  <div className="text-slate/30">
                    {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </div>
                </div>
              </div>

              {/* Expanded body */}
              {isExpanded && (
                <div className="px-5 pb-5 border-t border-border pt-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <Field label="Title">
                        <Input
                          value={editForm.title}
                          onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                          placeholder="Work package title"
                        />
                      </Field>
                      <Field label="WP Leader / Faculty">
                        <Input
                          value={editForm.leader}
                          onChange={e => setEditForm(f => ({ ...f, leader: e.target.value }))}
                          placeholder="e.g. Humanities"
                        />
                      </Field>
                      <Field label="Summary (shown on home page cards)">
                        <Textarea
                          value={editForm.summary}
                          onChange={e => setEditForm(f => ({ ...f, summary: e.target.value }))}
                          placeholder="Brief description of this work package (2–3 sentences)"
                          rows={3}
                        />
                      </Field>
                      <div className="flex gap-3 justify-end pt-1">
                        <Btn variant="ghost" onClick={cancelEdit}>
                          <X size={13} /> Cancel
                        </Btn>
                        <Btn variant="primary" onClick={() => saveEdit(def.id, def.code)} disabled={saving}>
                          <Save size={13} /> {saving ? 'Saving…' : 'Save'}
                        </Btn>
                      </div>
                    </div>
                  ) : (
                    <p className="font-body text-sm text-slate leading-relaxed">{d.summary}</p>
                  )}
                </div>
              )}
            </Card>
          )
        })}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}
