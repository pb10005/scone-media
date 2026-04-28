import Link from 'next/link';
import type { Work } from '@/types/content';

const FORMAT_LABELS: Record<string, string> = {
  novel: '小説',
  poem: '詩',
  essay: 'エッセイ',
  review: '書評',
  other: 'その他',
};

interface WorkCardProps {
  work: Work;
  showAnthology?: boolean;
}

export default function WorkCard({ work, showAnthology = false }: WorkCardProps) {
  return (
    <article className="group bg-white rounded-xl border border-[#E8D5C0] p-4 hover:shadow-md transition-shadow">
      <Link href={`/works/${work.slug}`} className="block">
        {/* 形式バッジ */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs bg-[#F5E6D3] text-[#8B4513] px-2 py-0.5 rounded-full font-medium">
            {FORMAT_LABELS[work.format] ?? work.format}
          </span>
          {work.word_count && (
            <span className="text-xs text-[#A0826D]">{work.word_count.toLocaleString()}字</span>
          )}
        </div>

        {/* タイトル */}
        <h3 className="text-base font-bold text-[#2C1810] mb-1 group-hover:text-[#8B4513] transition-colors font-serif line-clamp-2">
          {work.title}
        </h3>

        {/* 著者 */}
        <p className="text-sm text-[#8B7355] mb-3">{work.author_name}</p>

        {/* 所属企画 */}
        {showAnthology && work.anthology && (
          <p className="text-xs text-[#A0826D] mb-2 truncate">
            📖 {work.anthology}
          </p>
        )}

        {/* タグ */}
        <div className="flex flex-wrap gap-1">
          {work.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-[#F5E6D3] text-[#8B4513] px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </Link>
    </article>
  );
}
