import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getAuth, Auth } from 'firebase/auth'

// ── Config ─────────────────────────────────────────────────────────────────
// Values are injected via environment variables at build time.
// Web app:  apps/web/.env.local
// CMS app:  apps/cms/.env.local
// Both use the same Firebase project.
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
}

// Prevent duplicate initialisation in monorepo dev mode
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const db: Firestore = getFirestore(app)
export const auth: Auth    = getAuth(app)
export { app }

// ── Collection names — single source of truth ──────────────────────────────
export const COLLECTIONS = {
  projects:          'projects',
  stories:           'stories',
  publications:      'publications',
  news:              'news',
  teachingResources: 'teachingResources',
  team:              'team',
  impactStats:       'siteConfig',   // single doc: "impactStats"
  siteSettings:      'siteConfig',   // single doc: "siteSettings"
} as const
