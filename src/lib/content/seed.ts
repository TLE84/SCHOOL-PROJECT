import type { Article, Author, CampusEvent, Category, Department } from './types';

/**
 * Placeholder editorial content.
 *
 * The article copy, bylines and quotes here were carried over from the
 * hardcoded JSX they replaced — they are illustrative, not real reporting, and
 * should be swapped for genuine content (and genuine attributions) before this
 * site goes live.
 */

export const authors: Record<string, Author> = {
  maryam: {
    id: 'author-maryam',
    name: 'Maryam Abubakar',
    role: 'Campus Correspondent',
    bio: 'Maryam covers technology, innovation, and academic development stories across the institute.',
    initials: 'MA',
  },
  // An institutional desk rather than a named individual: PTI is led by a
  // Principal and Chief Executive, and official notices are not personal
  // bylines. The post holder is named in reporting, not as an author.
  principal: {
    id: 'author-principal',
    name: 'Office of the Principal and Chief Executive',
    role: 'Institute Leadership',
    bio: 'Official announcements and addresses from the Office of the Principal and Chief Executive.',
    initials: 'PC',
  },
  john: {
    id: 'author-john',
    name: 'John Doe',
    role: 'Research Desk',
    bio: 'John reports on research partnerships and industry collaboration.',
    initials: 'JD',
  },
  jane: {
    id: 'author-jane',
    name: 'Jane Smith',
    role: 'Academics Desk',
    bio: 'Jane follows curriculum, examinations and student affairs.',
    initials: 'JS',
  },
  board: {
    id: 'author-board',
    name: 'Academic Board',
    role: 'Institute Desk',
    bio: 'Official communications from the Academic Board.',
    initials: 'AB',
  },
  alumni: {
    id: 'author-alumni',
    name: 'Alumni Desk',
    role: 'Alumni Relations',
    bio: 'News from the PTI Alumni Association.',
    initials: 'AD',
  },
};

export const categories: Category[] = [
  { id: 'cat-innovation', name: 'Innovation', slug: 'innovation', description: 'New ideas, facilities and ventures emerging from the institute.' },
  { id: 'cat-technology', name: 'Technology', slug: 'technology', description: 'Student projects, competitions and technical achievement.' },
  { id: 'cat-research', name: 'Research', slug: 'research', description: 'Studies, partnerships and technical work led by PTI staff and students.' },
  { id: 'cat-academics', name: 'Academics', slug: 'academics', description: 'Curriculum, examinations, admissions and academic policy.' },
  { id: 'cat-alumni', name: 'Alumni', slug: 'alumni', description: 'News and initiatives from the PTI Alumni Association.' },
  { id: 'cat-sports', name: 'Sports', slug: 'sports', description: 'Fixtures, results and sporting life on campus.' },
  { id: 'cat-announcements', name: 'Announcements', slug: 'announcements', description: 'Official notices from the institute.' },
  { id: 'cat-opinion', name: 'Opinion', slug: 'opinion', description: 'Commentary and perspectives from the PTI community.' },
];

const byCategorySlug = (slug: string): Category => {
  const found = categories.find((category) => category.slug === slug);
  if (!found) throw new Error(`Unknown category slug in seed data: ${slug}`);
  return found;
};

export const departments: Department[] = [
  { id: 'dept-petroleum', name: 'Petroleum Engineering', slug: 'petroleum-engineering', description: 'Drilling, production and reservoir engineering programmes underpinning the institute’s founding mandate.' },
  { id: 'dept-mechanical', name: 'Mechanical Engineering', slug: 'mechanical-engineering', description: 'Design, manufacturing, thermodynamics and plant maintenance across the energy sector.' },
  { id: 'dept-electrical', name: 'Electrical and Electronic Engineering', slug: 'electrical-electronic-engineering', description: 'Power systems, instrumentation and control engineering for industrial operations.' },
  { id: 'dept-chemical', name: 'Chemical Engineering', slug: 'chemical-engineering', description: 'Process engineering, refining and petrochemical operations.' },
  { id: 'dept-welding', name: 'Welding Engineering and Offshore Technology', slug: 'welding-offshore-technology', description: 'Fabrication, inspection and offshore installation practice.' },
  { id: 'dept-marine', name: 'Marine Engineering', slug: 'marine-engineering', description: 'Marine propulsion, vessel systems and offshore logistics.' },
  { id: 'dept-science', name: 'Science Laboratory Technology', slug: 'science-laboratory-technology', description: 'Analytical chemistry, environmental testing and laboratory practice.' },
  { id: 'dept-general', name: 'General Studies', slug: 'general-studies', description: 'Communication, entrepreneurship and the humanities across all programmes.' },
];

