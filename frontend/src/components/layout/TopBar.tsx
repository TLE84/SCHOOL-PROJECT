import Link from 'next/link';

export function TopBar() {
  return (
    <div className="bg-green-900 text-white text-sm py-2 px-4 flex justify-between items-center hidden md:flex">
      <div>
        <span className="text-gold font-semibold">📢 Admission for 2024/2025 Academic Session is now open.</span>
        <Link href="#" className="text-gold underline ml-2 hover:text-white transition-colors">Apply Now →</Link>
      </div>
      <div className="flex gap-4 text-xs font-medium tracking-wide">
        <Link href="#" className="hover:text-green-300 transition-colors">Students</Link>
        <Link href="#" className="hover:text-green-300 transition-colors">Staff</Link>
        <Link href="#" className="hover:text-green-300 transition-colors">Alumni</Link>
        <Link href="#" className="hover:text-green-300 transition-colors">Portal</Link>
      </div>
    </div>
  );
}
