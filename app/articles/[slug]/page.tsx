import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllArticleSlugs, getArticleBySlug, getAnthologyBySlug, getWorkBySlug } from '@/lib/content';
import Breadcrumb from '@/components/layout/Breadcrumb';
import TagList from '@/components/TagList';
import ShareButton from '@/components/ShareButton';
import { RelatedAnthologies, RelatedWorks } from '@/components/RelatedContent';
import ArticleViewTracker from './ArticleViewTracker';
import type { Anthology, Work } from '@/types/content';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://scone-media.netlify.app';
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `${siteUrl}/articles/${article.slug}`,
      images: article.cover_image ? [{ url: article.cover_image, width: 1200, height: 630 }] : [],
    },
    alternates: { canonical: `/articles/${article.slug}` },
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();
  // notFound()がthrowするため以降のarticleはnon-null
  const articleData = article!;

  const relatedAnthologies = (articleData.related_anthologies ?? [])
    .map((s) => getAnthologyBySlug(s))
    .filter((a): a is Anthology => a !== null);

  const relatedWorks = (article.related_works ?? [])
    .map((s) => getWorkBySlug(s))
    .filter((w): w is Work => w !== null);

  const publishedDate = new Date(article.published_at).toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://scone-media.netlify.app';
  const pageUrl = `${siteUrl}/articles/${article.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    author: { '@type': 'Person', name: article.author_name },
    datePublished: article.published_at,
    url: pageUrl,
    keywords: article.tags.join(', '),
    publisher: {
      '@type': 'Organization',
      name: 'SCONE MEDIA',
      url: siteUrl,
    },
    ...(article.cover_image && { image: article.cover_image }),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticleViewTracker slug={article.slug} articleType={article.article_type} tags={article.tags} />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumb items={[
            { label: '記事一覧', href: '/articles' },
            { label: article.title },
          ]} />
        </div>

        {article.cover_image && (
          <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-6 bg-[#F5E6D3]">
            <Image src={article.cover_image} alt={article.title} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 768px" />
          </div>
        )}

        <header className="mb-8">
          <h1 className="text-3xl font-bold text-[#2C1810] font-serif mb-4 leading-tight">{article.title}</h1>
          <div className="flex items-center gap-4 text-sm text-[#8B7355] mb-4">
            <span>{article.author_name}</span>
            <time dateTime={article.published_at}>{publishedDate}</time>
          </div>
          <TagList tags={article.tags} sourcePageType="article" size="sm" />
        </header>

        <article className="prose-scone max-w-none mb-10">
          <div className="text-[#2C1810] leading-loose">
            <MDXRemote source={article.body} />
          </div>
        </article>

        <div className="border-t border-[#E8D5C0] pt-6 mb-6">
          <ShareButton title={article.title} url={pageUrl} contentType="article" contentSlug={article.slug} />
        </div>

        <RelatedAnthologies anthologies={relatedAnthologies} sourcePageType="article" />
        <RelatedWorks works={relatedWorks} sourcePageType="article" />
      </div>
    </>
  );
}
