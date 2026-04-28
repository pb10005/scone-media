'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useMemo, useCallback } from 'react';
import type { Spot, SpotType } from '@/types/content';
import SpotCard from '@/components/cards/SpotCard';

const SPOT_TYPE_LABELS: Record<SpotType, string> = {
  cafe: 'カフェ',
  bakery: 'ベーカリー',
  park: '公園',
  library: '図書館',
  other: 'その他',
};

interface Props {
  spots: Spot[];
  areas: string[];
  spotTypes: string[];
}

export default function SpotListClient({ spots, areas, spotTypes }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedArea = searchParams.get('area') ?? '';
  const selectedType = searchParams.get('type') ?? '';

  const filtered = useMemo(() => {
    return spots.filter((s) => {
      if (selectedArea && s.area !== selectedArea) return false;
      if (selectedType && s.spot_type !== selectedType) return false;
      return true;
    });
  }, [spots, selectedArea, selectedType]);

  const setFilter = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) { params.set(key, value); } else { params.delete(key); }
    router.push(`/spots?${params.toString()}`);
  }, [searchParams, router]);

  return (
    <div>
      {/* フィルター */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={selectedArea}
          onChange={(e) => setFilter('area', e.target.value)}
          className="text-sm border border-[#E8D5C0] rounded-lg px-3 py-2 text-[#5C3317] bg-white focus:border-[#A0826D] outline-none"
          aria-label="エリアで絞り込み"
        >
          <option value="">すべてのエリア</option>
          {areas.map((area) => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>
        <select
          value={selectedType}
          onChange={(e) => setFilter('type', e.target.value)}
          className="text-sm border border-[#E8D5C0] rounded-lg px-3 py-2 text-[#5C3317] bg-white focus:border-[#A0826D] outline-none"
          aria-label="種別で絞り込み"
        >
          <option value="">すべての種別</option>
          {spotTypes.map((type) => (
            <option key={type} value={type}>{SPOT_TYPE_LABELS[type as SpotType] ?? type}</option>
          ))}
        </select>
      </div>
      <p className="text-sm text-[#8B7355] mb-4">{filtered.length}件</p>
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((spot) => <SpotCard key={spot.slug} spot={spot} />)}
        </div>
      ) : (
        <div className="text-center py-12 text-[#8B7355]">該当するスポットが見つかりませんでした。</div>
      )}
    </div>
  );
}
