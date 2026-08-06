import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
import { getCategories } from '@/lib/content/queries';

const exploreLinks = [
  { name: 'Home', href: '/' },
  { name: 'News', href: '/news' },
  { name: 'Departments', href: '/departments' },
  { name: 'Events', href: '/events' },
];

const socialLinks = [
  { name: 'Facebook', href: '#' },
  { name: 'X', href: '#' },
  { name: 'LinkedIn', href: '#' },
];

export async function Footer() {
  const categories = await getCategories();

  return (
    <footer className="bg-green-900 text-white pt-16 pb-8 border-t-[8px] border-green-700">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center text-green-900 font-bold font-serif text-lg">PTI</div>
            <div>
              <div className="font-serif font-bold text-xl leading-none">PTI NEWS</div>
              <div className="text-xs text-green-200 mt-1">Digital Information Hub</div>
            </div>
          </div>
          <p className="text-sm text-green-100 mb-6 leading-relaxed">
            Your trusted source for news, updates, and stories from the Petroleum Training Institute.
          </p>
          <ul className="flex gap-4 text-green-300">
            {socialLinks.map((social) => (
              <li key={social.name}>
                <a href={social.href} className="hover:text-white transition-colors">
                  {social.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-labelledby="footer-explore">
          <h2 id="footer-explore" className="font-bold mb-5 text-lg font-serif">Explore</h2>
          <ul className="space-y-3 text-sm text-green-100">
            {exploreLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="hover:text-white transition-colors">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-categories">
          <h2 id="footer-categories" className="font-bold mb-5 text-lg font-serif">Categories</h2>
          <ul className="space-y-3 text-sm text-green-100">
            {categories.slice(0, 6).map((category) => (
              <li key={category.slug}>
                <Link href={`/category/${category.slug}`} className="hover:text-white transition-colors">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-bold mb-5 text-lg font-serif">Contact Us</h2>
          <ul className="space-y-4 text-sm text-green-100">
            <li className="flex gap-3">
              <MapPin size={18} className="shrink-0 text-green-300" aria-hidden="true" />
              <span>KM 22, Effurun/Sapele Road<br />P.M.B 1052, Effurun,<br />Delta State, Nigeria.</span>
            </li>
            <li className="flex gap-3 items-center">
              <Mail size={18} className="shrink-0 text-green-300" aria-hidden="true" />
              <a href="mailto:info@pti.edu.ng" className="hover:text-white transition-colors">info@pti.edu.ng</a>
            </li>
            <li className="flex gap-3 items-center">
              <Phone size={18} className="shrink-0 text-green-300" aria-hidden="true" />
              <a href="tel:+2348131234567" className="hover:text-white transition-colors">+234 813 123 4567</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-4 border-t border-green-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-green-300">
        <p>© {new Date().getFullYear()} Petroleum Training Institute. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0 font-medium">
          <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-white transition-colors">Terms of Use</Link>
          <Link href="#" className="hover:text-white transition-colors">Accessibility</Link>
        </div>
      </div>
    </footer>
  );
}
