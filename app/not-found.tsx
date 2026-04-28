import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ページが見つかりません',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <p className="text-6xl mb-6" aria-hidden="true">🍞</p>
      <h1 className="text-3xl font-bold text-[#2C1810] font-serif mb-4">
        404 — ページが見つかりません
      </h1>
      <p className="text-[#8B7355] mb-8 leading-relaxed">
        お探しのページは移動・削除されたか、URLが正しくない可能性があります。
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="px-6 py-3 bg-[#A0826D] text-white rounded-full font-medium hover:bg-[#8B4513] transition-colors"
        >
          トップページへ
        </Link>
        <Link
          href="/anthologies"
          className="px-6 py-3 border border-[#A0826D] text-[#8B4513] rounded-full font-medium hover:bg-[#F5E6D3] transition-colors"
        >
          アンソロジーを探す
        </Link>
      </div>
    </div>
  );
}
