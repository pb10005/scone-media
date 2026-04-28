# SEO / OGP / 構造化データ 仕様

> Phase1 成果物 / 作成日: 2026-04-28  
> 目的: 検索流入・SNS流入の質を最大化する技術的SEO仕様

---

## 1. URL 設計

### 原則

1. **小文字・英数字・ハイフンのみ**（日本語URLは使わない）
2. **短く・意味が取れる**（スラッグは2〜5語程度）
3. **末尾スラッシュなし**（Next.js デフォルト `trailingSlash: false`）
4. **クエリパラメータはフィルタのみ**（コンテンツ識別はパスで）

### URL 一覧

| コンテンツ | パターン | 例 |
|---|---|---|
| トップ | `/` | `/` |
| 企画一覧 | `/anthologies` | `/anthologies?tags=短編,郷愁&page=2` |
| 企画詳細 | `/anthologies/[slug]` | `/anthologies/yoru-no-engawa` |
| 収録作一覧 | `/works` | `/works?format=novel` |
| 収録作詳細 | `/works/[slug]` | `/works/engawa-no-mushi` |
| 記事一覧 | `/articles` | `/articles?type=review` |
| 記事詳細 | `/articles/[slug]` | `/articles/yoru-no-bungaku` |
| スポット一覧 | `/spots` | `/spots?area=shibuya` |
| スポット詳細 | `/spots/[slug]` | `/spots/scone-kobo-daikanyama` |
| タグ一覧 | `/tags` | `/tags` |
| タグ別一覧 | `/tags/[tag]` | `/tags/tanpen` |
| About | `/about` | `/about` |
| 寄稿 | `/contribute` | `/contribute` |

### スラッグ命名規則

- ローマ字表記（訓令式またはヘボン式。ただし**慣用優先**：shinjuku, shibuya）
- 単語区切りはハイフン `-`
- 予約語の禁止: `api`, `_next`, `static`, `public`
- タグslugは content-types.md の `tag.slug` を使用

---

## 2. `<title>` / `<meta description>` 規則

### 基本テンプレート

| ページ種別 | `<title>` | `description` |
|---|---|---|
| トップ | `SCONE MEDIA｜夜にひらく、スコーンと物語のポータル` | サイト共通リード文（120〜160字） |
| 企画一覧 | `アンソロジー企画一覧｜SCONE MEDIA` | 「全N本のアンソロジー企画を公開中…」 |
| 企画一覧フィルタ | `[タグ名]のアンソロジー企画｜SCONE MEDIA` | 同上+タグ名を含む |
| 企画詳細 | `[企画タイトル]｜アンソロジー｜SCONE MEDIA` | `description` の冒頭160字 |
| 収録作一覧 | `収録作一覧｜SCONE MEDIA` | 固定文 |
| 収録作詳細 | `[作品タイトル]｜[著者名]｜[企画タイトル]｜SCONE MEDIA` | 本文冒頭160字（自動抽出・句読点で切る） |
| 記事一覧 | `記事｜SCONE MEDIA` | 固定文 |
| 記事詳細 | `[記事タイトル]｜SCONE MEDIA` | `excerpt` または冒頭160字 |
| スポット一覧 | `スポット｜SCONE MEDIA` | 固定文 |
| スポット詳細 | `[スポット名]｜[エリア]｜SCONE MEDIA` | `description` 160字 |
| タグ一覧 | `タグ一覧｜SCONE MEDIA` | 固定文 |
| タグ別 | `[タグ名]｜タグ｜SCONE MEDIA` | タグdescription or テンプレ |
| About | `このサイトについて｜SCONE MEDIA` | ブランドステートメント冒頭 |

### 文字数制約

- `<title>`: **60字以内**（Googleの表示幅目安）
- `description`: **80〜160字**（120字前後推奨）
- オーバー時はビルド時に警告ログ（非エラー）

### サイト名記載ルール

