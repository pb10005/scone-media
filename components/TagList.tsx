'use client';

import Link from 'next/link';
import { trackTagClick } from '@/lib/analytics';

interface TagListProps {
  tags: string[];
  sourcePageType?: string;
  size?: 'sm' | 'md';
}

export default function TagList({ tags, sourcePageType = 'unknown', size = 'sm' }: TagListProps) {
  const sizeClass = size === 'md'
    ? 'text-sm px-3 py-1'
    : 'text-xs px-2 py-0.5';

  return (
    <div className="flex flex-wrap gap-2" role="list" aria-label="タグ一覧">
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/tags/${encodeURIComponent(tag)}`}
          role="listitem"
          onClick={() => trackTagClick(tag, '', sourcePageType)}
          className={`${sizeClass} bg-[#F5E6D3] text-[#8B4513] rounded-full hover:bg-[#E8D5C0] hover:text-[#5C3317] transition-colors`}
        >
          #{tag}
        </Link>
      ))}
    </div>
  );
}
