/**
 * TEAM MEMBERS SEED SCRIPT
 * ─────────────────────────
 * Pushes the hardcoded team members into Firestore ONE TIME.
 * Run from the repo root:
 *
 *   node apps/web/src/data/seedTeam.mjs
 *
 * After running:
 *   - Check the CMS Team Members section to confirm they arrived
 *   - Edit names, roles, photos via the CMS
 *   - Delete anyone who is no longer in the network
 *   - Delete this file once done
 */

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// ── Load .env.local ────────────────────────────────────────────────────────
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

const firebaseConfig = {
  apiKey:            envVars['VITE_FIREBASE_API_KEY'],
  authDomain:        envVars['VITE_FIREBASE_AUTH_DOMAIN'],
  projectId:         envVars['VITE_FIREBASE_PROJECT_ID'],
  storageBucket:     envVars['VITE_FIREBASE_STORAGE_BUCKET'],
  messagingSenderId: envVars['VITE_FIREBASE_MESSAGING_SENDER_ID'],
  appId:             envVars['VITE_FIREBASE_APP_ID'],
}

if (!firebaseConfig.projectId) {
  console.error('❌ Firebase projectId missing. Check your .env.local file.')
  process.exit(1)
}

const app = initializeApp(firebaseConfig)
const db  = getFirestore(app)
const NOW = new Date().toISOString()