- 区切り文字は `｜`（全角パイプ）で統一
- サイト名は必ず末尾
- トップだけは例外（サイト名→キャッチコピー）

---

## 3. OGP / Twitter Card

### 基本メタ

```html
<meta property="og:site_name" content="SCONE MEDIA" />
<meta property="og:locale" content="ja_JP" />
<meta property="og:type" content="website" /> <!-- 記事・作品詳細は article -->
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:url" content="https://scone-media.netlify.app/..." />
<meta property="og:image" content="https://.../images/...1200x630.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="..." />
<meta name="twitter:description" content="..." />
<meta name="twitter:image" content="..." />
<!-- Xアカウント確定時に追加:
<meta name="twitter:site" content="@scone_media" /> -->
```

### `og:type` 決定表

| ページ | og:type |
|---|---|
| トップ・一覧・タグ・About | `website` |
| 企画詳細 | `article`（`article:section=アンソロジー`） |
| 収録作詳細 | `article`（`article:section=収録作`） |
| 記事詳細 | `article`（`article:section=記事`, `article:published_time`） |
| スポット詳細 | `article`（`article:section=スポット`） |

### `article:*` プロパティ（該当ページのみ）

```html
<meta property="article:published_time" content="2026-05-01T10:00:00Z" />
<meta property="article:modified_time" content="2026-05-12T08:00:00Z" />
<meta property="article:section" content="記事" />
<meta property="article:tag" content="短編" />
<meta property="article:tag" content="郷愁" />
```

### OG 画像（`og:image`）方針

1. **コンテンツが cover_image を持つ場合**: そのファイル（1200×630推奨）を使用
2. **持たない場合（一覧・タグ・About 等）**: デフォルトOG画像を使用
3. **デフォルトOG画像**: `/public/og-default.png`
   - サイト名・キャッチコピー入り
   - ブランドカラー（ブラウン/クリーム）ベース
4. **動的OG画像（Phase1後半で検討）**: Next.js `ImageResponse` で各ページ用に自動生成
   - MVP時点では静的ファイル使用で十分

### 画像URLの絶対パス化

OGPは**絶対URL必須**。環境変数 `NEXT_PUBLIC_SITE_URL` を prefix に付与。

---

## 4. canonical

### 設定方針

- 全ページに `<link rel="canonical">` を配置
- 値は**絶対URL**
- 一覧ページのフィルタクエリは canonical に含めない（重複コンテンツ対策）

### ルール

| ページ | canonical |
|---|---|
| トップ | `https://scone-media.netlify.app/` |
| 一覧（フィルタなし） | `https://scone-media.netlify.app/anthologies` |
| 一覧（フィルタあり）`?tags=...` | `https://scone-media.netlify.app/anthologies`（パスのみ） |
| 一覧（ページネーション）`?page=2` | `https://scone-media.netlify.app/anthologies?page=2`（ページ番号は含める） |
| 詳細 | 自身の絶対URL |

### ドメイン移行時の対応

- カスタムドメイン取得後（フェーズ1-2間、C-4）、canonical ベースURLを環境変数で更新
- netlify.app → カスタムドメインへ 301リダイレクト（Netlify `_redirects` で設定）

---

## 5. sitemap.xml

### 生成方針

- Next.js の `app/sitemap.ts` ファイルベース生成
- ビルド時に全コンテンツのパスを列挙して XML 出力
- パス: `/sitemap.xml`

### 含めるURL

- 全ての Must ページ（トップ・一覧・全詳細・タグ一覧・タグ別・About）
- `status=published` のコンテンツのみ
- `draft` / `archived` は含めない

### フィールド

| フィールド | 値 |
|---|---|
| `loc` | 絶対URL |
| `lastmod` | コンテンツの `updated_at` or `published_at` |
| `changefreq` | トップ=`daily` / 一覧=`weekly` / 詳細=`monthly` / About=`yearly` |
| `priority` | トップ=`1.0` / 企画詳細=`0.9` / 収録作=`0.8` / 記事=`0.7` / タグ=`0.5` |

