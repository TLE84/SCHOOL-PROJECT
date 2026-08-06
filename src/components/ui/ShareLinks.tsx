import { absoluteUrl } from '@/lib/site';

/**
 * Share intents as plain links — they need no JavaScript, and each carries a
 * distinct icon and its own accessible name. The markup this replaced repeated
 * the same generic icon four times with no labels at all.
 *
 * The brand marks are inlined because lucide-react v1 dropped its brand icon
 * set, so there is no `Facebook` / `Twitter` / `Linkedin` export to import.
 */

const BRANDS = {
  facebook:
    'M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z',
  x: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z',
  linkedin:
    'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z',
} as const;

function BrandIcon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

export function ShareLinks({ path, title }: { path: string; title: string }) {
  const url = encodeURIComponent(absoluteUrl(path));
  const text = encodeURIComponent(title);

  const targets = [
    { name: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${url}`, icon: BRANDS.facebook, hover: 'hover:text-blue-700' },
    { name: 'X', href: `https://x.com/intent/tweet?url=${url}&text=${text}`, icon: BRANDS.x, hover: 'hover:text-slate-900' },
    { name: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`, icon: BRANDS.linkedin, hover: 'hover:text-blue-600' },
  ];

  return (
    <div className="flex items-center gap-4 text-sm font-bold text-slate-700 font-sans uppercase tracking-widest">
      <span aria-hidden="true">Share</span>
      <ul className="flex gap-3">
        {targets.map(({ name, href, icon, hover }) => (
          <li key={name}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Share on ${name}`}
              className={`w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center transition-all shadow-sm hover:bg-slate-100 ${hover}`}
            >
              <BrandIcon path={icon} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
