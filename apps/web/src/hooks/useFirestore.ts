import { useState, useEffect } from 'react'
import {
  collection, doc, onSnapshot, query,
  where, Query, DocumentReference
} from 'firebase/firestore'
import { db } from '@arouj/firebase-config'

// ── Generic collection hook ────────────────────────────────────────────────
export function useCollection<T>(
  collectionName: string,
  options: { publishedOnly?: boolean } = {}
) {
  const { publishedOnly = true } = options
  const [data, setData]       = useState<(T & { id: string })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    let q: Query = collection(db, collectionName) as Query
    if (publishedOnly) {
      q = query(q, where('published', '==', true))
    }
    const unsub = onSnapshot(
      q,
      snap => {
        setData(snap.docs.map(d => ({ id: d.id, ...d.data() } as T & { id: string })))
        setLoading(false)
      },
      err => {
        console.error(`Firestore error (${collectionName}):`, err.message)
        setError(err.message)
        setLoading(false)
      }
    )
    return unsub
  }, [collectionName, publishedOnly])

  return { data, loading, error }
}

// ── Generic document hook ──────────────────────────────────────────────────
export function useDocument<T>(collectionName: string, docId: string) {
  const [data, setData]       = useState<(T & { id: string }) | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ref = doc(db, collectionName, docId) as DocumentReference
    const unsub = onSnapshot(ref, snap => {
      setData(snap.exists() ? { id: snap.id, ...snap.data() } as T & { id: string } : null)
      setLoading(false)
    }, err => {
      console.error(`Firestore doc error (${collectionName}/${docId}):`, err.message)
      setLoading(false)
    })
    return unsub
  }, [collectionName, docId])

  return { data, loading }
}

// ── Section toggles ────────────────────────────────────────────────────────
export function useSectionToggles(): { sections: Record<string, boolean>; loading: boolean } {
  const { data, loading } = useDocument<Record<string, boolean>>('siteConfig', 'sections')
  return { sections: data ?? {}, loading }
}

// ── Impact stats ───────────────────────────────────────────────────────────
export function useImpactStats() {
  return useDocument<{
    yearFounded: number
    facultiesInvolved: number
    projectsCompleted: number
    publicationsCount: number
    studentParticipants: number
    reclaimersInvolved: number
    externalFundingRaised: string
  }>('siteConfig', 'impactStats')
}

// ── Site settings ──────────────────────────────────────────────────────────
export function useSiteSettings() {
  return useDocument<{
    heroHeadline: string
    heroSubheading: string
    contactEmail: string
  }>('siteConfig', 'siteSettings')
}

// ── Featured project — waits for data before returning ────────────────────
export function useFeaturedProject() {
  const { data: all, loading } = useCollection<any>('projects', { publishedOnly: true })
  // Only look for featured once we have data
  const featured = loading ? null : (all.find((p: any) => p.featured) ?? all[0] ?? null)
  return { data: featured, loading }
}

// ── Projects by programme ──────────────────────────────────────────────────
export function useProjectsByProgramme(programmeId: string) {
  const [data, setData]       = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!programmeId) { setLoading(false); return }
    const q = query(
      collection(db, 'projects'),
      where('published', '==', true),
      where('programmeId', '==', programmeId)
    )
    const unsub = onSnapshot(q, snap => {
      setData(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    }, err => {
      console.error('useProjectsByProgramme:', err.message)
      setLoading(false)
    })
    return unsub
  }, [programmeId])

  return { data, loading }
}

// ── Work packages ──────────────────────────────────────────────────────────
export interface WorkPackage {
  id: string          // wp1 … wp10
  code: string        // 'WP1'
  title: string
  summary: string
  leader: string
  faculties: string[]
  startDate: string
  endDate: string
  published: boolean
}

export function useWorkPackages() {
  return useCollection<WorkPackage>('workPackages', { publishedOnly: false })
}

// ── Page content blocks (middle-ground CMS editability) ───────────────────
// Each page stores its editable text in siteConfig/{pageId}
// Structure: { [blockKey]: string }
// Falls back to the supplied default if Firestore has no value yet.

export function usePageContent(pageId: string) {
  return useDocument<Record<string, string>>('siteConfig', pageId)
}
