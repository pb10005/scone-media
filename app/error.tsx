'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <p className="text-6xl mb-6" aria-hidden="true">🍞</p>
      <h1 className="text-3xl font-bold text-[#2C1810] font-serif mb-4">
        エラーが発生しました
      </h1>
      <p className="text-[#8B7355] mb-8 leading-relaxed">
        予期しないエラーが発生しました。<br />
        ページを再読み込みするか、トップページへお戻りください。
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-[#A0826D] text-white rounded-full font-medium hover:bg-[#8B4513] transition-colors"
        >
          再読み込み
        </button>
        <Link
          href="/"
          className="px-6 py-3 border border-[#A0826D] text-[#8B4513] rounded-full font-medium hover:bg-[#F5E6D3] transition-colors"
        >
          トップページへ
        </Link>
      </div>
    </div>
  );
}
