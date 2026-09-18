import { getTrendingArticles } from '@/lib/content/queries';
import { BreakingNewsTicker, type TickerItem } from './BreakingNewsTicker';

export async function BreakingNews() {
  const trending = await getTrendingArticles(5);

  const items: TickerItem[] = trending.map((article) => ({
    title: article.title,
    href: `/news/${article.slug}`,
  }));

  return <BreakingNewsTicker items={items} />;
}
