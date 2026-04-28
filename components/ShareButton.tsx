'use client';

import { Share2, Twitter } from 'lucide-react';
import { trackShareClick } from '@/lib/analytics';

interface ShareButtonProps {
  title: string;
  url: string;
  contentType: string;
  contentSlug: string;
}

export default function ShareButton({ title, url, contentType, contentSlug }: ShareButtonProps) {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;

  const handleShare = async () => {
    trackShareClick('native', contentType, contentSlug);
    if (navigator.share) {
      await navigator.share({ title, url });
    }
  };

  const handleTwitterShare = () => {
    trackShareClick('twitter', contentType, contentSlug);
    window.open(twitterUrl, '_blank', 'noopener,noreferrer,width=550,height=420');
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-[#8B7355]">シェア：</span>

      {/* Twitter/Xシェア */}
      <button
        onClick={handleTwitterShare}
        className="flex items-center gap-1.5 text-sm bg-[#F5E6D3] text-[#8B4513] px-3 py-1.5 rounded-full hover:bg-[#E8D5C0] transition-colors"
        aria-label="X(Twitter)でシェア"
      >
        <Twitter size={14} aria-hidden="true" />
        <span>X</span>
      </button>

      {/* Web Share API（モバイル） */}
      {typeof navigator !== 'undefined' && 'share' in navigator && (
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 text-sm bg-[#F5E6D3] text-[#8B4513] px-3 py-1.5 rounded-full hover:bg-[#E8D5C0] transition-colors"
          aria-label="その他の方法でシェア"
        >
          <Share2 size={14} aria-hidden="true" />
          <span>シェア</span>
        </button>
      )}
    </div>
  );
}
