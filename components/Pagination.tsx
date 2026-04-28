'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string>;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  searchParams = {},
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildHref = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', String(page));
    }
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="ページネーション" className="flex items-center justify-center gap-2 mt-8">
      {/* 前ページ */}
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          className="p-2 rounded-lg border border-[#E8D5C0] text-[#8B7355] hover:border-[#A0826D] hover:text-[#8B4513] transition-colors"
          aria-label="前のページ"
        >
          <ChevronLeft size={18} />
        </Link>
      ) : (
        <span className="p-2 rounded-lg border border-[#E8D5C0] text-[#D4B896] cursor-not-allowed">
          <ChevronLeft size={18} />
        </span>
      )}

      {/* ページ番号 */}
      {pages.map((page) => (
        <Link
          key={page}
          href={buildHref(page)}
          className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
            page === currentPage
              ? 'bg-[#A0826D] text-white'
              : 'border border-[#E8D5C0] text-[#8B7355] hover:border-[#A0826D] hover:text-[#8B4513]'
          }`}
          aria-label={`${page}ページ`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </Link>
      ))}

      {/* 次ページ */}
      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1)}
          className="p-2 rounded-lg border border-[#E8D5C0] text-[#8B7355] hover:border-[#A0826D] hover:text-[#8B4513] transition-colors"
          aria-label="次のページ"
        >
          <ChevronRight size={18} />
        </Link>
      ) : (
        <span className="p-2 rounded-lg border border-[#E8D5C0] text-[#D4B896] cursor-not-allowed">
          <ChevronRight size={18} />
        </span>
      )}
    </nav>
  );
}