export const articles: Article[] = [
  {
    id: 'art-matriculation-2026',
    title: 'PTI Matriculates 2,101 New Students Across Full-Time and SICE Programmes',
    slug: 'pti-matriculates-2101-new-students',
    excerpt:
      'Principal and Chief Executive Dr. Samuel E. Onoji charged the new intake to embrace discipline and tech-driven innovation as the institute formally admitted 2,101 students.',
    content: [
      { type: 'heading', id: 'ceremony', text: '2,101 Students Matriculated' },
      { type: 'paragraph', text: 'The Petroleum Training Institute formally matriculated 2,101 new students at a ceremony held on the main campus, admitting the intake into the institute’s full-time and School of Industrial and Continuing Education (SICE) programmes.' },
      { type: 'heading', id: 'charge', text: 'A Charge to the New Intake' },
      { type: 'paragraph', text: 'Principal and Chief Executive Dr. Samuel E. Onoji charged the matriculating students to embrace discipline and tech-driven innovation throughout their time at the institute.' },
      { type: 'heading', id: 'programmes', text: 'Full-Time and SICE Programmes' },
      { type: 'paragraph', text: 'The cohort spans both the institute’s full-time programmes and those delivered through the School of Industrial and Continuing Education.' },
    ],
    author: authors.maryam,
    category: byCategorySlug('academics'),
    // Placeholder photograph — replace with an image from the ceremony itself.
    featuredImage: '/images/pti_students_lab.jpg',
    tags: [
      { name: 'Matriculation', slug: 'matriculation' },
      { name: 'Students', slug: 'students' },
      { name: 'Academics', slug: 'academics' },
      { name: 'SICE', slug: 'sice' },
    ],
    isFeatured: true,
    publishedAt: '2026-07-24T09:00:00.000Z',
    readingMinutes: 3,
    views: 2380,
  },
  {
    id: 'art-innovation-hub',
    title: 'PTI Unveils New Innovation Hub to Drive Research and Student Entrepreneurship',
    slug: 'pti-unveils-new-innovation-hub',
    excerpt:
      'The hub is designed to equip students with modern tools, mentorship, and industry exposure to transform innovative ideas into real-world solutions.',
    content: [
      { type: 'heading', id: 'overview', text: 'Innovation Hub Overview' },
      { type: 'paragraph', text: 'The Petroleum Training Institute (PTI) has officially launched its state-of-the-art Innovation Hub, a landmark initiative aimed at fostering creativity, research, and entrepreneurship among students and staff.' },
      { type: 'heading', id: 'facilities', text: 'Facilities and Resources' },
      { type: 'paragraph', text: 'The hub, located at the Main Campus, is equipped with modern laboratories, co-working spaces, high-performance computing systems, and advanced prototyping tools.' },
      { type: 'heading', id: 'benefits', text: 'Benefits to Students' },
      { type: 'paragraph', text: 'Students across every department will be able to book bench space, borrow equipment and join structured mentorship cohorts running through each semester.' },
      { type: 'heading', id: 'collaboration', text: 'Industry Collaboration' },
      { type: 'paragraph', text: 'The Innovation Hub will also serve as a bridge between academia and industry, providing opportunities for collaborations, internships, and startups.' },
      { type: 'heading', id: 'future', text: 'Future Plans' },
      { type: 'paragraph', text: 'A second phase is planned to add a dedicated fabrication workshop and an incubation programme for graduating student ventures.' },
    ],
    author: authors.maryam,
    category: byCategorySlug('innovation'),
    departmentSlug: 'petroleum-engineering',
    featuredImage: '/images/pti_innovation_hub.jpg',
    tags: [
      { name: 'Innovation', slug: 'innovation' },
      { name: 'Research', slug: 'research' },
      { name: 'Entrepreneurship', slug: 'entrepreneurship' },
      { name: 'Students', slug: 'students' },
      { name: 'Technology', slug: 'technology' },
    ],
    isFeatured: false,
    publishedAt: '2026-05-15T09:00:00.000Z',
    readingMinutes: 5,
    views: 1200,
  },
  {
    id: 'art-tech-competition',
    title: 'Students Win Big at National Tech Competition',
    slug: 'students-win-tech-competition',
    excerpt:
      "Our top students secured the first place in the national engineering challenge, showcasing PTI's dominance in technical education.",
    content: [
      { type: 'heading', id: 'result', text: 'A National First Place' },
      { type: 'paragraph', text: 'A team drawn from across the engineering departments took first place at this year’s national engineering challenge, beating entries from institutions nationwide.' },
      { type: 'heading', id: 'project', text: 'The Winning Project' },
      { type: 'paragraph', text: 'The team presented a low-cost monitoring rig for detecting pipeline pressure anomalies, built largely from components sourced on campus.' },
      { type: 'heading', id: 'next', text: 'What Comes Next' },
      { type: 'paragraph', text: 'The group will represent the institute at the regional finals later in the year, supported by the Innovation Hub.' },
    ],
    author: authors.maryam,
    category: byCategorySlug('technology'),
    departmentSlug: 'electrical-electronic-engineering',
    featuredImage: '/images/pti_students_lab.jpg',
    tags: [
      { name: 'Technology', slug: 'technology' },
      { name: 'Students', slug: 'students' },
    ],
    isFeatured: false,
    publishedAt: '2026-05-10T09:00:00.000Z',
    readingMinutes: 4,
    views: 860,
  },
  {
    id: 'art-nnpc',
    title: 'PTI and NNPC Partner on Advanced Research Projects',
    slug: 'pti-nnpc-partner',
    excerpt: 'A landmark agreement aimed at solving complex engineering challenges in the oil and gas sector.',
    content: [
      { type: 'heading', id: 'agreement', text: 'The Agreement' },
      { type: 'paragraph', text: 'The partnership sets out a joint research programme covering process optimisation, corrosion management and environmental monitoring.' },
      { type: 'heading', id: 'scope', text: 'Scope of Work' },
      { type: 'paragraph', text: 'Staff and postgraduate students will work alongside industry engineers on projects running across the next three academic sessions.' },
    ],
    author: authors.john,
    category: byCategorySlug('research'),
    departmentSlug: 'chemical-engineering',
    tags: [
      { name: 'Research', slug: 'research' },
      { name: 'Industry', slug: 'industry' },
    ],
    isFeatured: false,
    publishedAt: '2026-05-08T09:00:00.000Z',
    readingMinutes: 4,
    views: 640,
  },
  {
    id: 'art-curriculum',
    title: 'New Curriculum Designed for Emerging Energies',
    slug: 'new-curriculum',
    excerpt: 'The Academic board has approved a revised syllabus integrating renewable energy modules across all departments.',
    content: [
      { type: 'heading', id: 'changes', text: 'What Is Changing' },
      { type: 'paragraph', text: 'Every engineering programme will carry a compulsory module covering renewable generation, storage and grid integration.' },
      { type: 'heading', id: 'rollout', text: 'Rollout Timeline' },
      { type: 'paragraph', text: 'The revised syllabus takes effect from the coming academic session, with existing cohorts transitioning the following year.' },
    ],
    author: authors.board,
    category: byCategorySlug('academics'),
    tags: [
      { name: 'Academics', slug: 'academics' },
      { name: 'Energy', slug: 'energy' },
    ],
    isFeatured: false,
    publishedAt: '2026-05-02T09:00:00.000Z',
    readingMinutes: 3,
    views: 470,
  },
  {
    id: 'art-scholarship',
    title: 'Alumni Association Announces Annual Scholarship Fund',
    slug: 'alumni-scholarship',
    excerpt: 'A 50 million Naira fund has been established to support indigent students with outstanding academic records.',
    content: [
      { type: 'heading', id: 'fund', text: 'About the Fund' },
      { type: 'paragraph', text: 'The fund will cover tuition and accommodation for selected students across all departments, renewable each session subject to academic standing.' },
      { type: 'heading', id: 'apply', text: 'How to Apply' },
      { type: 'paragraph', text: 'Applications open through the student portal, with shortlisting handled by a joint alumni and student affairs committee.' },
    ],
    author: authors.alumni,
    category: byCategorySlug('alumni'),
    tags: [
      { name: 'Alumni', slug: 'alumni' },
      { name: 'Scholarship', slug: 'scholarship' },
    ],
    isFeatured: false,
    publishedAt: '2026-04-28T09:00:00.000Z',
    readingMinutes: 3,
    views: 910,
  },
  {
    id: 'art-lab-upgrade',
    title: 'Welding Laboratory Receives Major Equipment Upgrade',
    slug: 'welding-laboratory-upgrade',
    excerpt: 'New inspection and fabrication equipment expands the range of certifications students can complete on campus.',
    content: [
      { type: 'heading', id: 'equipment', text: 'The New Equipment' },
      { type: 'paragraph', text: 'The upgrade adds ultrasonic testing rigs and additional welding bays, reducing the wait for practical assessment slots.' },
      { type: 'heading', id: 'impact', text: 'Impact on Students' },
      { type: 'paragraph', text: 'Departmental staff expect the additional capacity to shorten practical rotations by several weeks each session.' },
    ],
    author: authors.john,
    category: byCategorySlug('technology'),
    departmentSlug: 'welding-offshore-technology',
    tags: [
      { name: 'Facilities', slug: 'facilities' },
      { name: 'Technology', slug: 'technology' },
    ],
    isFeatured: false,
    publishedAt: '2026-04-22T09:00:00.000Z',
    readingMinutes: 3,
    views: 380,
  },
  {
    id: 'art-inter-dept-games',
    title: 'Inter-Departmental Games Return After Two-Year Break',
    slug: 'inter-departmental-games-return',
    excerpt: 'Eight departments will compete across football, athletics and indoor events through the coming term.',
    content: [
      { type: 'heading', id: 'fixtures', text: 'Fixtures' },
      { type: 'paragraph', text: 'Opening fixtures run across the main sports complex, with finals scheduled for the end of the term.' },
      { type: 'heading', id: 'participation', text: 'Taking Part' },
      { type: 'paragraph', text: 'Registration is handled by departmental sports representatives, and all enrolled students are eligible.' },
    ],
    author: authors.jane,
    category: byCategorySlug('sports'),
    tags: [
      { name: 'Sports', slug: 'sports' },
      { name: 'Students', slug: 'students' },
    ],
    isFeatured: false,
    publishedAt: '2026-04-18T09:00:00.000Z',
    readingMinutes: 2,
    views: 300,
  },
  {
    id: 'art-portal-maintenance',
    title: 'Student Portal Scheduled for Maintenance This Weekend',
    slug: 'student-portal-maintenance',
    excerpt: 'Course registration and results checking will be briefly unavailable while the portal is upgraded.',
    content: [
      { type: 'heading', id: 'window', text: 'Maintenance Window' },
      { type: 'paragraph', text: 'The portal will be offline overnight on Saturday. Students are advised to complete pending registrations beforehand.' },
      { type: 'heading', id: 'after', text: 'After the Upgrade' },
      { type: 'paragraph', text: 'The upgrade introduces faster results lookup and a redesigned course registration flow.' },
    ],
    author: authors.board,
    category: byCategorySlug('announcements'),
    tags: [{ name: 'Announcements', slug: 'announcements' }],
    isFeatured: false,
    publishedAt: '2026-04-12T09:00:00.000Z',
    readingMinutes: 2,
    views: 1450,
  },
];

