/**
 * FIRESTORE SEED SCRIPT
 * ─────────────────────
 * Pushes all mock data into Firestore ONE TIME.
 * Run from the repo root:
 *
 *   node apps/web/src/data/seed.mjs
 *
 * Prerequisites:
 *   1. Create apps/web/.env.local with your Firebase config
 *   2. npm install (already done)
 *
 * After running:
 *   - Check Firebase Console to confirm data arrived
 *   - Update image paths and YouTube links via the CMS
 *   - Delete this file once seeding is complete
 */

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// ── Load .env.local manually (no dotenv needed) ────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = join(__dirname, '../../.env.local')

let envVars = {}
try {
  const envContent = readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach(line => {
    const [key, ...rest] = line.split('=')
    if (key && rest.length) {
      envVars[key.trim()] = rest.join('=').trim()
    }
  })         
} catch {
  console.error('❌ Could not read apps/web/.env.local')
  console.error('   Make sure your Firebase config is in that file.')
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
  console.error('❌ Firebase projectId is missing. Check your .env.local file.')
  process.exit(1)
}

const app = initializeApp(firebaseConfig)
const db  = getFirestore(app)

// ── Timestamps ─────────────────────────────────────────────────────────────
const NOW = new Date().toISOString()

// ── Helper ─────────────────────────────────────────────────────────────────
async function seed(collectionName, documents) {
  console.log(`\n📂 Seeding ${collectionName} (${documents.length} items)…`)
  for (const doc_data of documents) {
    const { id, ...data } = doc_data
    await setDoc(doc(db, collectionName, id), {
      ...data,
      createdAt: NOW,
      updatedAt: NOW,
    })
    console.log(`   ✓ ${id}`)
  }
}

// ══════════════════════════════════════════════════════════════════════════
// DATA
// ══════════════════════════════════════════════════════════════════════════

