'use client';

import Link from 'next/link';
import { trackRelatedAnthologyClick, trackRelatedArticleClick, trackRelatedWorkClick } from '@/lib/analytics';
import type { Anthology, Article, Work } from '@/types/content';

interface RelatedAnthologiesProps {
  anthologies: Anthology[];
  sourcePageType: string;
}

export function RelatedAnthologies({ anthologies, sourcePageType }: RelatedAnthologiesProps) {
  if (anthologies.length === 0) return null;
  return (
    <section aria-labelledby="related-anthologies-heading" className="mt-8 pt-8 border-t border-[#E8D5C0]">
      <h2 id="related-anthologies-heading" className="text-lg font-bold text-[#5C3317] mb-4">
        関連アンソロジー
      </h2>
      <div className="space-y-3">
        {anthologies.map((anthology) => (
          <Link
            key={anthology.slug}
            href={`/anthologies/${anthology.slug}`}
            onClick={() => trackRelatedAnthologyClick(anthology.slug, sourcePageType)}
            className="flex items-start gap-3 p-3 bg-[#FAF3EC] rounded-lg hover:bg-[#F5E6D3] transition-colors"
          >
            <span className="text-xl shrink-0 mt-0.5" aria-hidden="true">📖</span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#2C1810] line-clamp-1">{anthology.title}</p>
              <p className="text-xs text-[#8B7355] mt-0.5 line-clamp-1">{anthology.theme}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

interface RelatedArticlesProps {
  articles: Article[];
  sourcePageType: string;
}

export function RelatedArticles({ articles, sourcePageType }: RelatedArticlesProps) {
  if (articles.length === 0) return null;
  return (
    <section aria-labelledby="related-articles-heading" className="mt-8 pt-8 border-t border-[#E8D5C0]">
      <h2 id="related-articles-heading" className="text-lg font-bold text-[#5C3317] mb-4">
        関連記事
      </h2>
      <div className="space-y-3">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/articles/${article.slug}`}
            onClick={() => trackRelatedArticleClick(article.slug, sourcePageType)}
            className="flex items-start gap-3 p-3 bg-[#FAF3EC] rounded-lg hover:bg-[#F5E6D3] transition-colors"
          >
            <span className="text-xl shrink-0 mt-0.5" aria-hidden="true">✍️</span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#2C1810] line-clamp-2">{article.title}</p>
              <p className="text-xs text-[#8B7355] mt-0.5 line-clamp-1">{article.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

interface RelatedWorksProps {
  works: Work[];
  sourcePageType: string;
}

export function RelatedWorks({ works, sourcePageType }: RelatedWorksProps) {
  if (works.length === 0) return null;
  return (
    <section aria-labelledby="related-works-heading" className="mt-8 pt-8 border-t border-[#E8D5C0]">
      <h2 id="related-works-heading" className="text-lg font-bold text-[#5C3317] mb-4">
        関連収録作
      </h2>
      <div className="space-y-3">
        {works.map((work) => (
          <Link
            key={work.slug}
            href={`/works/${work.slug}`}
            onClick={() => trackRelatedWorkClick(work.slug, sourcePageType)}
            className="flex items-start gap-3 p-3 bg-[#FAF3EC] rounded-lg hover:bg-[#F5E6D3] transition-colors"
          >
            <span className="text-xl shrink-0 mt-0.5" aria-hidden="true">📝</span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#2C1810] line-clamp-1">{work.title}</p>
              <p className="text-xs text-[#8B7355] mt-0.5">{work.author_name}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
