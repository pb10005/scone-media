# ページ別詳細仕様

> Phase1 成果物 / 作成日: 2026-04-28  
> 依存: [`sitemap.md`](./sitemap.md), [`content-types.md`](./content-types.md)  
> 目的: 実装者がこのドキュメントだけでページを組めるレベルの具体性を持つ

---

## 共通仕様

### レイアウト（全ページ共通）

```
┌─────────────────────────────────┐
│ Header（固定・sticky）           │
│ ロゴ | 企画 | 記事 | スポット | タグ | About │
├─────────────────────────────────┤
│ <main>                          │
│                                 │
│  [パンくずリスト]               │
│                                 │
│  ページ固有コンテンツ           │
│                                 │
├─────────────────────────────────┤
│ Footer                          │
│ ロゴ / About / 寄稿 / SNS / ©  │
└─────────────────────────────────┘
Cookie同意バナー（初回訪問時・下部fixed）
```

### ブレークポイント

| 名称 | 幅 | 想定デバイス |
|---|---|---|
| mobile | `< 640px` | iPhone SE〜 |
| sm | `≥ 640px` | 大型スマホ |
| md | `≥ 768px` | タブレット縦 |
| lg | `≥ 1024px` | タブレット横〜小型PC |
| xl | `≥ 1280px` | PC |

Tailwindデフォルトに準拠。

### カラーパレット（D-3 確定）

| トークン | 値 | 用途 |
|---|---|---|
| `primary` | `#A0826D` (ブラウン) | ボタン・リンク・強調 |
| `primary-dark` | `#8B4513` (ダークブラウン) | ホバー・アクティブ |
| `secondary` | `#F5E6D3` (クリーム) | 背景・カード |
| `background` | `#FFFEFB` | ベース背景 |
| `foreground` | `#2C2420` | 本文テキスト |
| `muted` | `#7A6F66` | 補助テキスト |
| `border` | `#E8DCC8` | 境界線 |
| `accent` | `#C97B4E` | タグ・バッジ |

### フォント

- 本文: `Noto Sans JP`（400/500/700） via `next/font/google`
- 見出し: `Noto Serif JP`（400/700） - 文芸の格を演出
- 英数字: `Inter`（400/600）

### 画像ガイド

- 全ての画像は `next/image` を利用。`priority` は hero のみ
- `cover_image` サイズ推奨: **1200×630px**（OGP兼用）
- スポット写真: 元画像最低 **1600×1200px**（ギャラリー用）
- フォールバック: 画像未設定時はブランドカラーのプレースホルダSVGを表示

---

## 1. トップページ（`/`）

### 目的
初訪問者に世界観を伝え、最低1ページ先に誘導する。

### URL
- パス: `/`
- canonical: `https://scone-media.netlify.app/`

### データ要件

| セクション | データソース | 条件 | 件数 |
|---|---|---|---|
| ヒーロー用注目企画 | anthologies | `status=published`, 手動フラグ `is_featured=true` | 1件 |
| スポットピックアップ | spots | `status=published` | `published_at` 降順で最大5件 |
| 新着アンソロジー企画 | anthologies | `status=published` | `published_at` 降順で最大3件（ヒーロー含まず） |
| 新着記事 | articles | `status=published` | `published_at` 降順で最大3件 |
| 人気タグ | tags | - | 使用コンテンツ数上位10件 |

### UI構成（上から順）

1. **ヒーロー**（`<section aria-label="ブランド紹介">`)
   - キャッチコピー（h1）: 「夜にひらく、スコーンと物語のポータル」
   - リード文（2-3行）
   - 注目企画カード（大きめ：cover_image 1200×630、タイトル、テーマ、CTA「企画を読む」）
2. **スポットピックアップ**（`<section aria-label="スポット">`)
   - md以上: グリッド（3〜5カラム）/ mobile: 横スクロールカルーセル
   - カード: 写真・スポット名・エリア・種別アイコン
3. **新着アンソロジー企画**（`<section>`）
   - 3カラムグリッド（lg） / 1カラム（mobile）
   - カード: 表紙・タイトル・テーマ・タグ3つ・収録作数バッジ
4. **新着記事**（`<section>`）
   - 縦リスト（各 item: アイキャッチ左 / タイトル+概要+日付+タグ 右）
5. **人気タグクラウド**（`<section>`）
   - タグ10件、バッジ形式（`#タグ名`）

### 状態
- データ0件時: 「準備中」プレースホルダを表示（レイアウトは保持）