// ── Team members (matching the static TEAM array in AboutPage.tsx) ─────────
const TEAM = [
  {
    id: 'tm-melanie-samson',
    name: 'Prof Melanie Samson',
    role: 'Lead Principal Investigator',
    faculty: 'Humanities — Sociology',
    organisation: 'UJ',
    bio: 'Prof Samson is a sociologist specialising in waste picker rights, informal labour, and urban governance. She leads the ARO-UJ Reclaiming Praxis Network.',
    email: null,
    imagePath: '/images/team/melanie-samson.jpg',
    order: 1,
    published: true,
  },
  {
    id: 'tm-aro-director',
    name: 'ARO Co-Director',
    role: 'Network Co-Director',
    faculty: 'African Reclaimers Organisation',
    organisation: 'ARO',
    bio: 'The ARO Co-Director represents the African Reclaimers Organisation in the network leadership, ensuring reclaimer priorities drive all programme decisions.',
    email: null,
    imagePath: null,
    order: 2,
    published: true,
  },
  {
    id: 'tm-brendon-barnes',
    name: 'Prof Brendon Barnes',
    role: 'Co-Investigator',
    faculty: 'Humanities — Psychology',
    organisation: 'UJ',
    bio: 'Prof Barnes leads the health and wellbeing research strand, focusing on participatory approaches to understanding reclaimer psychosocial needs.',
    email: null,
    imagePath: '/images/team/brendon-barnes.jpg',
    order: 3,
    published: true,
  },
  {
    id: 'tm-es-fourie',
    name: 'Prof ES Fourie',
    role: 'WP9 Leader',
    faculty: 'Law — Public Law',
    organisation: 'UJ',
    bio: 'Prof Fourie leads the justice for migrant reclaimers programme, researching legal pathways and advocating for reclaimer rights within immigration frameworks.',
    email: null,
    imagePath: null,
    order: 4,
    published: true,
  },
  {
    id: 'tm-martin-bolton',
    name: 'Dr Martin Bolton',
    role: 'Co-Investigator',
    faculty: 'FADA — Industrial Design',
    organisation: 'UJ',
    bio: 'Dr Bolton leads industrial design projects with reclaimers, including warehouse signage, e-waste room design, and sorting infrastructure improvements.',
    email: null,
    imagePath: null,
    order: 5,
    published: true,
  },
  {
    id: 'tm-radhika-mia',
    name: 'Dr Radhika Mia',
    role: 'Co-Investigator',
    faculty: 'FADA — Industrial Design',
    organisation: 'UJ',
    bio: 'Dr Mia leads participatory design projects with ARO, focusing on how design practice can be decolonised through genuine community co-creation.',
    email: null,
    imagePath: null,
    order: 6,
    published: true,
  },
  {
    id: 'tm-khaya-mchunu',
    name: 'Dr Khaya Mchunu',
    role: 'Co-Investigator',
    faculty: 'FADA — Fashion',
    organisation: 'UJ',
    bio: 'Dr Mchunu leads the textile recycling and sewing skills programme, working with ARO women members to develop new income streams from textile waste.',
    email: null,
    imagePath: null,
    order: 7,
    published: true,
  },
  {
    id: 'tm-kim-berman',
    name: 'Prof Kim Berman',
    role: 'Co-Investigator',
    faculty: 'FADA — Visual Arts',
    organisation: 'UJ',
    bio: 'Prof Berman leads participatory arts and public engagement projects, including the Bekezela portrait series documenting reclaimer lives and identities.',
    email: null,
    imagePath: null,
    order: 8,
    published: true,
  },
  {
    id: 'tm-anthony-ambala',
    name: 'Prof Anthony Ambala',
    role: 'Co-Investigator',
    faculty: 'FADA — Multimedia',
    organisation: 'UJ',
    bio: 'Prof Ambala leads multimedia documentation and communication projects, including the WhatsApp video series for resident education about reclaimers.',
    email: null,
    imagePath: null,
    order: 9,
    published: true,
  },
  {
    id: 'tm-christa-van-zyl',
    name: 'Ms Christa van Zyl',
    role: 'Co-Investigator',
    faculty: 'FADA — Graphic Design',
    organisation: 'UJ',
    bio: 'Ms van Zyl leads graphic design projects with ARO, contributing to public communication materials and visual identity work for the organisation.',
    email: null,
    imagePath: null,
    order: 10,
    published: true,
  },
  {
    id: 'tm-nickey-janse-van-rensburg',
    name: 'Ms Nickey Janse van Rensburg',
    role: 'WP4 & WP7 Leader',
    faculty: 'Engineering & Built Environment — PEETS',
    organisation: 'UJ',
    bio: 'Ms Janse van Rensburg leads the warehouse professionalisation and UJ campus sustainability programmes, including the solar depot installation and campus recycling pilot.',
    email: null,
    imagePath: null,
    order: 11,
    published: true,
  },
  {
    id: 'tm-thea-schoeman',
    name: 'Dr Thea Schoeman',
    role: 'Co-Investigator',
    faculty: 'Science — Geography & Environmental Management',
    organisation: 'UJ',
    bio: 'Dr Schoeman contributes environmental analysis and sustainability expertise, particularly to the UJ campus waste management pilot.',
    email: null,
    imagePath: null,
    order: 12,
    published: true,
  },
  {
    id: 'tm-shalin-bidassey-manilal',
    name: 'Mrs Shalin Bidassey-Manilal',
    role: 'Co-Investigator',
    faculty: 'Health Sciences — Environmental Health',
    organisation: 'UJ',
    bio: 'Mrs Bidassey-Manilal contributes occupational and environmental health expertise to the reclaimer health and wellbeing research programme.',
    email: null,
    imagePath: null,
    order: 13,
    published: true,
  },
  {
    id: 'tm-thokozani-mbonane',
    name: 'Dr Thokozani Mbonane',
    role: 'Co-Investigator',
    faculty: 'Health Sciences — Environmental Health',
    organisation: 'UJ',
    bio: 'Dr Mbonane contributes environmental health research expertise to the participatory health needs study with ARO members.',
    email: null,
    imagePath: null,
    order: 14,
    published: true,
  },
  {
    id: 'tm-marinda-pretorius',
    name: 'Dr Marinda Pretorius',
    role: 'Co-Investigator',
    faculty: 'College of Business & Economics — Economics',
    organisation: 'UJ',
    bio: 'Dr Pretorius contributes economic analysis to the network, particularly around the viability of reclaimer cooperatives and alternative livelihood enterprises.',
    email: null,
    imagePath: null,
    order: 15,
    published: true,
  },
  {
    id: 'tm-julie-metta-versmessen',
    name: 'Dr Julie Metta-Versmessen',
    role: 'International Partner',
    faculty: 'KU Leuven — HIVA Research Institute',
    organisation: 'KU Leuven',
    bio: 'Dr Metta-Versmessen is the lead KU Leuven partner, bringing expertise in circular economy impacts on labour markets through projects including MICHELLE and Pop-Machina.',
    email: null,
    imagePath: null,
    order: 16,
    published: true,
  },
]

// ── Run ────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n🌱 Seeding team members into: ${firebaseConfig.projectId}`)
  console.log(`   ${TEAM.length} members to seed`)
  console.log('─'.repeat(50))

  for (const member of TEAM) {
    const { id, ...data } = member
    await setDoc(doc(db, 'team', id), {
      ...data,
      createdAt: NOW,
      updatedAt: NOW,
    })
    console.log(`   ✓ ${member.name}`)
  }

  console.log('\n✅ Team members seeded!')
  console.log('\nNext steps:')
  console.log('  1. Open the CMS → Team Members to see all 16 members')
  console.log('  2. Edit each member to add the correct photo path')
  console.log('  3. Update bios, emails, or roles as needed')
  console.log('  4. Delete members who are no longer in the network')
  console.log('  5. Delete this seed file once done')
  console.log('')
  process.exit(0)
}

main().catch(err => {
  console.error('\n❌ Seed failed:', err.message)
  process.exit(1)
})
