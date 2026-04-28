'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleGrant = () => {
    localStorage.setItem('cookie_consent', 'granted');
    setVisible(false);
    window.dispatchEvent(new Event('cookie_consent_granted'));
  };

  const handleDeny = () => {
    localStorage.setItem('cookie_consent', 'denied');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie同意バナー"
      aria-live="polite"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E8D5C0] shadow-lg p-4 md:p-6"
    >
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4">
        <p className="text-sm text-[#5C3317] flex-1">
          このサイトはGoogle Analytics 4（GA4）を使用してアクセス解析を行っています。
          Cookieの利用に同意いただける場合は「同意する」をクリックしてください。
          詳しくは
          <Link href="/about" className="underline hover:text-[#8B4513] ml-1">
            このサイトについて
          </Link>
          をご覧ください。
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={handleDeny}
            className="px-4 py-2 text-sm border border-[#A0826D] text-[#A0826D] rounded hover:bg-[#F5E6D3] transition-colors"
          >
            拒否する
          </button>
          <button
            onClick={handleGrant}
            className="px-4 py-2 text-sm bg-[#A0826D] text-white rounded hover:bg-[#8B4513] transition-colors"
          >
            同意する
          </button>
        </div>
      </div>
    </div>
  );
}
