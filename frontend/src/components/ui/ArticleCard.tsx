import Link from 'next/link';
import Image from 'next/image';

interface ArticleCardProps {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  imageUrl?: string;
  author: string;
  href: string;
}

export function ArticleCard({ title, excerpt, category, date, imageUrl, author, href }: ArticleCardProps) {
  return (
    <div className="group flex flex-col gap-3 bg-white border border-slate-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {imageUrl && (
        <div className="relative w-full h-48 mb-2 overflow-hidden rounded-md bg-slate-100">
          <Image src={imageUrl} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      )}
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-green-700">
        <span>{category}</span>
        <span className="text-slate-300">•</span>
        <span className="text-slate-500">{date}</span>
      </div>
      <Link href={href}>
        <h3 className="font-sans text-xl font-bold text-slate-900 group-hover:text-green-700 transition-colors line-clamp-2 leading-snug">
          {title}
        </h3>
      </Link>
      <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
        {excerpt}
      </p>
      <div className="mt-auto pt-4 flex items-center gap-2 text-sm text-slate-800 font-medium">
        <div className="w-6 h-6 bg-slate-200 rounded-full"></div>
        <span>By {author}</span>
      </div>
    </div>
  );
}
