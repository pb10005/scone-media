import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAllAnthologySlugs, getAnthologyBySlug, getWorksByAnthology, getRelatedAnthologies } from '@/lib/content';
import Breadcrumb from '@/components/layout/Breadcrumb';
import TagList from '@/components/TagList';
import WorkCard from '@/components/cards/WorkCard';
import AnthologyViewTracker from './AnthologyViewTracker';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllAnthologySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const anthology = getAnthologyBySlug(slug);
  if (!anthology) return {};
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://scone-media.netlify.app';
  return {
    title: anthology.title,
    description: anthology.description,
    openGraph: {
      title: anthology.title,
      description: anthology.description,
      url: `${siteUrl}/anthologies/${anthology.slug}`,
      images: anthology.cover_image ? [{ url: anthology.cover_image, width: 1200, height: 630 }] : [],
    },
    alternates: { canonical: `/anthologies/${anthology.slug}` },
  };
}

export default async function AnthologyDetailPage({ params }: Props) {
  const { slug } = await params;
  const anthology = getAnthologyBySlug(slug);
  if (!anthology) notFound();

  // notFound()の後でもTypeScriptの制御フロー解析が型を絞れないため明示的にアサート
  if (!anthology) notFound();
  const works = getWorksByAnthology(slug);
  const related = getRelatedAnthologies(anthology!.tags, slug, 3);
  const publishedDate = new Date(anthology!.published_at).toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://scone-media.netlify.app';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWorkSeries',
    name: anthology!.title,
    description: anthology!.description,
    url: `${siteUrl}/anthologies/${anthology!.slug}`,
    datePublished: anthology!.published_at,
    keywords: anthology!.tags.join(', '),
    ...(anthology!.cover_image && { image: anthology!.cover_image }),
    hasPart: works.map((w) => ({
      '@type': 'CreativeWork',
      name: w.title,
      author: { '@type': 'Person', name: w.author_name },
      url: `${siteUrl}/works/${w.slug}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AnthologyViewTracker slug={anthology.slug} tags={anthology.tags} />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumb items={[
            { label: 'アンソロジー企画一覧', href: '/anthologies' },
            { label: anthology.title },
          ]} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            {anthology.cover_image && (
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-6 bg-[#F5E6D3]">
                <Image src={anthology.cover_image} alt={`${anthology.title}の表紙`} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 66vw" />
              </div>
            )}
            <p className="text-sm text-[#A0826D] mb-2">{anthology.theme}</p>
            <h1 className="text-3xl font-bold text-[#2C1810] font-serif mb-4">{anthology.title}</h1>
            <div className="flex items-center gap-4 mb-4 text-sm text-[#8B7355]">
              <time dateTime={anthology.published_at}>{publishedDate}</time>
              <span>{works.length}作品収録</span>
            </div>
            <TagList tags={anthology.tags} sourcePageType="anthology" size="md" />
            <div className="mt-8 p-6 bg-[#FAF3EC] rounded-xl">
              <h2 className="text-lg font-bold text-[#5C3317] mb-3">企画について</h2>
              <p className="text-[#2C1810] leading-relaxed whitespace-pre-line">{anthology.description}</p>
            </div>
            {anthology.editor_note && (
              <div className="mt-6 p-6 bg-white border border-[#E8D5C0] rounded-xl">
                <h2 className="text-lg font-bold text-[#5C3317] mb-3">編集後記</h2>
                <p className="text-[#2C1810] leading-relaxed whitespace-pre-line">{anthology.editor_note}</p>
              </div>
            )}
            {works.length > 0 && (
              <section className="mt-10" aria-labelledby="works-heading">
                <h2 id="works-heading" className="text-2xl font-bold text-[#2C1810] font-serif mb-6">収録作（{works.length}作品）</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {works.map((work, index) => (
                    <div key={work.slug} className="relative">
                      <span className="absolute -top-2 -left-2 w-6 h-6 bg-[#A0826D] text-white text-xs rounded-full flex items-center justify-center z-10">{index + 1}</span>
                      <WorkCard work={work} />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
          <div className="lg:col-span-1 space-y-6">
            {related.length > 0 && (
              <div className="bg-[#FAF3EC] rounded-xl p-5">
                <h3 className="text-base font-bold text-[#5C3317] mb-4">関連アンソロジー</h3>
                <div className="space-y-3">
                  {related.map((rel) => (
                    <Link key={rel.slug} href={`/anthologies/${rel.slug}`} className="block p-3 bg-white rounded-lg border border-[#E8D5C0] hover:border-[#A0826D] transition-colors">
                      <p className="text-xs text-[#A0826D] mb-0.5">{rel.theme}</p>
                      <p className="text-sm font-bold text-[#2C1810] line-clamp-2 font-serif">{rel.title}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            <Link href="/anthologies" className="block text-center py-3 border border-[#A0826D] text-[#8B4513] rounded-xl hover:bg-[#F5E6D3] transition-colors text-sm font-medium">
              ← アンソロジー一覧へ
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
