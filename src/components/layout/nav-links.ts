export interface NavLink {
  name: string;
  href: string;
}

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
  { name: 'Students', href: '#' },
  { name: 'Staff', href: '#' },
  { name: 'Alumni', href: '#' },
  { name: 'Portal', href: '#' },
];