const PROGRAMMES = [
  { id: 'wp1',  slug: 'network-coordination',    name: 'Network Coordination & Community Engagement',   wpReference: 'WP1',  wpLeader: 'Humanities',                          supportedBy: ['All UJ faculties', 'KU Leuven'], themes: ['knowledge-education'],                         pillars: ['research', 'teaching', 'capacity-building'],                          sdgs: [17, 11], status: 'active', published: true, summary: 'Overall coordination of the ARO-UJ Reclaiming Praxis Network — establishing formal partnerships, strategic planning, curriculum integration, and monitoring across all work packages.', body: '<p>WP1 provides the connective tissue of the network.</p>', objective: 'Develop and implement a multi-disciplinary framework that integrates community engagement into academic teaching, research, and publication activities at UJ.', startDate: 'August 2024', endDate: 'July 2027' },
  { id: 'wp2',  slug: 'aro-public-engagement',   name: 'Strengthening ARO Public Engagement',           wpReference: 'WP2',  wpLeader: 'Humanities',                          supportedBy: ['FADA', 'Science', 'CBE'],        themes: ['knowledge-education', 'rights-justice'],       pillars: ['research', 'teaching', 'capacity-building'],                          sdgs: [10, 11, 17], status: 'active', published: true, summary: 'Research on resident perceptions of reclaimers and development of multi-media materials to transform how residents understand and relate to the reclaimers who serve their communities.', body: '<p>WP2 includes multi-disciplinary research on how to improve resident support for reclaimers.</p>', objective: 'Strengthen ARO public engagement and public support for reclaimers and reclaimer-led separation at source.', startDate: 'August 2024', endDate: 'July 2027' },
  { id: 'wp3',  slug: 'aro-uj-youth-camp',       name: 'ARO-UJ Youth Camp',                             wpReference: 'WP3',  wpLeader: 'TBC',                                 supportedBy: ['FADA', 'Humanities'],            themes: ['knowledge-education', 'health-wellbeing'],     pillars: ['teaching', 'capacity-building'],                                      sdgs: [1, 5, 10], status: 'active', published: true, summary: 'An annual winter camp for children of reclaimers — providing safe, stimulating educational activities and opening access to the university for a community that is systematically excluded from higher education.', body: '<p>The ARO-UJ Youth Camp runs during the winter school break each year.</p>', objective: 'Provide fun, safe, multi-faceted educational activities for reclaimers\' children and open access to the university to them.', startDate: 'February 2025', endDate: 'July 2027' },
  { id: 'wp4',  slug: 'aro-warehouse',            name: 'Professionalising the ARO Warehouse',           wpReference: 'WP4',  wpLeader: 'Engineering & Built Environment (FEBE)', supportedBy: ['FADA', 'Humanities', 'KU Leuven'], themes: ['design-environment', 'economic-justice'],   pillars: ['innovative-solutions', 'capacity-building'],                          sdgs: [8, 9, 11, 12], status: 'active', published: true, summary: 'A multi-faculty effort to professionalise the management of ARO\'s sorting warehouse — improving layout, logistics, signage, e-waste recycling systems, and assessing 4IR technologies to improve efficiency and safety.', body: '<p>Several UJ faculties are providing assistance to professionalise the management of the warehouse.</p>', objective: 'To improve reclaimers\' access to recyclables, incomes and working conditions, recycling rates, and reclaimers\' relationships with residents.', startDate: 'September 2024', endDate: 'July 2027' },
  { id: 'wp5',  slug: 'landfill-just-transition', name: 'Landfill Closures & a Just Transition',         wpReference: 'WP5',  wpLeader: 'Humanities',                          supportedBy: ['Law', 'FADA', 'FEBE'],           themes: ['rights-justice', 'economic-justice'],          pillars: ['research', 'policy', 'capacity-building'],                            sdgs: [1, 8, 10, 11], status: 'active', published: true, summary: 'All of Johannesburg\'s landfills are scheduled to close within five years. This programme supports ARO in developing a campaign to negotiate social plans and retrenchment packages for landfill reclaimers.', body: '<p>WP5 works with ARO to develop a campaign strategy and support advocacy for fair social plans.</p>', objective: 'Support ARO in the development and implementation of a campaign to negotiate social plans and retrenchment packages for landfill reclaimers.', startDate: 'August 2024', endDate: 'July 2027' },
  { id: 'wp6',  slug: 'alternative-employment',   name: 'Alternative Employment & Livelihoods',          wpReference: 'WP6',  wpLeader: 'FADA',                                supportedBy: ['FEBE', 'KU Leuven'],             themes: ['economic-justice', 'design-environment'],      pillars: ['innovative-solutions', 'capacity-building'],                          sdgs: [1, 8, 9, 12], status: 'active', published: true, summary: 'Developing new income streams and cooperatives for reclaimers facing displacement — including textile recycling, e-waste refurbishment, eco-bricks, 3D printing from waste plastics, and other circular economy enterprises.', body: '<p>WP6 works with ARO to develop alternative income generation programmes and cooperatives.</p>', objective: 'Assessing new employment opportunities and developing alternative income generation programs, cooperatives, and companies to diversify and enhance the livelihoods of reclaimers.', startDate: 'August 2024', endDate: 'July 2027' },
  { id: 'wp7',  slug: 'uj-sustainability',        name: 'Advancing Sustainability at UJ',                wpReference: 'WP7',  wpLeader: 'Engineering & Built Environment (FEBE)', supportedBy: ['Science', 'Humanities'],         themes: ['design-environment', 'economic-justice'],      pillars: ['research', 'policy', 'innovative-solutions'],                         sdgs: [11, 12, 13], status: 'active', published: true, summary: 'UJ generates significant recyclable waste daily. This programme integrates reclaimers into UJ\'s campus waste management system — measuring impact, developing procurement guidelines, and creating a replicable model for other institutions.', body: '<p>A pilot programme showed a dramatic increase in recyclables diverted during the pilot period.</p>', objective: 'Support the development of sustainable, green procurement policy at UJ to integrate reclaimers into UJ operations.', startDate: 'June 2023', endDate: 'July 2025' },
  { id: 'wp8',  slug: 'reclaimer-health-wellbeing', name: 'Advancing Reclaimer Health & Wellbeing',     wpReference: 'WP8',  wpLeader: 'Humanities',                          supportedBy: ['FADA', 'Health Sciences', 'KU Leuven'], themes: ['health-wellbeing', 'rights-justice'],      pillars: ['research', 'capacity-building', 'innovative-solutions'],              sdgs: [3, 5, 10], status: 'active', published: true, summary: 'Participatory research to understand and address the health and psychosocial needs of reclaimers — including occupational health risks, mental health support, peer counselling, and gender-sensitive wellbeing interventions.', body: '<p>WP8 begins with participatory research co-designed with reclaimers to understand their health and wellbeing needs.</p>', objective: 'Support gender equality, reclaimer health and well-being.', startDate: 'September 2024', endDate: 'July 2027' },
  { id: 'wp9',  slug: 'migrant-reclaimer-justice', name: 'Justice for Migrant Reclaimers',              wpReference: 'WP9',  wpLeader: 'Law',                                 supportedBy: ['Humanities'],                    themes: ['rights-justice'],                              pillars: ['research', 'policy', 'capacity-building'],                            sdgs: [1, 5, 10], status: 'active', published: true, summary: 'A significant proportion of Johannesburg reclaimers are from Lesotho, Zimbabwe, and other countries. This programme researches the legal challenges they face and advocates for pathways to formalise their status.', body: '<p>WP9 conducts research on legal options, engages government on relevant migrant conventions, and supports rights awareness campaigns.</p>', objective: 'Strengthen ARO\'s existing initiatives to assist migrant reclaimers in gaining status in the country.', startDate: 'September 2024', endDate: 'July 2027' },
  { id: 'wp10', slug: 'gender-justice',            name: 'Gender Justice & Reclaiming',                  wpReference: 'WP10', wpLeader: 'Humanities',                          supportedBy: ['Law'],                           themes: ['rights-justice', 'health-wellbeing'],          pillars: ['research', 'policy', 'capacity-building'],                            sdgs: [5, 10], status: 'active', published: true, summary: 'Gender divisions of labour exist in the reclaiming sector. This programme creates space for ARO members to identify gender issues and incorporate feminist perspectives into ARO\'s organising.', body: '<p>WP10 provides a space for ARO members to reflect on gender issues in the sector.</p>', objective: 'Promote the achievement of gender justice in the reclaiming and recycling sectors and within ARO.', startDate: 'January 2025', endDate: 'July 2027' },
]

