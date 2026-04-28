import type { Metadata } from 'next';
import Link from 'next/link';
import { getTagsWithCount } from '@/lib/tags';

export const metadata: Metadata = {
  title: 'タグ一覧',
  description: 'スコーン・ポータルのコンテンツをタグで横断検索。ジャンル・テーマ・エリアから探す。',
  alternates: { canonical: '/tags' },
};

const CATEGORY_LABELS: Record<string, string> = {
  genre: 'ジャンル',
  theme: 'テーマ',
  format: '形式',
  era: '時代',
  mood: 'ムード',
};

export default function TagsPage() {
  const tags = getTagsWithCount();

  const grouped = tags.reduce<Record<string, typeof tags>>((acc, tag) => {
    const cat = tag.category ?? 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(tag);
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2C1810] font-serif mb-2">タグ一覧</h1>
        <p className="text-[#8B7355]">ジャンル・テーマ・エリアなどのタグでコンテンツを横断検索できます。</p>
      </div>

      {Object.entries(grouped).map(([category, categoryTags]) => (
        <section key={category} className="mb-10" aria-labelledby={`tag-cat-${category}`}>
          <h2 id={`tag-cat-${category}`} className="text-lg font-bold text-[#5C3317] mb-4 pb-2 border-b border-[#E8D5C0]">
            {CATEGORY_LABELS[category] ?? category}
          </h2>
          <div className="flex flex-wrap gap-3">
            {categoryTags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/tags/${encodeURIComponent(tag.name)}`}
                className="flex items-center gap-2 bg-white border border-[#E8D5C0] text-[#8B4513] px-4 py-2 rounded-full hover:bg-[#F5E6D3] hover:border-[#A0826D] transition-colors"
              >
                <span className="text-sm font-medium">#{tag.name}</span>
                {tag.count > 0 && (
                  <span className="text-xs text-[#A0826D] bg-[#F5E6D3] px-1.5 py-0.5 rounded-full">
                    {tag.count}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
