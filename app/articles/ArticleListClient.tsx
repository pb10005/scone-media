'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import type { Article } from '@/types/content';
import ArticleCard from '@/components/cards/ArticleCard';
import TagFilter from '@/components/TagFilter';
import Pagination from '@/components/Pagination';

const ITEMS_PER_PAGE = 12;

interface Props {
  articles: Article[];
  allTags: string[];
}

export default function ArticleListClient({ articles, allTags }: Props) {
  const searchParams = useSearchParams();
  const selectedTag = searchParams.get('tag') ?? undefined;
  const currentPage = Number(searchParams.get('page') ?? '1');

  const filtered = useMemo(() => {
    if (!selectedTag) return articles;
    return articles.filter((a) => a.tags.includes(selectedTag));
  }, [articles, selectedTag]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const searchParamsObj: Record<string, string> = selectedTag ? { tag: selectedTag } : {};

  return (
    <div>
      <div className="mb-6">
        <TagFilter tags={allTags} selectedTag={selectedTag} basePath="/articles" />
      </div>
      <p className="text-sm text-[#8B7355] mb-4">
        {filtered.length}件{selectedTag && <span>（「{selectedTag}」でフィルター中）</span>}
      </p>
      {paginated.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-[#8B7355]">該当する記事が見つかりませんでした。</div>
      )}
      <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/articles" searchParams={searchParamsObj} />
    </div>
  );
}
