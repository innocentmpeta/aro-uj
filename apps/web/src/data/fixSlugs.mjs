/**
 * FIX SLUGS SCRIPT
 * ─────────────────
 * Checks all projects in Firestore and adds/fixes the slug field
 * where it is missing or empty.
 *
 * Run from the repo root:
 *   node apps/web/src/data/fixSlugs.mjs
 *
 * Safe to run multiple times — only updates documents that need it.
 */

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath   = join(__dirname, '../../.env.local')

let envVars = {}
try {
  readFileSync(envPath, 'utf-8').split('\n').forEach(line => {
    const [key, ...rest] = line.split('=')
    if (key && rest.length) envVars[key.trim()] = rest.join('=').trim()
  })
} catch {
  console.error('❌ Could not read apps/web/.env.local')
  process.exit(1)
}

const app = initializeApp({
  apiKey:            envVars['VITE_FIREBASE_API_KEY'],
  authDomain:        envVars['VITE_FIREBASE_AUTH_DOMAIN'],
  projectId:         envVars['VITE_FIREBASE_PROJECT_ID'],
  storageBucket:     envVars['VITE_FIREBASE_STORAGE_BUCKET'],
  messagingSenderId: envVars['VITE_FIREBASE_MESSAGING_SENDER_ID'],
  appId:             envVars['VITE_FIREBASE_APP_ID'],
})
const db = getFirestore(app)

function makeSlug(title) {
  return title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

async function fixCollection(collectionName) {
  console.log(`\n📂 Checking ${collectionName}…`)
  const snap = await getDocs(collection(db, collectionName))
  let fixed = 0, ok = 0

  for (const docSnap of snap.docs) {
    const data = docSnap.data()
    const slug = data.slug

    if (!slug || slug.trim() === '') {
      // Generate slug from title
      const newSlug = makeSlug(data.title ?? docSnap.id)
      await updateDoc(doc(db, collectionName, docSnap.id), { slug: newSlug })
      console.log(`   ✓ Fixed: "${data.title}" → slug: "${newSlug}"`)
      fixed++
    } else {
      ok++
    }
  }

  console.log(`   ${ok} already had slugs · ${fixed} fixed`)
}

async function main() {
  console.log('\n🔧 Fixing slugs in Firestore…')
  await fixCollection('projects')
  await fixCollection('news')
  console.log('\n✅ Done! Refresh your browser to see the fix.')
  process.exit(0)
}

main().catch(err => {
  console.error('\n❌ Failed:', err.message)
  process.exit(1)
})
