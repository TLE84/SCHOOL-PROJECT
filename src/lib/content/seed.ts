import type { Article, Author, CampusEvent, Category, CertificateCourse, Department } from './types';

/**
 * Placeholder editorial content.
 *
 * The article copy, bylines and quotes here were carried over from the
 * hardcoded JSX they replaced — they are illustrative, not real reporting, and
 * should be swapped for genuine content (and genuine attributions) before this
 * site goes live.
 */

export const authors: Record<string, Author> = {
  // Role and bio are intentionally unset: neither has been supplied, and
  // inventing them would attach made-up detail to a real person.
  dorcas: {
    id: 'author-dorcas',
    name: 'Iyango Dorcas',
    initials: 'ID',
  },
};

export const categories: Category[] = [
  { id: 'cat-innovation', name: 'Innovation', slug: 'innovation', description: 'New ideas, facilities and ventures emerging from the institute.' },
  { id: 'cat-technology', name: 'Technology', slug: 'technology', description: 'Student projects, competitions and technical achievement.' },
  { id: 'cat-research', name: 'Research', slug: 'research', description: 'Studies, partnerships and technical work led by PTI staff and students.' },
  { id: 'cat-academics', name: 'Academics', slug: 'academics', description: 'Curriculum, examinations, admissions and academic policy.' },
  { id: 'cat-student-affairs', name: 'Student Affairs', slug: 'student-affairs', description: 'Student union governance, representation and campus life.' },
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

/**
 * The institute's academic departments.
 *
 * Names and abbreviations as supplied. Descriptions are deliberately absent —
 * no prose has been provided, and writing it here would attach invented claims
 * to real academic units. The department pages render without it.
 */
export const departments: Department[] = [
  { id: 'dept-csit', name: 'Computer Science and Information Technology', abbreviation: 'CSIT', slug: 'computer-science-information-technology' },
  { id: 'dept-cet', name: 'Computer Engineering and Technology', abbreviation: 'CET', slug: 'computer-engineering-technology' },
  { id: 'dept-pngpd', name: 'Petroleum and Natural Gas Processing', abbreviation: 'PNGPD', slug: 'petroleum-natural-gas-processing' },
  { id: 'dept-eeed', name: 'Electrical and Electronic Engineering', abbreviation: 'EEED', slug: 'electrical-electronic-engineering' },
  { id: 'dept-pmbs', name: 'Petroleum Marketing and Business Studies', abbreviation: 'PMBS', slug: 'petroleum-marketing-business-studies' },
  { id: 'dept-weot', name: 'Welding Engineering and Offshore Technology', abbreviation: 'WEOT', slug: 'welding-engineering-offshore-technology' },
  { id: 'dept-mech', name: 'Mechanical Engineering', slug: 'mechanical-engineering' },
  { id: 'dept-slt', name: 'Science Laboratory and Technology', abbreviation: 'SLT', slug: 'science-laboratory-technology' },
  { id: 'dept-esmt', name: 'Environmental Science and Management Technology', abbreviation: 'ESMT', slug: 'environmental-science-management-technology' },
  { id: 'dept-iset', name: 'Industrial Safety and Environmental Technology', abbreviation: 'ISET', slug: 'industrial-safety-environmental-technology' },
  { id: 'dept-peg', name: 'Petroleum Engineering and Geosciences', abbreviation: 'PEG', slug: 'petroleum-engineering-geosciences' },
  { id: 'dept-met', name: 'Mechatronics Engineering Technology', abbreviation: 'MET', slug: 'mechatronics-engineering-technology' },
];

/** Short certificate programmes offered alongside the departments. */
export const certificateCourses: CertificateCourse[] = [
  { id: 'cert-general-welding', name: 'General Welding', slug: 'general-welding' },
  { id: 'cert-commercial-diving', name: 'Commercial Diving', slug: 'commercial-diving' },
];

/**
 * Validates an article's department slug at module load.
 *
 * An unknown slug would not throw — the article would simply stop appearing on
 * every department page, silently. Failing loudly here is cheaper to notice.
 */
const inDepartment = (slug: string): string => {
  if (!departments.some((department) => department.slug === slug)) {
    throw new Error(`Unknown department slug in seed data: ${slug}`);
  }
  return slug;
};

export const articles: Article[] = [
  {
    id: 'art-admissions-2026-2027',
    title: 'Applications Open for the 2026/2027 Academic Session',
    slug: 'admissions-2026-2027-open',
    excerpt:
      'The institute is processing applications for HND and certificate programmes for the 2026/2027 academic session through the official PTI website.',
    content: [
      { type: 'paragraph', text: 'The Petroleum Training Institute is currently processing applications for the 2026/2027 academic session. Applications are being received through the official PTI website.' },
      { type: 'heading', id: 'programmes', text: 'Programmes Covered' },
      { type: 'paragraph', text: 'The current intake covers Higher National Diploma (HND) programmes and the institute’s certificate programmes.' },
      { type: 'paragraph', text: 'Certificate offerings include General Welding and Commercial Diving.' },
      {
        type: 'note',
        label: 'Applying',
        text: 'Applications are processed through the official Petroleum Training Institute website. Prospective students should confirm entry requirements, closing dates and fees there before applying.',
      },
    ],
    author: authors.dorcas,
    category: byCategorySlug('announcements'),
    tags: [
      { name: 'Admissions', slug: 'admissions' },
      { name: 'Announcements', slug: 'announcements' },
    ],
    isPublished: true,
    isFeatured: false,
    publishedAt: '2026-08-03T09:00:00.000Z',
    readingMinutes: 2,
    views: 1980,
  },
  {
    id: 'art-src-suspends-sug-president',
    title:
      'PTI Students’ Representative Council Suspends SUG President Over Alleged Constitutional and Financial Breaches',
    slug: 'src-suspends-sug-president',
    excerpt:
      'The Students’ Representative Council has suspended SUG President Comr. Kenneth Awhawbera until further notice, citing alleged breaches of the union constitution and its financial procedures.',
    content: [
      { type: 'paragraph', text: 'The Students’ Representative Council (SRC) of the Petroleum Training Institute (PTI), Effurun, has announced the suspension of the institution’s Students’ Union Government (SUG) President, Comr. Kenneth Awhawbera, from office until further notice.' },
      { type: 'paragraph', text: 'The decision was contained in an official letter dated August 1, 2026, signed by the Speaker of the Students’ Representative Council, Rt. Hon. Aransiola Oluwatobiloba Kayode, and the Clerk of the House, Hon. Okonkwor Precious Somto.' },
      { type: 'paragraph', text: 'According to the letter, the suspension followed what the SRC described as a number of alleged breaches in the discharge of the SUG President’s official responsibilities.' },

      { type: 'heading', id: 'allegations', text: 'Allegations Behind the Suspension' },
      { type: 'paragraph', text: 'The SRC cited several issues as the basis for its decision, including an alleged bypassing of other executive members in the performance of official duties and alleged mismanagement of union funds.' },
      { type: 'paragraph', text: 'The Council also accused the suspended president of signing official correspondence without the endorsement of the Secretary-General, which it said was contrary to provisions of the SUG Constitution.' },
      { type: 'paragraph', text: 'Another allegation concerned the signing of union cheques without the required signatories, specifically the Treasurer and Secretary-General, as stipulated by the SUG Constitution and established financial procedures.' },
      { type: 'paragraph', text: 'The SRC stated that these actions warranted the suspension while the matter remains under consideration.' },

      { type: 'heading', id: 'restrictions', text: 'Suspension Restricts Official Duties' },
      { type: 'paragraph', text: 'Following the suspension, the SRC said Comr. Kenneth Awhawbera is not authorised to perform duties or act in the capacity of SUG President until further notice.' },
      { type: 'paragraph', text: 'The letter specifically stated that he is prohibited from representing the Union, issuing directives, signing official documents, or carrying out other activities in his capacity as SUG President during the period of suspension.' },
      { type: 'paragraph', text: 'The development effectively places the day-to-day authority of the SUG presidency under scrutiny as the student leadership structure moves to address the allegations.' },

      { type: 'heading', id: 'governance', text: 'Questions Over SUG Governance and Financial Procedures' },
      { type: 'paragraph', text: 'The suspension has brought renewed attention to the importance of adherence to the PTI SUG Constitution, particularly regarding financial approvals, executive responsibilities and the procedures for official correspondence.' },
      { type: 'paragraph', text: 'The SRC’s letter emphasised that its actions were based on what it described as established facts and constitutional provisions.' },
      { type: 'paragraph', text: 'However, the document does not state the duration of the suspension or provide details of any disciplinary hearing or further investigative process. It remains unclear from the letter what specific steps will follow or whether the suspended president will be given an opportunity to respond formally to the allegations.' },

      { type: 'heading', id: 'next', text: 'What Happens Next?' },
      { type: 'paragraph', text: 'The suspension is expected to generate further discussions among students and stakeholders within the Petroleum Training Institute, particularly regarding the constitutional process for handling allegations against elected SUG officials.' },
      { type: 'paragraph', text: 'As of the date of the letter, the SRC has maintained that the suspension remains in effect until further notice.' },

      {
        type: 'note',
        label: 'Editor’s Note',
        text: 'The allegations contained in this report are attributed to the Students’ Representative Council. The suspension itself does not, on its own, establish that the allegations are proven. A response from Comr. Kenneth Awhawbera or his representatives would provide the other side of the matter and should be included if obtained.',
      },
    ],
    author: authors.dorcas,
    category: byCategorySlug('student-affairs'),
    tags: [
      { name: 'Student Union', slug: 'student-union' },
      { name: 'SUG', slug: 'sug' },
      { name: 'Governance', slug: 'governance' },
      { name: 'Students', slug: 'students' },
    ],
    isPublished: true,
    isFeatured: false,
    publishedAt: '2026-08-01T09:00:00.000Z',
    readingMinutes: 4,
    views: 3140,
  },
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
    author: authors.dorcas,
    category: byCategorySlug('academics'),
    // Placeholder photograph — replace with an image from the ceremony itself.
    featuredImage: '/images/pti_students_lab.jpg',
    tags: [
      { name: 'Matriculation', slug: 'matriculation' },
      { name: 'Students', slug: 'students' },
      { name: 'Academics', slug: 'academics' },
      { name: 'SICE', slug: 'sice' },
    ],
    isPublished: true,
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
    author: authors.dorcas,
    category: byCategorySlug('innovation'),
    departmentSlug: inDepartment('petroleum-engineering-geosciences'),
    featuredImage: '/images/pti_innovation_hub.jpg',
    tags: [
      { name: 'Innovation', slug: 'innovation' },
      { name: 'Research', slug: 'research' },
      { name: 'Entrepreneurship', slug: 'entrepreneurship' },
      { name: 'Students', slug: 'students' },
      { name: 'Technology', slug: 'technology' },
    ],
    isPublished: true,
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
    author: authors.dorcas,
    category: byCategorySlug('technology'),
    departmentSlug: inDepartment('electrical-electronic-engineering'),
    featuredImage: '/images/pti_students_lab.jpg',
    tags: [
      { name: 'Technology', slug: 'technology' },
      { name: 'Students', slug: 'students' },
    ],
    isPublished: true,
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
    author: authors.dorcas,
    category: byCategorySlug('research'),
    departmentSlug: inDepartment('petroleum-natural-gas-processing'),
    tags: [
      { name: 'Research', slug: 'research' },
      { name: 'Industry', slug: 'industry' },
    ],
    isPublished: true,
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
    author: authors.dorcas,
    category: byCategorySlug('academics'),
    tags: [
      { name: 'Academics', slug: 'academics' },
      { name: 'Energy', slug: 'energy' },
    ],
    isPublished: true,
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
    author: authors.dorcas,
    category: byCategorySlug('alumni'),
    tags: [
      { name: 'Alumni', slug: 'alumni' },
      { name: 'Scholarship', slug: 'scholarship' },
    ],
    isPublished: true,
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
    author: authors.dorcas,
    category: byCategorySlug('technology'),
    departmentSlug: inDepartment('welding-engineering-offshore-technology'),
    tags: [
      { name: 'Facilities', slug: 'facilities' },
      { name: 'Technology', slug: 'technology' },
    ],
    isPublished: true,
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
    author: authors.dorcas,
    category: byCategorySlug('sports'),
    tags: [
      { name: 'Sports', slug: 'sports' },
      { name: 'Students', slug: 'students' },
    ],
    isPublished: true,
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
    author: authors.dorcas,
    category: byCategorySlug('announcements'),
    tags: [{ name: 'Announcements', slug: 'announcements' }],
    isPublished: true,
    isFeatured: false,
    publishedAt: '2026-04-12T09:00:00.000Z',
    readingMinutes: 2,
    views: 1450,
  },
];

