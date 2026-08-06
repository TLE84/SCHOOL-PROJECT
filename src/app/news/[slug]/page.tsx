import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Mail, CheckCircle, Link as LinkIcon } from 'lucide-react';
import { Pill } from '@/components/ui/Pill';
import { ShareLinks } from '@/components/ui/ShareLinks';
import { getAllArticleSlugs, getArticleBySlug, getRelatedArticles } from '@/lib/content/queries';
import { formatDate } from '@/lib/format';

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) return { title: 'Article not found' };

  return {
    title: article.title,
    description: article.excerpt,
    authors: [{ name: article.author.name }],
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.excerpt,
      publishedTime: article.publishedAt,
      authors: [article.author.name],
      images: article.featuredImage ? [article.featuredImage] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  // Previously every slug rendered the same hardcoded article, so any URL
  // under /news returned 200. Unknown slugs are now a genuine 404.
  if (!article) notFound();

  const related = await getRelatedArticles(article, 3);
  const headings = article.content.filter((block) => block.type === 'heading');

  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
        <nav aria-label="Breadcrumb" className="mb-10">
          <ol className="flex flex-wrap items-center gap-3 text-sm text-slate-500 font-sans font-medium tracking-wide uppercase">
            <li><Link href="/" className="hover:text-green-700 transition-colors">Home</Link></li>
            <li aria-hidden="true"><ChevronRight size={14} className="text-slate-300" /></li>
            <li><Link href="/news" className="hover:text-green-700 transition-colors">News</Link></li>
            <li aria-hidden="true"><ChevronRight size={14} className="text-slate-300" /></li>
            <li>
              <Link href={`/category/${article.category.slug}`} className="text-slate-900 font-bold hover:text-green-700 transition-colors">
                {article.category.name}
              </Link>
            </li>
          </ol>
        </nav>

        <div className="mb-8">
          <Pill label={article.category.name} href={`/category/${article.category.slug}`} variant="green" />
        </div>

        <h1 className="font-sans text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.1] mb-8 max-w-5xl tracking-tight">
          {article.title}
        </h1>

        <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-4xl leading-relaxed font-serif">
          {article.excerpt}
        </p>

        <div className="flex flex-col md:flex-row md:items-center justify-between border-y border-slate-200 py-6 mb-12">
          <div className="flex items-center gap-4">
            <span
              aria-hidden="true"
              className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-sans font-bold shadow-inner"
            >
              {article.author.initials}
            </span>
            <div>
              <div className="flex items-center gap-1 font-bold text-slate-900 font-sans text-lg">
                By {article.author.name}
                <CheckCircle size={16} className="text-green-600 ml-1" aria-hidden="true" />
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 font-sans mt-1">
                <time dateTime={article.publishedAt} className="font-medium">
                  {formatDate(article.publishedAt)}
                </time>
                <span className="w-1 h-1 bg-slate-300 rounded-full" aria-hidden="true" />
                <span>{article.readingMinutes} min read</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full" aria-hidden="true" />
                <span>{article.views.toLocaleString('en-GB')} views</span>
              </div>
            </div>
          </div>

          <div className="mt-6 md:mt-0">
            <ShareLinks path={`/news/${article.slug}`} title={article.title} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-8">
            {article.featuredImage && (
              <div className="relative w-full h-[400px] md:h-[600px] rounded-2xl overflow-hidden mb-16 bg-slate-100 shadow-lg">
                <Image
                  src={article.featuredImage}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 66vw, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <article className="prose prose-xl prose-slate prose-headings:font-sans prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-green-700 hover:prose-a:text-green-800 max-w-none mb-16 font-serif leading-loose">
              {article.content.map((block, index) => {
                if (block.type === 'heading') {
                  return (
                    // The id is what the table of contents links to.
                    <h2 key={block.id} id={block.id} className="scroll-mt-32">
                      {block.text}
                    </h2>
                  );
                }
                if (block.type === 'quote') {
                  return (
                    <blockquote
                      key={index}
                      className="border-l-4 border-green-700 bg-green-50/50 p-8 rounded-r-xl italic text-2xl text-slate-800 my-12 shadow-sm font-serif"
                    >
                      {block.text}
                      <footer className="text-lg text-slate-600 mt-6 not-italic font-sans font-bold uppercase tracking-wide">
                        — {block.attribution}
                      </footer>
                    </blockquote>
                  );
                }
                return <p key={index}>{block.text}</p>;
              })}
            </article>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-16 font-sans">
              <span className="font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide text-sm">
                <LinkIcon size={16} aria-hidden="true" /> Tags:
              </span>
              <div className="flex flex-wrap gap-3">
                {article.tags.map((tag) => (
                  <Pill key={tag.slug} label={tag.name} variant="outline" />
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 font-sans">
            <div className="sticky top-32 flex flex-col gap-10">
              {headings.length > 0 && (
                <nav aria-labelledby="toc-heading" className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
                  <h2 id="toc-heading" className="font-sans font-bold text-xl mb-6 text-slate-900 border-l-4 border-green-700 pl-3">
                    Table of Contents
                  </h2>
                  <ol className="text-base text-slate-600 space-y-4 font-medium list-decimal list-outside ml-5">
                    {headings.map((heading) => (
                      <li key={heading.id}>
                        <a href={`#${heading.id}`} className="hover:text-green-700 transition-colors">
                          {heading.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}

              <section aria-labelledby="author-heading" className="bg-slate-50 border border-slate-200 p-8 rounded-2xl shadow-sm">
                <h2 id="author-heading" className="font-sans font-bold text-xl mb-6 text-slate-900 border-l-4 border-green-700 pl-3">
                  About the Author
                </h2>
                <div className="flex items-center gap-5 mb-6">
                  <span
                    aria-hidden="true"
                    className="w-16 h-16 bg-white border border-slate-200 rounded-full flex items-center justify-center font-bold text-slate-400 text-xl shadow-inner shrink-0"
                  >
                    {article.author.initials}
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{article.author.name}</h3>
                    <p className="text-sm text-slate-500 font-medium tracking-wide uppercase mt-1">
                      {article.author.role}
                    </p>
                  </div>
                </div>
                <p className="text-base text-slate-600 leading-relaxed font-serif">{article.author.bio}</p>
              </section>

              {related.length > 0 && (
                <section aria-labelledby="related-heading" className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
                  <h2 id="related-heading" className="font-sans font-bold text-xl mb-8 text-slate-900 border-l-4 border-green-700 pl-3">
                    Related Stories
                  </h2>
                  <div className="flex flex-col gap-8">
                    {related.map((item) => (
                      <article key={item.id} className="group relative flex gap-5 items-center">
                        <div className="w-24 h-24 bg-slate-100 rounded-xl shrink-0 relative overflow-hidden shadow-sm">
                          {item.featuredImage && (
                            <Image
                              src={item.featuredImage}
                              alt=""
                              fill
                              sizes="96px"
                              className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          )}
                        </div>
                        <div className="flex flex-col justify-center">
                          <h3 className="font-sans font-bold text-base text-slate-900 line-clamp-2 mb-2 leading-snug">
                            <Link
                              href={`/news/${item.slug}`}
                              className="after:absolute after:inset-0 group-hover:text-green-700 transition-colors"
                            >
                              {item.title}
                            </Link>
                          </h3>
                          <time dateTime={item.publishedAt} className="text-xs text-slate-500 font-bold tracking-widest uppercase">
                            {formatDate(item.publishedAt)}
                          </time>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              <section aria-labelledby="newsletter-heading" className="bg-green-900 border border-green-800 p-8 rounded-2xl text-white shadow-xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 p-4 opacity-10 rotate-12" aria-hidden="true">
                  <Mail size={180} />
                </div>
                <h2 id="newsletter-heading" className="font-sans font-black text-2xl mb-4 flex items-center gap-3 relative z-10">
                  <Mail size={24} aria-hidden="true" /> Stay Updated
                </h2>
                <p className="text-base text-green-100 mb-8 relative z-10 leading-relaxed font-serif">
                  Subscribe to our newsletter for the latest news and academic announcements from PTI.
                </p>
                <form className="relative z-10 flex flex-col gap-4">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    required
                    className="w-full px-5 py-4 rounded-xl bg-white text-slate-900 text-base font-medium focus:outline-none focus:ring-4 focus:ring-green-500/50 transition-all shadow-inner"
                  />
                  <button
                    type="submit"
                    className="w-full bg-gold hover:bg-yellow-500 text-slate-900 font-black py-4 px-6 rounded-xl text-base uppercase tracking-wider transition-all shadow-md hover:-translate-y-1"
                  >
                    Subscribe
                  </button>
                </form>
                <p className="text-xs font-medium text-green-400 mt-6 text-center opacity-80 uppercase tracking-widest">
                  No spam. Unsubscribe anytime.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
