import Link from 'next/link';
import { getAllAnthologies, getAllArticles, getAllSpots } from '@/lib/content';
import { getTagsWithCount } from '@/lib/tags';
import AnthologyCard from '@/components/cards/AnthologyCard';
import ArticleCard from '@/components/cards/ArticleCard';
import SpotCard from '@/components/cards/SpotCard';

export default function HomePage() {
  const anthologies = getAllAnthologies();
  const articles = getAllArticles();
  const spots = getAllSpots();
  const tags = getTagsWithCount().filter((t) => t.count > 0).slice(0, 10);

  const featuredAnthology = anthologies[0];
  const latestAnthologies = anthologies.slice(0, 3);
  const latestArticles = articles.slice(0, 3);
  const featuredSpots = spots.slice(0, 3);

  return (
    <>
      {/* ヒーローセクション */}
      <section className="bg-gradient-to-b from-[#F5E6D3] to-[#FDFAF7] py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-[#A0826D] mb-3 tracking-wider uppercase">Scone Portal</p>
            <h1 className="text-4xl md:text-5xl font-bold text-[#2C1810] mb-6 font-serif leading-tight">
              スコーンのある場所と、<br />そこで生まれた言葉。
            </h1>
            <p className="text-lg text-[#5C3317] mb-8 leading-relaxed">
              アンソロジー企画を軸に、収録作・関連記事・スポットを横断して回遊できる文芸ポータルです。
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/anthologies" className="px-6 py-3 bg-[#A0826D] text-white rounded-full font-medium hover:bg-[#8B4513] transition-colors">アンソロジーを読む</Link>
              <Link href="/spots" className="px-6 py-3 border border-[#A0826D] text-[#8B4513] rounded-full font-medium hover:bg-[#F5E6D3] transition-colors">スポットを探す</Link>
            </div>
          </div>
          {featuredAnthology && (
            <div className="mt-10">
              <p className="text-xs text-[#A0826D] font-medium mb-3 uppercase tracking-wider">注目のアンソロジー</p>
              <Link href={`/anthologies/${featuredAnthology.slug}`} className="block bg-white rounded-2xl border border-[#E8D5C0] p-6 hover:shadow-md transition-shadow max-w-xl">
                <p className="text-xs text-[#A0826D] mb-1">{featuredAnthology.theme}</p>
                <h2 className="text-xl font-bold text-[#2C1810] mb-2 font-serif">{featuredAnthology.title}</h2>
                <p className="text-sm text-[#5C3317] line-clamp-2 leading-relaxed mb-3">{featuredAnthology.description}</p>
                <span className="text-sm text-[#A0826D]">{featuredAnthology.works?.length ?? 0}作品収録 →</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* スポット */}
      {featuredSpots.length > 0 && (
        <section className="py-12 px-4" aria-labelledby="spots-heading">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 id="spots-heading" className="text-2xl font-bold text-[#2C1810] font-serif">スコーンのある場所</h2>
              <Link href="/spots" className="text-sm text-[#A0826D] hover:text-[#8B4513] transition-colors">すべて見る →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredSpots.map((spot) => (<SpotCard key={spot.slug} spot={spot} />))}
            </div>
          </div>
        </section>
      )}

      {/* 新着アンソロジー */}
      {latestAnthologies.length > 0 && (
        <section className="py-12 px-4 bg-[#FAF3EC]" aria-labelledby="anthologies-heading">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 id="anthologies-heading" className="text-2xl font-bold text-[#2C1810] font-serif">新着アンソロジー企画</h2>
              <Link href="/anthologies" className="text-sm text-[#A0826D] hover:text-[#8B4513] transition-colors">すべて見る →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestAnthologies.map((a) => (<AnthologyCard key={a.slug} anthology={a} />))}
            </div>
          </div>
        </section>
      )}

      {/* 新着記事 */}
      {latestArticles.length > 0 && (
        <section className="py-12 px-4" aria-labelledby="articles-heading">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 id="articles-heading" className="text-2xl font-bold text-[#2C1810] font-serif">新着記事</h2>
              <Link href="/articles" className="text-sm text-[#A0826D] hover:text-[#8B4513] transition-colors">すべて見る →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestArticles.map((a) => (<ArticleCard key={a.slug} article={a} />))}
            </div>
          </div>
        </section>
      )}

      {/* タグ */}
      {tags.length > 0 && (
        <section className="py-12 px-4 bg-[#FAF3EC]" aria-labelledby="tags-heading">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 id="tags-heading" className="text-2xl font-bold text-[#2C1810] font-serif">タグで探す</h2>
              <Link href="/tags" className="text-sm text-[#A0826D] hover:text-[#8B4513] transition-colors">タグ一覧 →</Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link key={tag.slug} href={`/tags/${encodeURIComponent(tag.name)}`} className="text-sm bg-white border border-[#E8D5C0] text-[#8B4513] px-4 py-2 rounded-full hover:bg-[#F5E6D3] hover:border-[#A0826D] transition-colors">
                  #{tag.name}<span className="ml-1.5 text-xs text-[#A0826D]">{tag.count}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
