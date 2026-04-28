import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getAllAnthologies } from '@/lib/content';
import { getAllTags } from '@/lib/tags';
import AnthologyCard from '@/components/cards/AnthologyCard';
import AnthologyListClient from './AnthologyListClient';

export const metadata: Metadata = {
  title: 'アンソロジー企画一覧',
  description: 'スコーン・ポータルのアンソロジー企画一覧。テーマで束ねた作品集を探す。',
  alternates: { canonical: '/anthologies' },
};

export default function AnthologiesPage() {
  const anthologies = getAllAnthologies();
  const allTags = [...new Set(anthologies.flatMap((a) => a.tags))];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2C1810] font-serif mb-2">アンソロジー企画</h1>
        <p className="text-[#8B7355]">テーマで束ねた作品集。{anthologies.length}企画掲載中。</p>
      </div>
      <Suspense fallback={
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {anthologies.slice(0, 6).map((a) => <AnthologyCard key={a.slug} anthology={a} />)}
        </div>
      }>
        <AnthologyListClient anthologies={anthologies} allTags={allTags} />
      </Suspense>
    </div>
  );
}
