'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface TagFilterProps {
  tags: string[];
  selectedTag?: string;
  basePath: string;
}

export default function TagFilter({ tags, selectedTag, basePath }: TagFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTagClick = useCallback(
    (tag: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (selectedTag === tag) {
        params.delete('tag');
      } else {
        params.set('tag', tag);
      }
      // ページ変更時はページを1に戻す
      params.delete('page');
      router.push(`${basePath}?${params.toString()}`);
    },
    [selectedTag, basePath, router, searchParams],
  );

  const handleClear = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('tag');
    params.delete('page');
    router.push(`${basePath}?${params.toString()}`);
  }, [basePath, router, searchParams]);

  return (
    <div className="flex flex-wrap gap-2 items-center" role="group" aria-label="タグフィルター">
      <button
        onClick={handleClear}
        className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
          !selectedTag
            ? 'bg-[#A0826D] text-white border-[#A0826D]'
            : 'bg-white text-[#8B7355] border-[#E8D5C0] hover:border-[#A0826D] hover:text-[#8B4513]'
        }`}
        aria-pressed={!selectedTag}
      >
        すべて
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => handleTagClick(tag)}
          className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
            selectedTag === tag
              ? 'bg-[#A0826D] text-white border-[#A0826D]'
              : 'bg-white text-[#8B7355] border-[#E8D5C0] hover:border-[#A0826D] hover:text-[#8B4513]'
          }`}
          aria-pressed={selectedTag === tag}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