const PROJECTS = [
  { id: 'p-bekezela',         slug: 'bekezela-portrait-series',          programmeId: 'wp2',  title: 'Bekezela — Documenting Reclaimer Lives',                       themes: ['knowledge-education', 'rights-justice'], pillars: ['teaching', 'research'], sdgs: [10, 11], years: '2022–2023', challenge: 'Reclaimers\' stories and faces were largely invisible in public discourse, contributing to stigma and exclusion.', collaboration: 'FADA students and photographer Mark Lewis worked with ARO members over six months to produce a portrait series. Reclaimers had full control over their own representation.', outcome: 'The Bekezela book was published and launched publicly. Images are now used in ARO\'s advocacy.', outputType: ['Education', 'Advocacy'], collaborators: 'ARO members, FADA Visual Arts students, photographer Mark Lewis, Prof Kim Berman', imagePath: '/images/projects/bekezela.jpg', videoId: 'pVRCRAvJxeI', documentPath: null, relatedPublicationIds: [], featured: false, published: true },
  { id: 'p-whatsapp',         slug: 'whatsapp-video-series',             programmeId: 'wp2',  title: 'WhatsApp Video Series for Residents',                          themes: ['knowledge-education'], pillars: ['teaching', 'capacity-building'], sdgs: [11, 12], years: '2024–2025', challenge: 'Residents in many Johannesburg suburbs have limited understanding of what reclaimers do and why separation at source matters.', collaboration: 'Humanities and FADA students co-developed short video content with ARO members, designed specifically for WhatsApp distribution to resident associations.', outcome: 'A series of short educational videos distributed to resident associations across Johannesburg suburbs.', outputType: ['Education', 'Advocacy'], collaborators: 'ARO communications team, Humanities students, FADA Multimedia students, Prof Anthony Ambala', imagePath: '/images/projects/whatsapp-videos.jpg', videoId: null, documentPath: null, relatedPublicationIds: [], featured: false, published: true },
  { id: 'p-youth-camp',       slug: 'aro-uj-winter-camp-2025',           programmeId: 'wp3',  title: 'ARO-UJ Winter Camp 2025',                                      themes: ['knowledge-education', 'health-wellbeing'], pillars: ['teaching', 'capacity-building'], sdgs: [1, 5, 10], years: '2025', challenge: 'Children of reclaimers face significant barriers to education and have limited access to enriching extra-curricular activities or university spaces.', collaboration: 'UJ students and staff from FADA and Humanities planned and delivered a three-day winter camp on the UJ campus.', outcome: 'First ARO-UJ Youth Camp delivered, with 40 children of reclaimers participating. A camp video was produced and shared.', outputType: ['Education', 'Advocacy'], collaborators: 'ARO families, FADA students, Humanities students, ARO-UJ camp planning team', imagePath: '/images/projects/youth-camp.jpg', videoId: null, documentPath: null, relatedPublicationIds: [], featured: false, published: true },
  { id: 'p-solar',            slug: 'solar-heating-cooling-selby',       programmeId: 'wp4',  title: 'Solar Heating & Cooling — Selby Sorting Depot',                themes: ['design-environment', 'health-wellbeing'], pillars: ['innovative-solutions', 'research'], sdgs: [8, 9, 11], years: '2023–2024', challenge: 'Reclaimers at the Selby sorting depot worked without adequate shelter or power, exposed to extreme heat in summer and cold in winter.', collaboration: 'Engineering students from UJ worked alongside ARO Selby depot reclaimers across two semesters. Reclaimers specified what they needed — not what engineers assumed they needed.', outcome: 'Solar system installed and operational. Reclaimer productivity increased an estimated 30% in the first season. Three reclaimers trained as the on-site maintenance team.', outputType: ['Infrastructure', 'Design'], collaborators: 'ARO Selby depot reclaimers, UJ FEBE engineering students, Ms Nickey Janse van Rensburg (PEETS)', imagePath: '/images/projects/solar-depot.jpg', videoId: 'Ud3OGS9AWOQ', documentPath: null, relatedPublicationIds: [], featured: true, published: true },
  { id: 'p-warehouse-design', slug: 'warehouse-signage-ewaste',          programmeId: 'wp4',  title: 'Warehouse Signage & E-Waste Recycling Room',                   themes: ['design-environment', 'economic-justice'], pillars: ['innovative-solutions', 'teaching'], sdgs: [8, 9, 12], years: '2023–2024', challenge: 'ARO\'s new warehouse lacked professional signage and a functional e-waste processing area, limiting both safety and efficiency.', collaboration: 'FADA Industrial Design students designed comprehensive signage and the e-waste recycling room layout, with ARO staff providing operational requirements at every stage.', outcome: 'Warehouse signage installed. E-waste room designed and operationalised. ARO Recycling Company operations improved.', outputType: ['Design', 'Infrastructure'], collaborators: 'ARO Recycling Company staff, FADA Industrial Design students, Dr Martin Bolton, Dr Radhika Mia', imagePath: '/images/projects/warehouse-design.jpg', videoId: null, documentPath: null, relatedPublicationIds: [], featured: false, published: true },
  { id: 'p-landfill-workshops', slug: 'landfill-reclaimer-needs-workshops', programmeId: 'wp5', title: 'Landfill Reclaimer Needs Workshops',                        themes: ['rights-justice', 'economic-justice'], pillars: ['research', 'capacity-building'], sdgs: [1, 8, 10], years: '2024–2025', challenge: 'Johannesburg\'s landfills are scheduled to close within 3–5 years. Landfill reclaimers have had no formal voice in planning for this transition.', collaboration: 'Humanities researchers facilitated a series of workshops with landfill reclaimers and the ARO organising team to identify key issues and begin developing a campaign strategy.', outcome: 'Workshop reports completed. Campaign strategy under development. Landfill reclaimers\' needs formally documented for the first time.', outputType: ['Research', 'Policy'], collaborators: 'ARO landfill reclaimer members, ARO organising team, Humanities researchers, Prof Melanie Samson', imagePath: '/images/projects/landfill-workshops.jpg', videoId: null, documentPath: null, relatedPublicationIds: [], featured: false, published: true },
  { id: 'p-ewaste',           slug: 'ewaste-refurbishment-training',     programmeId: 'wp6',  title: 'E-Waste Recycling & Appliance Refurbishment Training',          themes: ['economic-justice', 'design-environment'], pillars: ['capacity-building', 'innovative-solutions'], sdgs: [8, 9, 12], years: '2023–2024', challenge: 'E-waste is a growing and valuable stream that reclaimers are largely excluded from due to lack of skills and equipment.', collaboration: 'UJ PEETS trained reclaimers in e-waste recycling techniques and appliance refurbishment, developing a business case for a reclaimer-run e-waste enterprise.', outcome: 'Cohort of reclaimers trained in e-waste handling and appliance refurbishment. Business model developed for a reclaimer-run e-waste recycling operation.', outputType: ['Training', 'Research'], collaborators: 'ARO members, UJ PEETS, Ms Nickey Janse van Rensburg', imagePath: '/images/projects/ewaste-training.jpg', videoId: null, documentPath: null, relatedPublicationIds: [], featured: false, published: true },
  { id: 'p-textiles',         slug: 'textile-recycling-sewing',          programmeId: 'wp6',  title: 'Textile Recycling & Sewing Skills Programme',                  themes: ['economic-justice', 'design-environment'], pillars: ['capacity-building', 'innovative-solutions'], sdgs: [1, 5, 8, 12], years: '2023–2025', challenge: 'Textile waste is a significant and growing problem, and reclaimers — many of whom are women — have skills and interest in working with fabric materials.', collaboration: 'FADA Fashion students designed training materials and curricula for a sewing and textile recycling skills programme, delivered to a group of ARO women members.', outcome: 'Training programme developed and delivered. New products created from textile waste including clothing items and sewn products.', outputType: ['Training', 'Design'], collaborators: 'ARO women members, FADA Fashion students, Dr Khaya Mchunu', imagePath: '/images/projects/textiles.jpg', videoId: null, documentPath: null, relatedPublicationIds: [], featured: false, published: true },
  { id: 'p-uj-campus',        slug: 'uj-campus-recycling-pilot',         programmeId: 'wp7',  title: 'Integrating Reclaimers into UJ Campus Waste Management',       themes: ['design-environment', 'economic-justice'], pillars: ['research', 'policy', 'innovative-solutions'], sdgs: [11, 12, 13], years: '2023–2025', challenge: 'UJ generates significant recyclable waste daily, but reclaimers were not formally integrated into campus waste management.', collaboration: 'UJ PEETS designed and ran a three-month pilot integrating reclaimers into UJ\'s waste management system, measuring recyclables diverted and evaluating the operational model.', outcome: 'Recyclables diverted increased from 2,730kg (4 months pre-pilot) to 7,034kg (2 months during pilot). Procurement guidelines in development.', outputType: ['Research', 'Policy'], collaborators: 'ARO reclaimers, UJ PEETS, UJ Facilities Management, Ms Nickey Janse van Rensburg, Dr Thea Schoeman', imagePath: '/images/projects/uj-campus.jpg', videoId: null, documentPath: null, relatedPublicationIds: [], featured: false, published: true },
  { id: 'p-health-research',  slug: 'participatory-health-research',     programmeId: 'wp8',  title: 'Participatory Health Needs Research',                          themes: ['health-wellbeing', 'rights-justice'], pillars: ['research', 'capacity-building'], sdgs: [3, 5, 10], years: '2024–2025', challenge: 'The specific health risks and psychosocial needs of reclaimers are poorly understood and largely unaddressed by health services.', collaboration: 'A health and wellbeing steering committee co-designed participatory research with reclaimers, academics, and postgraduate students.', outcome: 'Research findings co-analysed with reclaimers. Intervention design underway. Peer-reviewed publication in preparation.', outputType: ['Research'], collaborators: 'ARO members, Health Sciences faculty, Humanities researchers, Prof Brendon Barnes, Mrs Shalin Bidassey-Manilal, Dr Thokozani Mbonane', imagePath: '/images/projects/health-research.jpg', videoId: null, documentPath: null, relatedPublicationIds: [], featured: false, published: true },
  { id: 'p-legal-clinic',     slug: 'uif-legal-clinic',                  programmeId: 'wp9',  title: 'UIF Registration & Claims Legal Clinic',                       themes: ['rights-justice', 'economic-justice'], pillars: ['capacity-building', 'research'], sdgs: [1, 8, 10], years: '2023', challenge: 'Reclaimers at ARO\'s Selby depot were entitled to UIF contributions but faced bureaucratic barriers to registration and claims.', collaboration: 'UJ Law students ran a series of clinics at ARO\'s depot, working directly with reclaimers to complete UIF registrations and prepare documentation for appeals.', outcome: '40 reclaimers successfully registered for UIF. 12 completed first-time claims totalling over R85,000 in payments.', outputType: ['Legal'], collaborators: 'ARO Selby depot reclaimers, UJ Law students, Prof ES Fourie', imagePath: '/images/projects/legal-clinic.jpg', videoId: null, documentPath: null, relatedPublicationIds: [], featured: false, published: true },
  { id: 'p-gender-workshops', slug: 'gender-justice-workshops',          programmeId: 'wp10', title: 'Gender Justice Workshops with ARO',                            themes: ['rights-justice', 'health-wellbeing'], pillars: ['research', 'capacity-building'], sdgs: [5, 10], years: '2025', challenge: 'Gender divisions of labour exist in the reclaiming sector but are rarely named or addressed within reclaimer organisations.', collaboration: 'Humanities researchers facilitated a series of workshops with ARO members and organisers to identify gender issues in the sector.', outcome: 'Workshop reports produced. Research agenda developed. Opinion piece in preparation.', outputType: ['Research', 'Advocacy'], collaborators: 'ARO members and organising team, Humanities researchers, Law faculty', imagePath: '/images/projects/gender-workshops.jpg', videoId: null, documentPath: null, relatedPublicationIds: [], featured: false, published: true },
]

