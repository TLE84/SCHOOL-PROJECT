import Link from 'next/link';
import { cn } from '@/lib/utils';

interface PillProps {
  label: string;
  href?: string;
  variant?: 'default' | 'outline' | 'green';
}

export function Pill({ label, href, variant = 'default' }: PillProps) {
  const baseClasses = "inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full transition-colors whitespace-nowrap";
  const variants = {
    default: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    outline: "border border-slate-200 text-slate-600 hover:border-green-600 hover:text-green-700",
    green: "bg-green-700 text-white hover:bg-green-800",
  };

  const className = cn(baseClasses, variants[variant]);

  if (href) {
    return (
      <Link href={href} className={className}>
        {label}
      </Link>
    );
  }

  return (
    <span className={className}>
      {label}
    </span>
  );
}
