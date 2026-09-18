import Link from 'next/link';
import { audienceLinks, PTI_SITE } from './nav-links';

export function TopBar() {
  return (
    <div className="bg-green-900 text-white text-sm py-2 px-4 justify-between items-center hidden md:flex">
      <div>
        <span className="text-gold font-semibold">📢 Applications open for the 2026/2027 session — HND and certificate programmes.</span>
        <a
          href={PTI_SITE}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold underline ml-2 hover:text-white transition-colors"
        >
          Apply Now →
        </a>
      </div>
      <div className="flex gap-4 text-xs font-medium tracking-wide">
        {audienceLinks.map((link) =>
          link.external ? (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-300 transition-colors"
            >
              {link.name}
            </a>
          ) : (
            <Link key={link.name} href={link.href} className="hover:text-green-300 transition-colors">
              {link.name}
            </Link>
          ),
        )}
      </div>
    </div>
  );
}
