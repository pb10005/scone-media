'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import type { Anthology } from '@/types/content';
import AnthologyCard from '@/components/cards/AnthologyCard';
import TagFilter from '@/components/TagFilter';
import Pagination from '@/components/Pagination';

const ITEMS_PER_PAGE = 12;

interface Props {
  anthologies: Anthology[];
  allTags: string[];
}

export default function AnthologyListClient({ anthologies, allTags }: Props) {
  const searchParams = useSearchParams();
  const selectedTag = searchParams.get('tag') ?? undefined;
  const currentPage = Number(searchParams.get('page') ?? '1');

  const filtered = useMemo(() => {
    if (!selectedTag) return anthologies;
    return anthologies.filter((a) => a.tags.includes(selectedTag));
  }, [anthologies, selectedTag]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const searchParamsObj: Record<string, string> = selectedTag ? { tag: selectedTag } : {};

  return (
    <div>
      {/* タグフィルター */}
      <div className="mb-6">
        <TagFilter tags={allTags} selectedTag={selectedTag} basePath="/anthologies" />
      </div>

      {/* 件数 */}
      <p className="text-sm text-[#8B7355] mb-4">
        {filtered.length}件
        {selectedTag && <span>（「{selectedTag}」でフィルター中）</span>}
      </p>

      {/* 一覧 */}
      {paginated.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.map((anthology) => (
            <AnthologyCard key={anthology.slug} anthology={anthology} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-[#8B7355]">
          該当するアンソロジーが見つかりませんでした。
        </div>
      )}

      {/* ページネーション */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/anthologies"
        searchParams={searchParamsObj}
      />
    </div>
  );
}