### 更新

- `main` ブランチマージ時の Netlify ビルドで自動再生成

---

## 6. robots.txt

### 配置
- `/public/robots.txt` として静的配信

### 内容

```txt
User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/
Disallow: /draft/

Sitemap: https://scone-media.netlify.app/sitemap.xml
```

### 本番でのみ allow

- Netlify Preview は `X-Robots-Tag: noindex` ヘッダを `netlify.toml` で付与し、プレビュー環境のインデックスを防ぐ

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Robots-Tag = "noindex, nofollow"
```

→ 本番のみ別の `[context.production.headers]` で上書きするか、条件分岐する。

---

## 7. 構造化データ（JSON-LD）

### 実装方針

- Next.js の各ページで `<script type="application/ld+json">` を `<head>` に注入
- Google Rich Results Test で妥当性を検証
- 複数同時に出してOK（配列またはgraph構造）

### 共通: サイト全体の `WebSite` + `Organization`

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "SCONE MEDIA",
  "url": "https://scone-media.netlify.app",
  "publisher": {
    "@type": "Organization",
    "name": "SCONE MEDIA",
    "logo": {
      "@type": "ImageObject",
      "url": "https://scone-media.netlify.app/logo.png"
    }
  },
  "inLanguage": "ja"
}
```

### 企画詳細: `CreativeWorkSeries`

```json
{
  "@context": "https://schema.org",
  "@type": "CreativeWorkSeries",
  "name": "夜の縁側",
  "description": "...",
  "url": "https://scone-media.netlify.app/anthologies/yoru-no-engawa",
  "image": "https://.../cover.jpg",
  "datePublished": "2026-05-01",
  "inLanguage": "ja",
  "genre": ["短編", "現代文学", "郷愁"],
  "hasPart": [
    { "@type": "Article", "name": "縁側の虫", "url": "..." },
    { "@type": "Article", "name": "月の音", "url": "..." }
  ]
}
```

### 収録作詳細: `Article`

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "縁側の虫",
  "author": {
    "@type": "Person",
    "name": "山田 花子"
  },
  "datePublished": "2026-05-01",
  "dateModified": "2026-05-01",
  "image": "https://.../cover.jpg",
  "url": "https://scone-media.netlify.app/works/engawa-no-mushi",
  "isPartOf": {
    "@type": "CreativeWorkSeries",
    "name": "夜の縁側",
    "url": "https://scone-media.netlify.app/anthologies/yoru-no-engawa"
  },
  "publisher": {
    "@type": "Organization",
    "name": "SCONE MEDIA"
  },
  "inLanguage": "ja",
  "keywords": "短編, 郷愁",
  "wordCount": 3200
}
```

### 記事詳細: `Article`

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "夜の文学が教えてくれること",
  "author": { "@type": "Organization", "name": "SCONE MEDIA 編集部" },
  "datePublished": "2026-05-10",
  "image": "...",
  "url": "...",
  "publisher": { "@type": "Organization", "name": "SCONE MEDIA" },
  "articleSection": "記事",
  "inLanguage": "ja"
}
```

### スポット詳細: `LocalBusiness` + `Place`

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "スコーン工房 代官山店",
  "description": "...",
  "url": "https://scone-media.netlify.app/spots/scone-kobo-daikanyama",
  "image": "...",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "代官山町〇〇",
    "addressLocality": "渋谷区",
    "addressRegion": "東京都",
    "addressCountry": "JP"
  },
  "openingHours": "Tu-Su 11:00-18:00",
  "priceRange": "¥¥"
}
```

### パンくず: `BreadcrumbList`（全詳細ページ）

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "トップ", "item": "https://scone-media.netlify.app/" },
    { "@type": "ListItem", "position": 2, "name": "アンソロジー企画一覧", "item": "https://scone-media.netlify.app/anthologies" },
    { "@type": "ListItem", "position": 3, "name": "夜の縁側", "item": "https://scone-media.netlify.app/anthologies/yoru-no-engawa" }
  ]
}
```

