import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, ExternalLink } from 'lucide-react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllSpotSlugs, getSpotBySlug } from '@/lib/content';
import Breadcrumb from '@/components/layout/Breadcrumb';
import TagList from '@/components/TagList';
import SpotViewTracker from './SpotViewTracker';

const PRICE_LABELS: Record<string, string> = { free: '無料', low: '〜¥500', mid: '¥500〜¥1,500', high: '¥1,500〜' };
const TYPE_LABELS: Record<string, string> = { cafe: 'カフェ', bakery: 'ベーカリー', park: '公園', library: '図書館', other: 'その他' };

interface Props { params: Promise<{ slug: string }>; }

export async function generateStaticParams() {
  return getAllSpotSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const spot = getSpotBySlug(slug);
  if (!spot) return {};
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://scone-media.netlify.app';
  return {
    title: spot.title,
    description: spot.description,
    openGraph: { title: spot.title, description: spot.description, url: `${siteUrl}/spots/${slug}`, images: spot.cover_image ? [{ url: spot.cover_image }] : [] },
    alternates: { canonical: `/spots/${slug}` },
  };
}

export default async function SpotDetailPage({ params }: Props) {
  const { slug } = await params;
  const spot = getSpotBySlug(slug);
  if (!spot) notFound();

  const visitedDate = new Date(spot.visited_at).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
      <SpotViewTracker slug={spot.slug} />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumb items={[{ label: 'スポット一覧', href: '/spots' }, { label: spot.title }]} />
        </div>
        {spot.cover_image && (
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-6 bg-[#F5E6D3]">
            <Image src={spot.cover_image} alt={spot.title} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 768px" />
          </div>
        )}
        {spot.gallery_images && spot.gallery_images.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-6">
            {spot.gallery_images.map((img, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-[#F5E6D3]">
                <Image src={img} alt={`${spot.title} ${i + 1}`} fill className="object-cover" sizes="33vw" />
              </div>
            ))}
          </div>
        )}
        <header className="mb-8">
          <span className="text-xs bg-[#F5E6D3] text-[#8B4513] px-2 py-0.5 rounded-full">{TYPE_LABELS[spot.spot_type] ?? spot.spot_type}</span>
          <h1 className="text-3xl font-bold text-[#2C1810] mt-2 mb-3">{spot.title}</h1>
          <p className="flex items-center gap-1.5 text-[#8B7355] mb-4"><MapPin size={16} className="text-[#A0826D]" aria-hidden="true" />{spot.area}</p>
          <TagList tags={spot.tags} sourcePageType="spot" size="sm" />
        </header>
        <div className="prose-scone max-w-none mb-8">
          <div className="text-[#2C1810] leading-loose">
            <MDXRemote source={spot.body || spot.description} />
          </div>
        </div>
        <div className="bg-[#FAF3EC] rounded-xl p-6 mb-6 space-y-3">
          <h2 className="text-lg font-bold text-[#5C3317] mb-4">スポット情報</h2>
          <div className="flex items-start gap-3">
            <MapPin size={16} className="text-[#A0826D] mt-0.5 shrink-0" />
            <div><p className="text-xs text-[#8B7355] mb-0.5">住所</p><p className="text-sm text-[#2C1810]">{spot.address}</p></div>
          </div>
          {spot.access && (
            <div className="flex items-start gap-3">
              <span className="text-[#A0826D] mt-0.5 shrink-0">🚃</span>
              <div><p className="text-xs text-[#8B7355] mb-0.5">アクセス</p><p className="text-sm text-[#2C1810]">{spot.access}</p></div>
            </div>
          )}
          {spot.business_hours && (
            <div className="flex items-start gap-3">
              <Clock size={16} className="text-[#A0826D] mt-0.5 shrink-0" />
              <div><p className="text-xs text-[#8B7355] mb-0.5">営業時間</p><p className="text-sm text-[#2C1810]">{spot.business_hours}</p></div>
            </div>
          )}
          {spot.price_range && (
            <div className="flex items-start gap-3">
              <span className="text-[#A0826D] mt-0.5 shrink-0">💴</span>
              <div><p className="text-xs text-[#8B7355] mb-0.5">価格帯</p><p className="text-sm text-[#2C1810]">{PRICE_LABELS[spot.price_range]}</p></div>
            </div>
          )}
          {spot.map_url && (
            <Link href={spot.map_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-[#8B4513] hover:text-[#5C3317] pt-2">
              <ExternalLink size={14} />Google Mapsで見る
            </Link>
          )}
        </div>
        <p className="text-xs text-[#8B7355] text-right">取材日：{visitedDate}（情報は取材時点のものです）</p>
        <div className="mt-8"><Link href="/spots" className="text-sm text-[#A0826D] hover:text-[#8B4513] transition-colors">← スポット一覧へ</Link></div>
      </div>
    </>
  );
}
