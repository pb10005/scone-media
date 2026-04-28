'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'アンソロジー', href: '/anthologies' },
  { label: '収録作', href: '/works' },
  { label: '記事', href: '/articles' },
  { label: 'スポット', href: '/spots' },
  { label: 'タグ', href: '/tags' },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#E8D5C0]">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* ロゴ */}
        <Link
          href="/"
          className="flex items-center gap-2 font-serif text-xl font-bold text-[#5C3317] hover:text-[#8B4513] transition-colors"
        >
          <span className="text-2xl" aria-hidden="true">🍞</span>
          <span>スコーン・ポータル</span>
        </Link>

        {/* デスクトップナビ */}
        <nav aria-label="メインナビゲーション" className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'text-[#8B4513] border-b-2 border-[#8B4513] pb-0.5'
                  : 'text-[#5C3317] hover:text-[#8B4513]'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/about"
            className={`text-sm transition-colors ${
              isActive('/about')
                ? 'text-[#8B4513]'
                : 'text-[#8B7355] hover:text-[#8B4513]'
            }`}
          >
            このサイトについて
          </Link>
        </nav>

        {/* モバイルメニューボタン */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-[#5C3317] hover:text-[#8B4513] transition-colors"
          aria-label={menuOpen ? 'メニューを閉じる' : 'メニューを開く'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* モバイルドロワーメニュー */}
      {menuOpen && (
        <nav
          aria-label="モバイルナビゲーション"
          className="md:hidden bg-white border-t border-[#E8D5C0] px-4 py-4 space-y-3"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`block text-base font-medium py-1 transition-colors ${
                isActive(item.href)
                  ? 'text-[#8B4513]'
                  : 'text-[#5C3317] hover:text-[#8B4513]'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/about"
            onClick={() => setMenuOpen(false)}
            className="block text-base py-1 text-[#8B7355] hover:text-[#8B4513] transition-colors"
          >
            このサイトについて
          </Link>
        </nav>
      )}
    </header>
  );
}