### メタ
- `<title>`: 「SCONE MEDIA｜夜にひらく、スコーンと物語のポータル」
- `description`: 「アンソロジー企画を軸に、収録作・記事・スポットを横断できる文芸ポータル。週1本ペースで新作を発信中。」
- OGP: ヒーロー企画の `cover_image`

### 計測イベント
- ヒーロー企画クリック: `anthology_view`（source_page=`home_hero`）
- タグクリック: `tag_click`（source_page_type=`home`）
- 関連カードクリック: リンク先ページでの各 `*_view`

---

## 2. アンソロジー企画一覧（`/anthologies`）

### 目的
企画を発見しやすくする。タグ絞り込みによる探索をサポート。

### URL
- パス: `/anthologies`, `/anthologies?tags=短編,郷愁`, `/anthologies?page=2`
- canonical: ページネーション含め `?page=n` を正規URLとする（1ページ目は `/anthologies`）

### データ要件

| 項目 | 仕様 |
|---|---|
| ソート | `published_at` 降順 |
| フィルタ | `tags` クエリパラメータ（カンマ区切り、AND結合） |
| 1ページ件数 | 12 |
| ページネーション | 1ページ目: `/anthologies`、以降: `/anthologies?page=2` |

### UI構成

1. ページヘッダー
   - h1: 「アンソロジー企画」
   - 件数表示（`全N本`）
2. タグフィルタ
   - 人気タグから20個をチップ表示。クリックでトグル
   - 選択中のタグが上部にハイライト表示 + 「すべて解除」ボタン
3. 企画カードグリッド
   - lg: 3カラム / md: 2カラム / mobile: 1カラム
   - カード要素: 表紙・タイトル（h2）・テーマ・タグ・収録作数バッジ・公開日
4. ページネーション
   - 前へ / 1, 2, 3... / 次へ

### 空状態
- フィルタ結果0件: 「該当する企画がありません」+ 「すべての企画を見る」リンク

### メタ
- `<title>`: 「アンソロジー企画一覧｜SCONE MEDIA」
- フィルタ時 title に `（タグ: 短編, 郷愁）` を追加
- フィルタ時 canonical は `/anthologies`（重複防止）

### 計測イベント
- タグクリック: `tag_click`（source_page_type=`anthology_list`）

---

## 3. アンソロジー企画詳細（`/anthologies/[slug]`）

### 目的
企画の世界観を伝え、収録作への誘導を最大化する。

### URL
- パス: `/anthologies/[slug]`
- canonical: `https://scone-media.netlify.app/anthologies/[slug]`

### データ要件

| 項目 | 仕様 |
|---|---|
| 本体 | `anthology` の全フィールド |
| 収録作 | `works` フィールドの順序に従い join して取得 |
| 関連企画 | `related_anthologies` 手動設定 OR タグマッチ上位3件 |

### UI構成

1. **ヒーロー**
   - 表紙画像（1200×630、priority=true）
   - h1: 企画タイトル
   - テーマ、タグ（チップ）、公開日、収録作数
2. **企画概要**（`<section>`）
   - `description` を MDX レンダリング
3. **収録作リスト**（`<section aria-label="収録作">`）
   - 番号付きリスト（01. 02. 03. ...）
   - 各item: 作品タイトル・著者名・抜粋1-2行・形式バッジ・文字数目安
   - item全体がリンク → `/works/[slug]`
4. **編集後記**（`editor_note` がある場合のみ）
   - 縁取りのあるブロック
5. **関連企画**（`<section>`）
   - 3カード（lg）または横スクロール（mobile）
6. **CTA**
   - 「最初の収録作から読む」ボタン → 1番目の work へ

### パンくず
`トップ > アンソロジー企画一覧 > [企画タイトル]`

### メタ
- `<title>`: 「[企画タイトル]｜アンソロジー｜SCONE MEDIA」
- `description`: `description` の冒頭160字
- OGP: `cover_image`
- 構造化データ: `CreativeWorkSeries`

### 計測イベント
- ページ表示: `anthology_view`（`anthology_slug`, `tag_list`）
- 収録作リストクリック: `related_work_click`（source_page_type=`anthology_detail`）
- 関連企画クリック: `related_anthology_click`
- シェア: `share_click`

---

## 4. 収録作一覧（`/works`）

### 目的
作品単位で横断発見できる補助ページ。

### URL
- `/works`, `/works?format=novel`, `/works?tag=短編`