const NEWS = [
  { id: 'n1', slug: 'landfill-just-transition-campaign',  title: 'ARO launches just transition campaign as Johannesburg landfills face closure',              excerpt: 'With all of Johannesburg\'s landfills scheduled to close within five years, ARO and the Praxis Network have launched a campaign to negotiate fair social plans and retrenchment packages for the thousands of reclaimers who depend on landfill work.', body: '<p>Full article coming soon.</p>', imagePath: '/images/news/landfill-campaign.jpg', videoId: null, themes: ['rights-justice', 'economic-justice'], published: true },
  { id: 'n2', slug: 'plastics-treaty-geneva-2025',        title: 'ARO at the Global Plastics Treaty negotiations — ensuring reclaimers have a seat at the table', excerpt: 'ARO representatives participated in the latest round of international negotiations on a global plastics treaty, continuing to ensure that the informal waste workers who handle the majority of plastic recycling in the Global South are not designed out of the solution.', body: '<p>Full article coming soon.</p>', imagePath: '/images/news/plastics-treaty.jpg', videoId: null, themes: ['rights-justice', 'design-environment'], published: true },
  { id: 'n3', slug: 'youth-camp-2025',                    title: 'The first ARO-UJ Youth Camp: 40 reclaimers\' children come to university',                   excerpt: 'For three days in July, the children of ARO members took over part of the UJ campus — making art from recyclables, painting murals, and producing their own videos. A report from the first ARO-UJ Winter Camp.', body: '<p>Full article coming soon.</p>', imagePath: '/images/news/youth-camp.jpg', videoId: null, themes: ['knowledge-education', 'health-wellbeing'], published: true },
]

