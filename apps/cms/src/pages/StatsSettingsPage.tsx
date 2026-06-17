import { useEffect, useState } from 'react'
import { setDocument, getDocument } from '../lib/firebase'
import { Btn, Card, Field, Input, SectionHead, Toast } from '../components/ui'

// ── Impact Stats ───────────────────────────────────────────────────────────
export function StatsPage() {
  const [form, setForm] = useState({
    yearFounded: '2022',
    facultiesInvolved: '7',
    projectsCompleted: '24',
    publicationsCount: '18',
    studentParticipants: '142',
    reclaimersInvolved: '380',
    externalFundingRaised: 'R2 million+',
  })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    getDocument<any>('siteConfig', 'impactStats').then(doc => {
      if (doc) {
        setForm({
          yearFounded: String(doc.yearFounded ?? '2022'),
          facultiesInvolved: String(doc.facultiesInvolved ?? '7'),
          projectsCompleted: String(doc.projectsCompleted ?? '24'),
          publicationsCount: String(doc.publicationsCount ?? '18'),
          studentParticipants: String(doc.studentParticipants ?? '142'),
          reclaimersInvolved: String(doc.reclaimersInvolved ?? '380'),
          externalFundingRaised: doc.externalFundingRaised ?? 'R2 million+',
        })
      }
    })
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      await setDocument('siteConfig', 'impactStats', {
        yearFounded: parseInt(form.yearFounded) || 2022,
        facultiesInvolved: parseInt(form.facultiesInvolved) || 7,
        projectsCompleted: parseInt(form.projectsCompleted) || 0,
        publicationsCount: parseInt(form.publicationsCount) || 0,
        studentParticipants: parseInt(form.studentParticipants) || 0,
        reclaimersInvolved: parseInt(form.reclaimersInvolved) || 0,
        externalFundingRaised: form.externalFundingRaised,
      })
      setToast({ message: 'Numbers updated!', type: 'success' })
    } catch {
      setToast({ message: 'Could not save — please try again', type: 'error' })
    }
    setSaving(false)
    setTimeout(() => setToast(null), 3000)
  }

  const FIELDS = [
    { key: 'yearFounded',         label: 'Year founded',                hint: 'e.g. 2022' },
    { key: 'facultiesInvolved',   label: 'UJ faculties involved',       hint: 'e.g. 7' },
    { key: 'projectsCompleted',   label: 'Projects completed',          hint: 'e.g. 24' },
    { key: 'publicationsCount',   label: 'Research publications',       hint: 'e.g. 18' },
    { key: 'studentParticipants', label: 'Student participants',        hint: 'e.g. 142' },
    { key: 'reclaimersInvolved',  label: 'Reclaimers involved',         hint: 'e.g. 380' },
    { key: 'externalFundingRaised', label: 'External funding raised',   hint: 'e.g. R2 million+' },
  ] as const

  return (
    <div>
      <SectionHead
        title="Homepage Numbers"
        description="These six figures appear in the impact strip on the home page. Keep them current."
      />
      <Card className="p-5 space-y-4 mb-5">
        {FIELDS.map(({ key, label, hint }) => (
          <Field key={key} label={label} hint={hint}>
            <Input
              value={form[key]}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              placeholder={hint}
            />
          </Field>
        ))}
      </Card>
      <Btn onClick={handleSave} loading={saving}>Save numbers</Btn>
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}

// ── Site Settings ──────────────────────────────────────────────────────────
export function SettingsPage() {
  const [form, setForm] = useState({
    heroHeadline: '',
    heroSubheading: '',
    contactEmail: 'praxis@uj.ac.za',
  })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    getDocument<any>('siteConfig', 'siteSettings').then(doc => {
      if (doc) setForm({
        heroHeadline: doc.heroHeadline ?? '',
        heroSubheading: doc.heroSubheading ?? '',
        contactEmail: doc.contactEmail ?? 'praxis@uj.ac.za',
      })
    })
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      await setDocument('siteConfig', 'siteSettings', form)
      setToast({ message: 'Settings saved!', type: 'success' })
    } catch {
      setToast({ message: 'Could not save — please try again', type: 'error' })
    }
    setSaving(false)
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <div>
      <SectionHead title="Site Settings" description="Site-wide text and contact details" />
      <Card className="p-5 space-y-4 mb-5">
        <Field label="Homepage headline"
          hint="The large headline on the home page hero. Leave blank to use the code default.">
          <Input value={form.heroHeadline} onChange={e => setForm(f => ({ ...f, heroHeadline: e.target.value }))}
            placeholder="Where reclaimer knowledge and academic expertise build change together." />
        </Field>
        <Field label="Homepage subheading"
          hint="The sentence below the headline. Leave blank to use the code default.">
          <Input value={form.heroSubheading} onChange={e => setForm(f => ({ ...f, heroSubheading: e.target.value }))}
            placeholder="A partnership between ARO and UJ — working where theory meets the street." />
        </Field>
        <Field label="Contact email address"
          hint="Shown in the footer and on the Join page">
          <Input type="email" value={form.contactEmail}
            onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))}
            placeholder="praxis@uj.ac.za" />
        </Field>
      </Card>
      <Btn onClick={handleSave} loading={saving}>Save settings</Btn>
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}
