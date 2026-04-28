import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllAnthologies, getAllWorks } from '@/lib/content';
import WorkCard from '@/components/cards/WorkCard';

export const metadata: Metadata = {
  title: '収録作一覧',
  description: 'スコーン・ポータルに掲載された全収録作の一覧。',
  alternates: { canonical: '/works' },
};

export default function WorksPage() {
  const anthologies = getAllAnthologies();
  const works = getAllWorks();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2C1810] font-serif mb-2">収録作一覧</h1>
        <p className="text-[#8B7355]">全{works.length}作品。アンソロジー企画に収録された作品をお読みいただけます。</p>
      </div>

      {anthologies.map((anthology) => {
        const anthologyWorks = works.filter((w) => w.anthology === anthology.slug);
        if (anthologyWorks.length === 0) return null;
        return (
          <section key={anthology.slug} className="mb-12" aria-labelledby={`anthology-${anthology.slug}`}>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E8D5C0]">
              <h2 id={`anthology-${anthology.slug}`} className="text-xl font-bold text-[#2C1810] font-serif">
                {anthology.title}
              </h2>
              <Link
                href={`/anthologies/${anthology.slug}`}
                className="text-sm text-[#A0826D] hover:text-[#8B4513] transition-colors"
              >
                企画詳細 →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {anthologyWorks.map((work) => (
                <WorkCard key={work.slug} work={work} />
              ))}
            </div>
          </section>
        );
      })}

      {works.length === 0 && (
        <div className="text-center py-12 text-[#8B7355]">
          収録作を準備中です。
        </div>
      )}
    </div>
  );
}