const SITE_CONFIG = {
  impactStats: {
    yearFounded: 2022,
    facultiesInvolved: 7,
    projectsCompleted: 24,
    publicationsCount: 18,
    studentParticipants: 142,
    reclaimersInvolved: 380,
    externalFundingRaised: 'R2 million+',
  },
  sections: {
    home_hero: true, home_stats: true, home_about: true, home_themes: true,
    home_story: true, home_quote: true, home_projects: true, home_news: true, home_join: true,
    reclaimers_stats: true, reclaimers_what: true, reclaimers_challenges: true,
    reclaimers_quote: true, reclaimers_aro: true,
    praxis_cycle: true, praxis_story: true,
    about_aim: true, about_pillars: true, about_sdgs: true, about_principles: true,
    about_team: true, about_kuleuven: true, about_partners: true,
    practicum_who: true, practicum_how: true, practicum_past: true, practicum_ethics: true,
  },
  siteSettings: {
    heroHeadline: '',
    heroSubheading: '',
    contactEmail: 'praxis@uj.ac.za',
  },
}

// ══════════════════════════════════════════════════════════════════════════
// RUN SEED
// ══════════════════════════════════════════════════════════════════════════

async function main() {
  console.log(`\n🌱 Seeding Firestore project: ${firebaseConfig.projectId}`)
  console.log('─'.repeat(50))

  await seed('programmes', PROGRAMMES)
  await seed('projects',   PROJECTS)
  await seed('news',       NEWS)

  // siteConfig — these are singleton documents
  console.log('\n📂 Seeding siteConfig…')
  for (const [docId, data] of Object.entries(SITE_CONFIG)) {
    await setDoc(doc(db, 'siteConfig', docId), { ...data, updatedAt: NOW })
    console.log(`   ✓ ${docId}`)
  }

  console.log('\n✅ Seed complete!')
  console.log('\nNext steps:')
  console.log('  1. Check Firebase Console to confirm all data arrived')
  console.log('  2. Open the CMS (localhost:3001) and update image paths')
  console.log('  3. Replace YouTube video IDs with real ARO-UJ videos when available')
  console.log('  4. Delete this seed file once you\'re done with it')
  console.log('')
  process.exit(0)
}

main().catch(err => {
  console.error('\n❌ Seed failed:', err.message)
  process.exit(1)
})
