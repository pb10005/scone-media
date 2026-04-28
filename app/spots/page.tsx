import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getAllSpots } from '@/lib/content';
import SpotCard from '@/components/cards/SpotCard';
import SpotListClient from './SpotListClient';

export const metadata: Metadata = {
  title: 'スポット一覧',
  description: 'スコーンを楽しめる店舗・読書に適した公園や空間の紹介。',
  alternates: { canonical: '/spots' },
};

export default function SpotsPage() {
  const spots = getAllSpots();
  const areas = [...new Set(spots.map((s) => s.area))];
  const spotTypes = [...new Set(spots.map((s) => s.spot_type))];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2C1810] font-serif mb-2">スポット一覧</h1>
        <p className="text-[#8B7355]">スコーンのある場所、読書に適した空間。{spots.length}件掲載中。</p>
      </div>
      <Suspense fallback={
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {spots.slice(0, 6).map((s) => <SpotCard key={s.slug} spot={s} />)}
        </div>
      }>
        <SpotListClient spots={spots} areas={areas} spotTypes={spotTypes} />
      </Suspense>
    </div>
  );
}
