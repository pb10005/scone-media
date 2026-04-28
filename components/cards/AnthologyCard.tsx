import Link from 'next/link';
import Image from 'next/image';
import type { Anthology } from '@/types/content';

interface AnthologyCardProps {
  anthology: Anthology;
}

export default function AnthologyCard({ anthology }: AnthologyCardProps) {
  const workCount = anthology.works?.length ?? 0;

  return (
    <article className="group bg-white rounded-xl border border-[#E8D5C0] overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/anthologies/${anthology.slug}`} className="block">
        {/* 表紙画像 */}
        <div className="relative aspect-[16/9] bg-[#F5E6D3] overflow-hidden">
          {anthology.cover_image ? (
            <Image
              src={anthology.cover_image}
              alt={`${anthology.title}の表紙`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-4xl text-[#D4B896]">
              📖
            </div>
          )}
        </div>

        {/* テキスト */}
        <div className="p-4">
          {/* テーマ */}
          <p className="text-xs text-[#A0826D] font-medium mb-1">{anthology.theme}</p>

          {/* タイトル */}
          <h3 className="text-base font-bold text-[#2C1810] mb-2 line-clamp-2 group-hover:text-[#8B4513] transition-colors font-serif">
            {anthology.title}
          </h3>

          {/* 概要 */}
          <p className="text-sm text-[#5C3317] line-clamp-2 mb-3 leading-relaxed">
            {anthology.description}
          </p>

          {/* タグ・収録作数 */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1">
              {anthology.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-[#F5E6D3] text-[#8B4513] px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <span className="text-xs text-[#8B7355] shrink-0">
              {workCount}作品
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