---

## 8. noindex 運用

### noindex を付けるページ

- 404 / 500（Next.js デフォルトで `noindex`）
- Netlify Preview の全ページ（`netlify.toml` で設定）
- `description` が 20字未満のタグ別ページ（R-7対策）
- `status=draft` のコンテンツページ（そもそも SSG に含めない）

### noindex を付けないページ

- フィルタ適用中の一覧ページ（canonical で重複を防ぐため）
- ページネーション 2ページ目以降（検索流入があり得る）

---

## 9. 内部リンク設計

### 原則

1. すべての詳細ページから**最低3つの内部リンク**を持つ（タグ・関連・パンくず）
2. 収録作 → 所属企画 → 同タグ企画 の導線は **2クリックで完結**
3. `rel="nofollow"` は編集方針として**原則つけない**（内部リンクに不要）
4. 外部リンクは `rel="noopener noreferrer"` を付与、新規タブ

### 関連コンテンツの選出ロジック

1. 手動設定（`related_*` フィールド）が最優先
2. 未設定時はタグマッチ数で上位3件
3. タグマッチ同数時は `published_at` 降順でソート

---

## 10. 多言語 / hreflang

- MVPは日本語のみ（`<html lang="ja">`）
- `hreflang` は不要
- 将来の多言語化に備え、URL設計に `/[locale]/` を含めない（現状維持）

---

## 11. パフォーマンス SEO

### Core Web Vitals 連動

- LCP 2.5秒以下を維持する（ヒーロー画像の priority 設定・preload）
- CLS 0.1以下（画像サイズ固定・font-display swap）
- INP 200ms以下（Hydration軽量化）

### 実装上の具体策

- `next/image` を必ず使用、`width`/`height` 必須
- `next/font` を使用、`display: "swap"`
- MDXの画像は自動で `<Image>` に変換するカスタムコンポーネント

---

## 12. Search Console / 検索エンジン登録

### ローンチ時タスク

- [ ] Google Search Console にサイト登録
- [ ] sitemap.xml を送信
- [ ] 手動でインデックス登録リクエスト（トップ・主要企画）
- [ ] Bing Webmaster Tools も登録（補助）

### 継続タスク（月次）

- インデックスカバレッジ確認
- 検索パフォーマンスレポート確認（クリック・表示回数・CTR）

---

## 13. 実装チェックポイント

### Next.js metadata API 活用

```ts
// app/anthologies/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const anthology = await getAnthology(params.slug);
  return {
    title: `${anthology.title}｜アンソロジー｜SCONE MEDIA`,
    description: anthology.description.slice(0, 160),
    openGraph: {
      title: anthology.title,
      description: anthology.description.slice(0, 160),
      url: `${SITE_URL}/anthologies/${params.slug}`,
      images: [{ url: `${SITE_URL}${anthology.cover_image}`, width: 1200, height: 630 }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
    },
    alternates: {
      canonical: `${SITE_URL}/anthologies/${params.slug}`,
    },
  };
}
```

### JSON-LD レンダリング

```tsx
// components/seo/JsonLd.tsx
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

---

## 14. QA チェックリスト（SEO 観点）

- [ ] 全ページの `<title>` が固有・60字以内
- [ ] 全ページの `description` が 80〜160字
- [ ] OGP画像が1200×630で設定されている
- [ ] Rich Results Test で構造化データにエラーが無い
- [ ] X Card Validator でプレビューが崩れない
- [ ] Facebook OGP Debugger で正常表示
- [ ] sitemap.xml が全コンテンツを含む
- [ ] robots.txt が正しくパースされる
- [ ] canonical が絶対URLで正しい
- [ ] Lighthouse SEO スコア **100**

---

*このドキュメントは [`phase1-planning.md`](./phase1-planning.md) に基づく Phase1 成果物です。*
