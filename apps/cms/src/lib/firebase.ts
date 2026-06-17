export { db, auth } from '@arouj/firebase-config'
import {
  collection, doc, getDocs, getDoc, addDoc,
  updateDoc, deleteDoc, setDoc, serverTimestamp
} from 'firebase/firestore'
import { db } from '@arouj/firebase-config'

export async function getCollection<T>(col: string): Promise<(T & { id: string })[]> {
  const snap = await getDocs(collection(db, col))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as T & { id: string }))
}

export async function getDocument<T>(col: string, id: string): Promise<(T & { id: string }) | null> {
  const snap = await getDoc(doc(db, col, id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as T & { id: string }
}

export async function createDocument(col: string, data: object): Promise<string> {
  const ref = await addDoc(collection(db, col), {
    ...data,
    published: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateDocument(col: string, id: string, data: object): Promise<void> {
  await updateDoc(doc(db, col, id), { ...data, updatedAt: serverTimestamp() })
}

export async function deleteDocument(col: string, id: string): Promise<void> {
  await deleteDoc(doc(db, col, id))
}

export async function setDocument(col: string, id: string, data: object): Promise<void> {
  await setDoc(doc(db, col, id), { ...data, updatedAt: serverTimestamp() }, { merge: true })
}

export function generateSlug(title: string): string {
  return title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function extractYouTubeId(url: string): string | null {
  if (!url) return null
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([A-Za-z0-9_-]{11})$/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}
