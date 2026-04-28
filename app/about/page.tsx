import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'このサイトについて',
  description: 'スコーン・ポータルのブランドステートメント・運営方針・コンテンツポリシー。',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-[#2C1810] font-serif mb-4">このサイトについて</h1>
        <p className="text-xl text-[#5C3317] leading-relaxed">
          スコーンのある場所と、そこで生まれた言葉を届けるメディア。
        </p>
      </header>

      <section className="prose max-w-none space-y-8 text-[#2C1810]">
        <div>
          <h2 className="text-2xl font-bold text-[#5C3317] font-serif mb-4">スコーン・ポータルとは</h2>
          <p className="leading-relaxed mb-4">
            スコーン・ポータルは、アンソロジー企画を軸に、収録作・関連記事・スポットを横断して回遊できる文芸ポータルサイトです。
          </p>
          <p className="leading-relaxed mb-4">
            テーマを定めた作品集（アンソロジー）を中心に、スコーンを楽しめるカフェや読書に適した公園など、
            文学と場所をつなぐコンテンツをお届けします。
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#5C3317] font-serif mb-4">コンテンツについて</h2>
          <p className="leading-relaxed mb-4">
            掲載している収録作（小説・詩・エッセイ等）の多くは、AIが生成したコンテンツを含みます。
            編集部が内容を確認・整形した上で掲載しています。
          </p>
          <p className="leading-relaxed mb-4">
            スポット情報（カフェ・公園等）は実際に取材した情報をもとに作成しています。
            掲載情報は取材時点のものであり、最新情報は各施設にご確認ください。
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#5C3317] font-serif mb-4">画像・著作権について</h2>
          <p className="leading-relaxed mb-4">
            使用している画像は、施設の許可を取得した写真、CC0・CC BY ライセンスの素材、
            またはAIが生成した画像です。各コンテンツの画像ライセンス情報は内部で管理しています。
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#5C3317] font-serif mb-4">アクセス解析について</h2>
          <p className="leading-relaxed mb-4">
            このサイトでは、Google Analytics 4（GA4）を使用してアクセス解析を行っています。
            計測は、Cookieの利用に同意いただいた場合のみ実施します。
            同意の設定はいつでも変更できます。
          </p>
          <p className="leading-relaxed">
            Google Analytics のデータ収集・処理については、
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#8B4513] underline ml-1">
              Googleのプライバシーポリシー
            </a>
            をご確認ください。
          </p>
        </div>

        <div className="pt-4 border-t border-[#E8D5C0]">
          <p className="text-[#8B7355] text-sm">
            お問い合わせは
            <Link href="/about" className="text-[#8B4513] underline ml-1">
              このページ
            </Link>
            をご参照ください。（寄稿・取材依頼はPhase2でフォームを設置予定です）
          </p>
        </div>
      </section>
    </div>
  );
}
