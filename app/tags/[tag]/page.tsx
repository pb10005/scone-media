import type { Metadata } from 'next';
import { getContentByTag, getAllTags } from '@/lib/tags';
import Breadcrumb from '@/components/layout/Breadcrumb';
import AnthologyCard from '@/components/cards/AnthologyCard';
import WorkCard from '@/components/cards/WorkCard';
import ArticleCard from '@/components/cards/ArticleCard';
import SpotCard from '@/components/cards/SpotCard';

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  return getAllTags().map((t) => ({ tag: encodeURIComponent(t.name) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const tagName = decodeURIComponent(tag);
  const { tag: tagInfo } = getContentByTag(tagName);
  const hasUniqueDescription = tagInfo.description && tagInfo.description.length >= 20;
  return {
    title: `#${tagName}`,
    description: hasUniqueDescription
      ? tagInfo.description
      : `「${tagName}」タグが付いたアンソロジー・収録作・記事・スポットの一覧。`,
    alternates: { canonical: `/tags/${tag}` },
    ...(!hasUniqueDescription && { robots: { index: false } }),
  };
}

export default async function TagDetailPage({ params }: Props) {
  const { tag } = await params;
  const tagName = decodeURIComponent(tag);
  const { tag: tagInfo, anthologies, works, articles, spots } = getContentByTag(tagName);

  const total = anthologies.length + works.length + articles.length + spots.length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Breadcrumb items={[{ label: 'タグ一覧', href: '/tags' }, { label: `#${tagName}` }]} />
      </div>

      <header className="mb-10">
        <h1 className="text-3xl font-bold text-[#2C1810] font-serif mb-3">#{tagName}</h1>
        {tagInfo.description && (
          <p className="text-[#5C3317] leading-relaxed mb-3">{tagInfo.description}</p>
        )}
        <p className="text-[#8B7355] text-sm">{total}件のコンテンツ</p>
      </header>

      {/* アンソロジー */}
      {anthologies.length > 0 && (
        <section className="mb-12" aria-labelledby="tag-anthologies">
          <h2 id="tag-anthologies" className="text-xl font-bold text-[#2C1810] font-serif mb-4 pb-2 border-b border-[#E8D5C0]">
            アンソロジー企画（{anthologies.length}件）
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {anthologies.map((a) => <AnthologyCard key={a.slug} anthology={a} />)}
          </div>
        </section>
      )}

      {/* 収録作 */}
      {works.length > 0 && (
        <section className="mb-12" aria-labelledby="tag-works">
          <h2 id="tag-works" className="text-xl font-bold text-[#2C1810] font-serif mb-4 pb-2 border-b border-[#E8D5C0]">
            収録作（{works.length}件）
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {works.map((w) => <WorkCard key={w.slug} work={w} showAnthology />)}
          </div>
        </section>
      )}

      {/* 記事 */}
      {articles.length > 0 && (
        <section className="mb-12" aria-labelledby="tag-articles">
          <h2 id="tag-articles" className="text-xl font-bold text-[#2C1810] font-serif mb-4 pb-2 border-b border-[#E8D5C0]">
            記事（{articles.length}件）
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((a) => <ArticleCard key={a.slug} article={a} />)}
          </div>
        </section>
      )}

      {/* スポット */}
      {spots.length > 0 && (
        <section className="mb-12" aria-labelledby="tag-spots">
          <h2 id="tag-spots" className="text-xl font-bold text-[#2C1810] font-serif mb-4 pb-2 border-b border-[#E8D5C0]">
            スポット（{spots.length}件）
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {spots.map((s) => <SpotCard key={s.slug} spot={s} />)}
          </div>
        </section>
      )}

      {total === 0 && (
        <div className="text-center py-12 text-[#8B7355]">
          このタグのコンテンツはまだありません。
        </div>
      )}
    </div>
  );
}
