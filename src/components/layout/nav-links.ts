export interface NavLink {
  name: string;
  href: string;
  /** Opens in a new tab and is rendered as a plain external anchor. */
  external?: boolean;
}

/** The official Petroleum Training Institute website. */
export const PTI_SITE = 'https://www.pti.edu.ng';

/** Primary site navigation, shared by the desktop navbar and the mobile menu. */
export const navLinks: NavLink[] = [
  { name: 'Home', href: '/' },
  { name: 'News', href: '/news' },
  { name: 'Departments', href: '/departments' },
  { name: 'Events', href: '/events' },
  // Academics and Research are article categories, not sections of their own,
  // so they resolve through the shared /category/[slug] route.
  { name: 'Academics', href: '/category/academics' },
  { name: 'Research', href: '/category/research' },
];

/**
 * Audience shortcuts. These live in the TopBar, which is hidden below `md`,
 * so the mobile menu is the only way to reach them on a phone.
 */
export const audienceLinks: NavLink[] = [
  { name: 'Students', href: '/login' },
  { name: 'Staff', href: '/login' },
  { name: 'Alumni', href: PTI_SITE, external: true },
  { name: 'Sign In', href: '/login' },
];