export const events: CampusEvent[] = [
  {
    id: 'evt-ogtan-expo',
    title: 'OGTAN Human Capital Development Conference & Expo 2026',
    slug: 'ogtan-conference-expo-2026',
    description:
      'The Oil and Gas Trainers Association of Nigeria brings its human capital development conference and exhibition to PTI Effurun across three days.',
    location: 'Petroleum Training Institute, Effurun',
    startsAt: '2026-08-25T00:00:00.000Z',
    endsAt: '2026-08-27T23:59:59.000Z',
    allDay: true,
  },
  {
    id: 'evt-delta-central-meetings',
    title: 'Delta Central and APC Leadership Meetings',
    slug: 'delta-central-apc-meetings',
    description:
      'The PTI Conference Centre hosted Delta Central political and APC leadership meetings.',
    location: 'PTI Conference Centre',
    // Reported only as "late July 2026"; exact day still to be confirmed.
    startsAt: '2026-07-28T00:00:00.000Z',
    allDay: true,
  },
  {
    id: 'evt-matriculation',
    title: '2026 Matriculation Ceremony',
    slug: 'matriculation',
    description:
      'The formal admission ceremony for the incoming cohort of full-time and SICE students.',
    location: 'PTI Conference Centre',
    // Held July 2026 — see the matriculation report in News.
    startsAt: '2026-07-24T00:00:00.000Z',
    allDay: true,
  },
  {
    id: 'evt-stse',
    title: 'Students Technical Symposium and Exhibition (STSE)',
    slug: 'students-technical-symposium',
    description:
      'The annual student technical symposium and exhibition, hosted on the main campus.',
    location: 'Petroleum Training Institute, Effurun',
    // Reported only as "March 2026"; exact day still to be confirmed.
    startsAt: '2026-03-18T00:00:00.000Z',
    allDay: true,
  },
];
