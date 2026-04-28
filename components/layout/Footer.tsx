import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#F5E6D3] border-t border-[#E8D5C0] mt-16">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* ブランド */}
          <div>
            <Link
              href="/"
              className="flex items-center gap-2 font-serif text-lg font-bold text-[#5C3317] hover:text-[#8B4513] transition-colors mb-3"
            >
              <span aria-hidden="true">🍞</span>
              <span>スコーン・ポータル</span>
            </Link>
            <p className="text-sm text-[#8B7355] leading-relaxed">
              スコーンのある場所と、<br />
              その場所で生まれた言葉を届けるメディア。
            </p>
          </div>

          {/* コンテンツリンク */}
          <div>
            <h3 className="text-sm font-semibold text-[#5C3317] mb-3">コンテンツ</h3>
            <ul className="space-y-2">
              {[
                { label: 'アンソロジー企画', href: '/anthologies' },
                { label: '収録作', href: '/works' },
                { label: '記事', href: '/articles' },
                { label: 'スポット', href: '/spots' },
                { label: 'タグ一覧', href: '/tags' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#8B7355] hover:text-[#8B4513] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* サイト情報 */}
          <div>
            <h3 className="text-sm font-semibold text-[#5C3317] mb-3">サイト情報</h3>
            <ul className="space-y-2">
              {[
                { label: 'このサイトについて', href: '/about' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#8B7355] hover:text-[#8B4513] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 著作権 */}
        <div className="border-t border-[#D4B896] pt-6 text-center">
          <p className="text-xs text-[#8B7355]">
            © {currentYear} スコーン・ポータル. All rights reserved.
          </p>
          <p className="text-xs text-[#A0826D] mt-1">
            掲載作品はAIが生成したコンテンツを含みます。
          </p>
        </div>
      </div>
    </footer>
  );
}
