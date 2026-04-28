import Link from 'next/link';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import type { Spot } from '@/types/content';

const SPOT_TYPE_LABELS: Record<string, string> = {
  cafe: 'カフェ',
  bakery: 'ベーカリー',
  park: '公園',
  library: '図書館',
  other: 'その他',
};

interface SpotCardProps {
  spot: Spot;
}

export default function SpotCard({ spot }: SpotCardProps) {
  return (
    <article className="group bg-white rounded-xl border border-[#E8D5C0] overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/spots/${spot.slug}`} className="block">
        {/* メイン写真 */}
        <div className="relative aspect-[4/3] bg-[#F5E6D3] overflow-hidden">
          {spot.cover_image ? (
            <Image
              src={spot.cover_image}
              alt={`${spot.title}の写真`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-4xl text-[#D4B896]">
              ☕
            </div>
          )}
          {/* 種別バッジ */}
          <div className="absolute top-2 left-2">
            <span className="text-xs bg-white/90 text-[#8B4513] px-2 py-1 rounded-full font-medium">
              {SPOT_TYPE_LABELS[spot.spot_type] ?? spot.spot_type}
            </span>
          </div>
        </div>

        <div className="p-4">
          {/* スポット名 */}
          <h3 className="text-base font-bold text-[#2C1810] mb-1 group-hover:text-[#8B4513] transition-colors line-clamp-2">
            {spot.title}
          </h3>

          {/* エリア */}
          <p className="flex items-center gap-1 text-sm text-[#8B7355] mb-2">
            <MapPin size={14} className="text-[#A0826D]" aria-hidden="true" />
            {spot.area}
          </p>

          {/* 概要 */}
          <p className="text-sm text-[#5C3317] line-clamp-2 leading-relaxed">
            {spot.description}
          </p>
        </div>
      </Link>
    </article>
  );
}
