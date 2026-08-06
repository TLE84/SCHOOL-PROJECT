import Link from 'next/link';
import { audienceLinks } from './nav-links';

export function TopBar() {
  return (
    <div className="bg-green-900 text-white text-sm py-2 px-4 justify-between items-center hidden md:flex">
      <div>
        <span className="text-gold font-semibold">📢 Admission for 2024/2025 Academic Session is now open.</span>
        <Link href="#" className="text-gold underline ml-2 hover:text-white transition-colors">Apply Now →</Link>
      </div>
      <div className="flex gap-4 text-xs font-medium tracking-wide">
        {audienceLinks.map(link => (
          <Link key={link.name} href={link.href} className="hover:text-green-300 transition-colors">
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