export const events: CampusEvent[] = [
  {
    id: 'evt-matriculation',
    title: '2026 Matriculation Ceremony',
    slug: 'matriculation',
    description: 'The formal admission ceremony for the incoming cohort of full-time and SICE students.',
    location: 'PTI Conference Centre',
    // Held July 2026 — see the matriculation report in News. Now a past
    // event, so it no longer appears in the upcoming list.
    startsAt: '2026-07-24T09:00:00.000Z',
    endsAt: '2026-07-24T12:00:00.000Z',
  },
  {
    id: 'evt-tech-exhibition',
    title: 'Annual Technology Exhibition',
    slug: 'tech-exhibition',
    description: 'Student and departmental project stands open to the public, alongside talks from visiting industry engineers.',
    location: 'Main Campus Pavilion',
    startsAt: '2026-11-12T08:00:00.000Z',
    endsAt: '2026-11-12T15:00:00.000Z',
  },
  {
    id: 'evt-career-fair',
    title: 'Energy Sector Career Fair',
    slug: 'career-fair',
    description: 'Recruiters from across the energy sector meet final-year students and recent graduates.',
    location: 'Institute Sports Complex',
    startsAt: '2026-11-28T08:30:00.000Z',
    endsAt: '2026-11-28T14:00:00.000Z',
  },
  {
    id: 'evt-research-seminar',
    title: 'Faculty Research Seminar Series',
    slug: 'research-seminar',
    description: 'Monthly seminar in which departments present ongoing research to staff and postgraduate students.',
    location: 'Innovation Hub Auditorium',
    startsAt: '2026-12-05T13:00:00.000Z',
    endsAt: '2026-12-05T16:00:00.000Z',
  },
];