### データ要件
- 全 `work` の `status=published` を集約
- ソート: `published_at` 降順
- フィルタ: `format`, `tag`

### UI構成

1. ページヘッダー
   - h1: 「収録作一覧」
   - フィルタ（形式: 小説 / 詩 / エッセイ / 書評 / その他）
2. 作品カード（2カラム lg / 1カラム mobile）
   - カード要素: 作品タイトル・著者名・所属企画名（小さく）・抜粋2行・タグ・文字数・形式バッジ

### メタ
- `<title>`: 「収録作一覧｜SCONE MEDIA」

---

## 5. 収録作詳細（`/works/[slug]`）【最重要ページ】

### 目的
作品を全文で読んでもらいつつ、企画・次の作品への回遊を促す。

### URL
- `/works/[slug]`

### データ要件

| 項目 | 仕様 |
|---|---|
| 本体 | `work` 全フィールド |
| 所属企画 | `work.anthology` をjoin |
| 次の収録作 | 所属企画の `works` 配列で次のインデックスの作品 |
| 関連記事 | タグマッチ上位3件 |

### UI構成

1. **所属企画バナー**（最上部、最重要）
   - `<aside aria-label="所属する企画">`
   - 企画表紙（小・左）、「このアンソロジーに収録」テキスト、企画タイトル、「企画詳細へ」リンク
   - sticky 候補（モバイルはフロートしない）
2. **パンくず**
   `トップ > アンソロジー企画一覧 > [企画タイトル] > [収録作タイトル]`
3. **作品ヘッダー**
   - h1: 作品タイトル
   - 著者名、著者プロフィール（折り畳み可）、形式、文字数、公開日、タグ
4. **本文（全文）**
   - MDX レンダリング
   - 最大幅 `max-w-[38rem]`（文芸的な適度な行長 = 約40字）
   - `font-serif`、行間 `leading-loose`（2.0）
   - 段落間 margin 1.5em
5. **シェアボタン**（本文後）
   - X / Copy Link
6. **AI生成の表記**（`is_ai_generated=true` の場合）
   - 「この作品はAIによって生成されました」と控えめに表示
7. **次の収録作ナビ**（`<nav aria-label="次の作品">`）
   - 左：前の収録作 / 右：次の収録作（大きめカード）
   - 最後の作品の場合は「企画詳細に戻る」ボタン
8. **関連記事**（`<section>`）
   - 3件、アイキャッチ付きカード

### メタ
- `<title>`: 「[作品タイトル]｜[著者名]｜[企画タイトル]｜SCONE MEDIA」
- `description`: 本文冒頭160字（自動抽出）
- OGP: 作品の `cover_image` があればそれ、無ければ所属企画の `cover_image`
- `og:type`: `article`
- 構造化データ: `Article` + `isPartOf` で企画を参照

### 計測イベント
- ページ表示: `work_view`（`work_slug`, `anthology_slug`, `format`）
- 所属企画バナークリック: `anthology_view`（source_page=`work_detail_banner`）
- 次の収録作クリック: `next_work_click`
- タグクリック: `tag_click`
- シェア: `share_click`

---

## 6. 記事一覧（`/articles`）

### 目的
編集コンテンツを日付順に探索できる。

### URL
- `/articles`, `/articles?type=review`, `/articles?page=2`

### データ要件
- `article` の `status=published`
- ソート: `published_at` 降順
- フィルタ: `article_type`

### UI構成

1. ヘッダー
   - h1: 「記事」
   - 種別フィルタ（書評/インタビュー/エッセイ/特集/ニュース）
2. 記事カードリスト
   - lg: 2カラム / mobile: 1カラム
   - カード: アイキャッチ（4:3）・種別バッジ・タイトル・excerpt・日付・タグ・著者名

### メタ
- `<title>`: 「記事｜SCONE MEDIA」

---

## 7. 記事詳細（`/articles/[slug]`）

### 目的
編集コンテンツで読者の関心を深め、企画・収録作へ送客する。

### URL
- `/articles/[slug]`

### データ要件
- `article` 全フィールド
- 関連企画・関連収録作: `related_anthologies` / `related_works`（手動設定優先）
- 未指定時はタグマッチ上位3件

### UI構成

1. パンくず: `トップ > 記事 > [記事タイトル]`
2. 記事ヘッダー
   - アイキャッチ（16:9）
   - 種別バッジ
   - h1: タイトル
   - 執筆者名、公開日、タグ
3. 本文
   - 最大幅 `max-w-[42rem]`
   - 目次（h2以上が3個以上ある場合に自動生成、右サイドバー or 折り畳み）
