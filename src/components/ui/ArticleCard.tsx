import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/lib/content/types';
import { formatDate } from '@/lib/format';

interface ArticleCardProps {
  article: Article;
  /** Feed this the layout width so the browser picks a sensibly sized image. */
  imageSizes?: string;
}

export function ArticleCard({
  article,
  imageSizes = '(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw',
}: ArticleCardProps) {
  return (
    // `relative` pairs with the title link's `after:absolute inset-0` below,
    // which stretches the click target over the whole card while keeping a
    // single link in the accessibility tree.
    <article className="group relative flex flex-col gap-3 bg-white border border-slate-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {article.featuredImage && (
        <div className="relative w-full h-48 mb-2 overflow-hidden rounded-md bg-slate-100">
          <Image
            src={article.featuredImage}
            alt=""
            fill
            sizes={imageSizes}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-green-700">
        <span>{article.category.name}</span>
        <span className="text-slate-300">•</span>
        <time dateTime={article.publishedAt} className="text-slate-500">
          {formatDate(article.publishedAt)}
        </time>
      </div>

      <h3 className="font-sans text-xl font-bold text-slate-900 leading-snug">
        <Link
          href={`/news/${article.slug}`}
          className="after:absolute after:inset-0 group-hover:text-green-700 transition-colors line-clamp-2"
        >
          {article.title}
        </Link>
      </h3>

      <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">{article.excerpt}</p>

      <div className="mt-auto pt-4 flex items-center gap-2 text-sm text-slate-800 font-medium">
        <span
          aria-hidden="true"
          className="w-6 h-6 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 flex items-center justify-center"
        >
          {article.author.initials}
        </span>
        <span>By {article.author.name}</span>
      </div>
    </article>
  );
}
