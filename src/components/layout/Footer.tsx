import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-green-900 text-white pt-16 pb-8 border-t-[8px] border-green-700">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-1">
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
          <div className="flex gap-4 text-green-300">
            {/* Social Icons Placeholder */}
            <a href="#" className="hover:text-white transition-colors">Facebook</a>
            <a href="#" className="hover:text-white transition-colors">X</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>
        
        <div>
          <h3 className="font-bold mb-5 text-lg font-serif">Explore</h3>
          <ul className="space-y-3 text-sm text-green-100">
            <li><Link href="#" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">News</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Departments</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Events</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Gallery</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-bold mb-5 text-lg font-serif">Categories</h3>
          <ul className="space-y-3 text-sm text-green-100">
            <li><Link href="#" className="hover:text-white transition-colors">Technology</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Academics</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Research</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Sports</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Announcements</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Opinion</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-5 text-lg font-serif">Contact Us</h3>
          <ul className="space-y-4 text-sm text-green-100">
            <li className="flex gap-3">
              <MapPin size={18} className="shrink-0 text-green-300" />
              <span>KM 22, Effurun/Sapele Road<br/>P.M.B 1052, Effurun,<br/>Delta State, Nigeria.</span>
            </li>
            <li className="flex gap-3 items-center">
              <Mail size={18} className="shrink-0 text-green-300" />
              <span>info@pti.edu.ng</span>
            </li>
            <li className="flex gap-3 items-center">
              <Phone size={18} className="shrink-0 text-green-300" />
              <span>+234 813 123 4567</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto px-4 border-t border-green-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-green-300">
        <p>© 2024 Petroleum Training Institute. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0 font-medium">
          <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-white transition-colors">Terms of Use</Link>
          <Link href="#" className="hover:text-white transition-colors">Accessibility</Link>
        </div>
      </div>
    </footer>
  );
}