4. **シェアボタン**
5. **関連アンソロジー企画**（`<section>`）
   - 最重要 CTA。カード2〜3枚
6. **関連収録作**（`<section>`）
   - 2〜3件リスト

### メタ
- `<title>`: 「[記事タイトル]｜SCONE MEDIA」
- OGP: `cover_image`
- 構造化データ: `Article`

### 計測イベント
- `article_view`（`article_slug`, `article_type`, `tag_list`）
- 関連企画クリック: `related_anthology_click`
- 関連収録作クリック: `related_work_click`
- シェア: `share_click`

---

## 8. スポット一覧（`/spots`）

### 目的
スコーン店・公園などの実在場所を発見する。

### URL
- `/spots`, `/spots?area=東京`, `/spots?type=bakery`

### データ要件
- `spot` の `status=published` かつ `photo_permission=true`（R-3対策）
- ソート: `published_at` 降順
- フィルタ: `area`, `spot_type`

### UI構成

1. ヘッダー
   - h1: 「スポット」
   - エリアフィルタ（チップ）
   - 種別フィルタ（カフェ/ベーカリー/公園/図書館/その他）
2. スポットカードグリッド
   - lg: 3カラム / md: 2 / mobile: 1
   - カード: カバー写真（4:3）・スポット名・エリア・種別アイコン・価格帯・取材日

### メタ
- `<title>`: 「スポット｜SCONE MEDIA」

---

## 9. スポット詳細（`/spots/[slug]`）

### 目的
スコーン店・場所の魅力を伝える。

### URL
- `/spots/[slug]`

### データ要件
- `spot` 全フィールド
- 関連記事: タグマッチ上位3件

### UI構成

1. パンくず: `トップ > スポット > [スポット名]`
2. ヒーロー
   - `cover_image` （16:9）
   - h1: スポット名
   - 種別バッジ、エリア、価格帯
3. 紹介文（MDX）
4. **基本情報テーブル**（定義リスト）
   - 住所、アクセス、営業時間、価格帯、取材日
   - 「Google Mapsで見る」リンク（`map_url`）
5. ギャラリー（`gallery_images` がある場合）
   - ライトボックス付き
6. タグ
7. 関連記事

### メタ
- `<title>`: 「[スポット名]｜[エリア]｜SCONE MEDIA」
- OGP: `cover_image`
- 構造化データ: `LocalBusiness`（住所・営業時間を含む）

### 計測イベント
- `spot_view`（`spot_slug`）
- タグクリック: `tag_click`
- Google Mapsリンククリック: `share_click`（platform=`gmaps`）

### 注意
- `photo_permission=false` の場合は **ビルド時に除外**（static paths に含めない）
- 取材日から 3ヶ月経過で「情報が古い可能性」の注記を自動表示

---

## 10. タグ一覧（`/tags`）

### 目的
サイト全体のトピックを一覧できる索引ページ。

### URL
- `/tags`

### データ要件
- 全タグ
- カテゴリ別にグルーピング（`genre` / `theme` / `format` / `era` / `mood` / `area` / `spot_type`）

### UI構成

1. ヘッダー h1: 「タグ」
2. カテゴリ別タグクラウド
   - 各カテゴリ見出し h2
   - タグチップ（使用コンテンツ数も併記）

### メタ
- `<title>`: 「タグ一覧｜SCONE MEDIA」

---

## 11. タグ別コンテンツ一覧（`/tags/[tag]`）

### 目的
同テーマのコンテンツを横断発見できる検索代替ページ。

### URL
- `/tags/[tag]`（`[tag]` は tag の slug）

### データ要件
- そのタグが付いた全コンテンツ（anthology/work/article/spot）を統合取得
- ソート: `published_at` 降順

### UI構成

1. パンくず: `トップ > タグ > [タグ名]`
2. ヘッダー
   - h1: 「タグ: [タグ名]」
   - タグ description（SEO用ユニーク導入文 / R-7対策）
3. コンテンツタイプ別フィルタ（All / 企画 / 作品 / 記事 / スポット）
4. コンテンツカード（タイプごとに見た目を少し変える）
   - 各カードにコンテンツタイプバッジ

### 空状態
- 「このタグのコンテンツはまだありません」

### メタ
- `<title>`: 「[タグ名]｜タグ｜SCONE MEDIA」
- **description が20字未満の場合は `<meta name="robots" content="noindex">`**（重複対策, R-7）

