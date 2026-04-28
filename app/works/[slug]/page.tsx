import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllWorkSlugs, getWorkBySlug, getAnthologyBySlug, getRelatedArticles, getAllWorks } from '@/lib/content';
import Breadcrumb from '@/components/layout/Breadcrumb';
import TagList from '@/components/TagList';
import { RelatedArticles } from '@/components/RelatedContent';
import WorkViewTracker from './WorkViewTracker';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllWorkSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const work = getWorkBySlug(slug);
  if (!work) return {};
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://scone-media.netlify.app';
  return {
    title: `${work.title} — ${work.author_name}`,
    description: `${work.author_name}による${work.title}。${work.anthology}収録作。`,
    openGraph: {
      title: work.title,
      description: `${work.author_name}による収録作`,
      url: `${siteUrl}/works/${work.slug}`,
    },
    alternates: { canonical: `/works/${work.slug}` },
  };
}

export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params;
  const work = getWorkBySlug(slug);
  if (!work) notFound();

  const anthology = getAnthologyBySlug(work.anthology);
  const relatedArticles = getRelatedArticles(work.tags, slug, 3);

  // 同じアンソロジーの前後の作品
  const allWorks = getAllWorks().filter((w) => w.anthology === work.anthology);
  const currentIndex = allWorks.findIndex((w) => w.slug === work.slug);
  const prevWork = currentIndex > 0 ? allWorks[currentIndex - 1] : null;
  const nextWork = currentIndex < allWorks.length - 1 ? allWorks[currentIndex + 1] : null;

  const publishedDate = new Date(work.published_at).toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://scone-media.netlify.app';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: work.title,
    author: { '@type': 'Person', name: work.author_name },
    datePublished: work.published_at,
    url: `${siteUrl}/works/${work.slug}`,
    keywords: work.tags.join(', '),
    ...(anthology && {
      isPartOf: {
        '@type': 'CreativeWorkSeries',
        name: anthology.title,
        url: `${siteUrl}/anthologies/${anthology.slug}`,
      },
    }),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <WorkViewTracker slug={work.slug} anthologySlug={work.anthology} format={work.format} />
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* パンくず */}
        <div className="mb-6">
          <Breadcrumb items={[
            { label: 'アンソロジー企画一覧', href: '/anthologies' },
            anthology ? { label: anthology.title, href: `/anthologies/${anthology.slug}` } : { label: work.anthology },
            { label: work.title },
          ]} />
        </div>

        {/* 所属企画バナー（最重要導線） */}
        {anthology && (
          <Link
            href={`/anthologies/${anthology.slug}`}
            className="flex items-center gap-3 p-4 bg-[#F5E6D3] rounded-xl mb-8 hover:bg-[#E8D5C0] transition-colors"
            aria-label={`所属アンソロジー: ${anthology.title}`}
          >
            <span className="text-2xl" aria-hidden="true">📖</span>
            <div>
              <p className="text-xs text-[#A0826D] mb-0.5">所属アンソロジー</p>
              <p className="text-sm font-bold text-[#5C3317]">{anthology.title}</p>
              <p className="text-xs text-[#8B7355]">{anthology.theme}</p>
            </div>
            <span className="ml-auto text-[#A0826D] text-sm">→</span>
          </Link>
        )}

        {/* 作品ヘッダー */}
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#2C1810] font-serif mb-4 leading-tight">
            {work.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <p className="text-base text-[#5C3317] font-medium">{work.author_name}</p>
            {work.author_bio && (
              <p className="text-sm text-[#8B7355]">— {work.author_bio}</p>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-[#8B7355] mb-4">
            <time dateTime={work.published_at}>{publishedDate}</time>
            {work.word_count && <span>{work.word_count.toLocaleString()}字</span>}
          </div>
          <TagList tags={work.tags} sourcePageType="work" size="sm" />
        </header>

        {/* 本文（全文） */}
        <article className="prose-scone max-w-none mb-12">
          <div className="text-[#2C1810] leading-loose">
            <MDXRemote source={work.body} />
          </div>
        </article>

        {/* 前後の収録作ナビゲーション */}
        {(prevWork || nextWork) && (
          <nav aria-label="前後の収録作" className="flex gap-4 my-10 py-6 border-y border-[#E8D5C0]">
            {prevWork ? (
              <Link href={`/works/${prevWork.slug}`} className="flex-1 p-4 bg-[#FAF3EC] rounded-xl hover:bg-[#F5E6D3] transition-colors">
                <p className="text-xs text-[#A0826D] mb-1">← 前の収録作</p>
                <p className="text-sm font-bold text-[#2C1810] line-clamp-2 font-serif">{prevWork.title}</p>
              </Link>
            ) : <div className="flex-1" />}
            {nextWork && (
              <Link href={`/works/${nextWork.slug}`} className="flex-1 p-4 bg-[#FAF3EC] rounded-xl hover:bg-[#F5E6D3] transition-colors text-right">
                <p className="text-xs text-[#A0826D] mb-1">次の収録作 →</p>
                <p className="text-sm font-bold text-[#2C1810] line-clamp-2 font-serif">{nextWork.title}</p>
              </Link>
            )}
          </nav>
        )}

        {/* 関連記事 */}
        <RelatedArticles articles={relatedArticles} sourcePageType="work" />
      </div>
    </>
  );
}