### 計測イベント
- `tag_click`（内部タグクリック時のみ）

---

## 12. このサイトについて（`/about`）

### 目的
ブランド価値観・AI生成コンテンツの方針・運営者情報を伝える。

### URL
- `/about`

### UI構成

1. h1: 「このサイトについて」
2. セクション:
   - ブランドステートメント
   - 掲載コンテンツの方針（AI生成の扱い、全文掲載の理由）
   - 運営者について
   - 権利・ライセンス（収録作/画像/スポット写真）
   - プライバシーポリシー（GA4利用・Cookie）
   - お問い合わせ先（メール or フォーム誘導）

### 備考
- MDXで管理（`content/pages/about.mdx`）

---

## 13. 寄稿について（`/contribute`）【Should】

### 目的
寄稿希望者に方針を伝え、問い合わせを受け付ける。

### UI構成

1. h1: 「寄稿について」
2. セクション:
   - 寄稿方針、ジャンル、文字数の目安
   - 審査プロセス、謝礼の有無
   - 問い合わせフォーム（または mailto: リンク）

詳細は [`phase1-forms-spec.md`](./phase1-forms-spec.md) を参照。

### 計測イベント
- ページ遷移時 `contribute_click`（source_page=遷移元）
- フォーム送信: `contact_submit`

---

## 14. 404ページ

### URL
- 存在しないパスすべて（Next.js の `app/not-found.tsx`）

### UI構成
- h1: 「お探しのページが見つかりません」
- 404イラスト or ブランドカラーのグラフィック
- トップへ戻る / タグ一覧 / 人気企画 3件 へのリンク

### メタ
- `<title>`: 「404 - ページが見つかりません｜SCONE MEDIA」
- `noindex`

---

## 15. 500 / エラーページ

### URL
- Next.js `app/error.tsx`

### UI構成
- h1: 「エラーが発生しました」
- 「再読み込み」ボタン、トップへ戻るリンク

### メタ
- `noindex`

---

## 共通コンポーネント一覧

| コンポーネント | 用途 | ファイルパス（案） |
|---|---|---|
| `<SiteHeader />` | グローバルヘッダー | `components/layout/SiteHeader.tsx` |
| `<SiteFooter />` | グローバルフッター | `components/layout/SiteFooter.tsx` |
| `<Breadcrumb />` | パンくず | `components/layout/Breadcrumb.tsx` |
| `<CookieConsentBanner />` | Cookie同意バナー | `components/layout/CookieConsentBanner.tsx` |
| `<AnthologyCard />` | 企画カード | `components/cards/AnthologyCard.tsx` |
| `<WorkCard />` | 収録作カード | `components/cards/WorkCard.tsx` |
| `<ArticleCard />` | 記事カード | `components/cards/ArticleCard.tsx` |
| `<SpotCard />` | スポットカード | `components/cards/SpotCard.tsx` |
| `<TagChip />` | タグチップ | `components/ui/TagChip.tsx` |
| `<TagFilter />` | タグフィルタUI | `components/filters/TagFilter.tsx` |
| `<Pagination />` | ページネーション | `components/ui/Pagination.tsx` |
| `<ShareButtons />` | シェアボタン | `components/ui/ShareButtons.tsx` |
| `<AnthologyBanner />` | 収録作ページの所属企画バナー | `components/work/AnthologyBanner.tsx` |
| `<NextWorkNav />` | 次/前の作品ナビ | `components/work/NextWorkNav.tsx` |
| `<RelatedWidget />` | 関連コンテンツ汎用 | `components/related/RelatedWidget.tsx` |
| `<MdxContent />` | MDXレンダラ | `components/mdx/MdxContent.tsx` |

---

## インタラクション仕様

### ページ遷移
- `next/link` によるプリフェッチ
- 遷移時のページトップスクロール
- Framer Motion による fade 100ms

### タグフィルタ
- クエリパラメータ（`?tags=a,b`）で状態管理
- 「すべて解除」でクエリ削除
- `router.replace`（履歴汚さない）

### Cookie 同意バナー
- localStorage `scone_cookie_consent` に `granted|denied` 保存
- 未設定時のみバナー表示
- 同意後に GA4 初期化

---

## 非対応事項（明示）

- コメント機能なし
- ユーザー登録・ログインなし
- サイト内全文検索なし（タグ/フィルタで代替）
- 多言語切替なし（日本語のみ）

---

*このドキュメントは [`phase1-planning.md`](./phase1-planning.md) に基づく Phase1 成果物です。*
