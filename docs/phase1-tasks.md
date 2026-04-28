# 実装タスク表

> Phase1 成果物 / 作成日: 2026-04-28  
> 目的: ローンチに必要な全タスクを「優先度 / 工数 / 依存 / 担当」で可視化する

---

## 0. 前提

- 担当者: エンジニア1名（A-1確定）
- 稼働前提: 1日 約4〜6時間 × 平日 = 週 20〜30h
- 工数単位: **p（ポイント）**  
  - 0.5p = 半日以内 / 1p = 1日 / 2p = 2日 / 3p = 3〜4日 / 5p = 1週間
- 優先度:
  - **P0**: ローンチブロッカー（絶対Must）
  - **P1**: ローンチまでに必ず完了（Must）
  - **P2**: Should（ローンチ後1-2週間以内）
  - **P3**: Could（フェーズ2以降候補）

---

## 1. スプリント構成（3スプリント想定）

| スプリント | 期間 | ゴール |
|---|---|---|
| **S1: 基盤** | Week 1-2 | Next.js初期化、スタイル、レイアウト、MDXパーサー、代表1ページ（企画詳細）動作 |
| **S2: 全ページ実装** | Week 3-4 | 全 Must ページの実装 + タグ/フィルタ/関連ウィジェット |
| **S3: 仕上げ・QA** | Week 5-6 | SEO/GA4/OGP/構造化データ/QA/初期コンテンツ投入/デプロイ |

**合計**: 約6週間（初期コンテンツ制作は並行）

---

## 2. タスク一覧

### 📦 S1: 基盤セットアップ

| # | タスク | 優先 | 工数 | 依存 | 担当 | 受け入れ条件 |
|---|---|---|---|---|---|---|
| T-01 | Next.js 15 プロジェクト初期化（App Router, TS, Tailwind v4, ESLint） | P0 | 0.5p | - | Dev | `pnpm dev` 起動OK / Hello World表示 |
| T-02 | Git / GitHub リポジトリ整備、`.gitignore`、README | P0 | 0.5p | T-01 | Dev | 既存 `origin` に push成功 |
| T-03 | ディレクトリ構成作成（tech-stack.md 準拠） | P0 | 0.5p | T-01 | Dev | `app/`, `components/`, `content/`, `lib/` 雛形 |
| T-04 | 依存パッケージ導入（gray-matter, next-mdx-remote, fuse.js, lucide-react, react-hook-form, framer-motion, vitest） | P0 | 0.5p | T-01 | Dev | package.json 反映・build成功 |
| T-05 | Tailwind v4 カスタム色定義（ブラウン/クリーム/アクセント） | P0 | 0.5p | T-01 | Dev | `bg-primary` 等が使用できる |
| T-06 | `next/font` で Noto Sans/Serif JP / Inter を設定 | P0 | 0.5p | T-01 | Dev | CSS variables で切替可 |
| T-07 | グローバルレイアウト（`app/layout.tsx`、html lang ja、viewport、theme-color） | P0 | 0.5p | T-05, T-06 | Dev | 全ページで共通ラッピング |
| T-08 | `<SiteHeader>` 実装（ロゴ・ナビ・モバイルハンバーガー・skip link） | P0 | 1p | T-07 | Dev | Tab で skip link / モバイルで開閉可 |
| T-09 | `<SiteFooter>` 実装（About/寄稿/SNS/©） | P0 | 0.5p | T-07 | Dev | 全ページに表示 |
| T-10 | `<Breadcrumb>` 実装（構造化データ対応） | P0 | 0.5p | T-07 | Dev | BreadcrumbList JSON-LD が出力される |
| T-11 | MDXパーサー実装（`lib/content.ts`：gray-matter + バリデーション） | P0 | 1p | T-03, T-04 | Dev | content-types.md の全型でパース/型付け |
| T-12 | TypeScript 型定義（`types/content.ts`：Anthology, Work, Article, Spot, Tag） | P0 | 0.5p | T-11 | Dev | 全コンテンツ型が型付きで取得できる |
| T-13 | MDXレンダラ `<MdxContent>`（Image自動変換・heading anchor） | P0 | 1p | T-11 | Dev | 見出しアンカー生成・`next/image` 使用 |
| T-14 | サンプルMDXファイル作成（各タイプ1件ずつ、開発用ダミー） | P0 | 0.5p | T-11 | Dev | `content/anthologies/sample.mdx` 等 |
| T-15 | 企画詳細ページのひな形実装（`/anthologies/[slug]`） | P0 | 1p | T-13, T-14 | Dev | サンプル企画が表示される |
| T-16 | 本体のレイアウト調整・CSS仕上げ（基本トーン固定） | P0 | 1p | T-07〜T-15 | Dev | デザイントーンがブランドカラーで統一 |

**S1 小計: 10p（約 2 週間）**

---

### 🎨 S2: 全ページ実装

| # | タスク | 優先 | 工数 | 依存 | 担当 | 受け入れ条件 |
|---|---|---|---|---|---|---|
| T-20 | 共通カードコンポーネント（AnthologyCard / WorkCard / ArticleCard / SpotCard） | P0 | 2p | T-13 | Dev | 各型の表示・hover状態 |
| T-21 | タグチップ `<TagChip>` + タグフィルタ `<TagFilter>` | P0 | 1p | T-20 | Dev | クリックトグル、URLクエリ同期 |
| T-22 | ページネーション `<Pagination>` | P0 | 0.5p | - | Dev | 1/全N ページ対応、URLクエリ同期 |
| T-23 | 関連コンテンツ `<RelatedWidget>`（タグマッチ・手動設定併用） | P0 | 1p | T-20 | Dev | 3件表示・計測イベント発火 |
| T-24 | シェアボタン `<ShareButtons>`（X / Copy Link） | P0 | 0.5p | - | Dev | クリックでイベント発火・クリップボードコピー |
| T-25 | トップページ `/` 実装（ヒーロー / スポット / 新着企画 / 新着記事 / タグ） | P0 | 2p | T-20, T-21 | Dev | page-specs §1 の全要素を表示 |
| T-26 | 企画一覧 `/anthologies`（タグフィルタ・ページネーション） | P0 | 1p | T-20, T-21, T-22 | Dev | フィルタ動作・12件/p |
| T-27 | 企画詳細 `/anthologies/[slug]` 仕上げ（収録作リスト・関連・CTA） | P0 | 1p | T-15, T-23 | Dev | 全要素表示、次の作品導線OK |
| T-28 | 収録作一覧 `/works`（形式フィルタ） | P0 | 1p | T-20 | Dev | フィルタ動作 |
| T-29 | 収録作詳細 `/works/[slug]`（所属企画バナー・次の作品ナビ・関連記事） | P0 | 2p | T-20, T-23 | Dev | 最重要ページ。全要素・導線動作 |
| T-30 | 記事一覧 `/articles`（種別フィルタ） | P0 | 1p | T-20 | Dev | 完成 |
| T-31 | 記事詳細 `/articles/[slug]`（関連企画・関連収録作） | P0 | 1p | T-20, T-23 | Dev | 完成 |
| T-32 | スポット一覧 `/spots`（エリア・種別フィルタ） | P0 | 1p | T-20 | Dev | 完成 |
| T-33 | スポット詳細 `/spots/[slug]`（基本情報テーブル・ギャラリー） | P0 | 1p | T-20 | Dev | Google Maps リンク・取材日表示 |
| T-34 | タグ一覧 `/tags`（カテゴリ別グルーピング） | P0 | 0.5p | T-21 | Dev | 完成 |
| T-35 | タグ別 `/tags/[tag]`（コンテンツタイプ別フィルタ、横断表示） | P0 | 1p | T-20, T-21 | Dev | 完成 |
| T-36 | About `/about`（MDXで運用） | P0 | 0.5p | T-13 | Dev | ブランドステートメント・AI方針 |
| T-37 | 404 `not-found.tsx` | P0 | 0.5p | - | Dev | 人気企画カード表示 |
| T-38 | 500 `error.tsx` | P0 | 0.3p | - | Dev | 再読み込みボタン |
| T-39 | ローディング `loading.tsx`（スケルトン） | P1 | 0.3p | - | Dev | 一覧/詳細別 |
| T-40 | 寄稿 `/contribute` + 問い合わせフォーム（Netlify Forms） | P2 | 1p | - | Dev | 送信→サンクスページ、GA4イベント |

**S2 小計: 約 19p（約 4 週間）**

---

### 🔍 S3: SEO / 計測 / QA / デプロイ

| # | タスク | 優先 | 工数 | 依存 | 担当 | 受け入れ条件 |
|---|---|---|---|---|---|---|
| T-50 | Next.js metadata API で全ページの title/description/OGP 設定 | P0 | 1p | S2完了 | Dev | seo-spec §2-3 に準拠 |
| T-51 | canonical 設定（全ページ） | P0 | 0.3p | T-50 | Dev | 絶対URL・フィルタクエリ除外 |
| T-52 | `app/sitemap.ts` 実装 | P0 | 0.5p | - | Dev | `/sitemap.xml` に全URL出力 |
| T-53 | `robots.txt` 配置 | P0 | 0.2p | - | Dev | sitemapのURL記載 |
| T-54 | デフォルトOG画像作成（1200×630） | P0 | 0.5p | - | Dev/Design | ブランドカラーで作成 |
| T-55 | JSON-LD 構造化データ実装（WebSite / CreativeWorkSeries / Article / LocalBusiness / BreadcrumbList） | P0 | 1p | S2完了 | Dev | Rich Results Testでエラー0 |
| T-56 | GA4 導入（ページビュー、Cookie同意バナー） | P0 | 1p | - | Dev | 同意後のみ発火、DebugView確認 |
| T-57 | GA4 カスタムイベント実装（anthology_view, work_view, article_view, spot_view, tag_click, related_*_click, share_click, next_work_click, contribute_click） | P0 | 1.5p | T-56 | Dev | 全11イベントが飛ぶ |
| T-58 | Cookie 同意バナー `<CookieConsentBanner>` | P0 | 1p | T-56 | Dev | localStorage保存、表示条件 |
| T-59 | Netlify 接続 + netlify.toml 設定（ヘッダ、プレビューnoindex） | P0 | 0.5p | - | Dev | PRでPreview自動生成 |
| T-60 | 本番デプロイ確認（scone-media.netlify.app） | P0 | 0.3p | T-59 | Dev | 本番URLでアクセス可 |
| T-61 | Lighthouse 計測・改善（5ページでモバイル85 / A11y 95） | P0 | 2p | S2完了 | Dev | quality-spec §1-2 の目標達成 |
| T-62 | axe DevTools 監査 + 修正 | P0 | 1p | S2完了 | Dev | critical/serious エラー0 |
| T-63 | キーボード操作テスト（全テンプレート） | P0 | 0.5p | - | Dev | Tab/Enter/Escで操作完走 |
| T-64 | モバイル実機確認（iPhone Safari / Android Chrome） | P0 | 0.5p | - | Dev | 崩れ・横スクロールなし |
| T-65 | OGP確認（Facebook Debugger / X Card Validator） | P0 | 0.3p | T-54 | Dev | プレビュー崩れなし |
| T-66 | Search Console / Bing Webmaster 登録 | P1 | 0.3p | T-60 | Dev | sitemap 送信完了 |
| T-67 | PRテンプレート・公開前チェックリスト整備 | P1 | 0.5p | - | Dev | `.github/PULL_REQUEST_TEMPLATE.md` |
| T-68 | README.md（開発者向け手順） | P1 | 0.5p | - | Dev | セットアップ・運用・デプロイ手順 |
| T-69 | プライバシーポリシー文面作成 | P1 | 0.3p | - | Dev/Legal | About or /privacy に掲載 |

**S3 小計: 約 13.5p（約 3 週間）**

---

### 🧾 初期コンテンツ制作（並行タスク）

コンテンツは S1-S3 と**並行**で制作。ローンチ2週間前には全量完成させる。

| # | タスク | 優先 | 工数 | 依存 | 担当 | 受け入れ条件 |
|---|---|---|---|---|---|---|
| C-01 | タグ20個の定義（MDXでも `content/tags.json` でも可） | P0 | 0.5p | T-11 | Dev | content-types.md の初期タグ案に沿う |
| C-02 | 企画 3本の MDX 作成（ローンチ必須） | P0 | 3p | T-11 | Dev | B-3確定 |
| C-03 | 収録作 12〜18本（AI生成ドラフト + 編集） | P0 | 5p | C-02 | Dev | 各企画に4〜6本、全文 |
| C-04 | 記事 5本（うち1本は About深掘り） | P0 | 3p | T-11 | Dev | 週1本ペースのバッファ含む |
| C-05 | スポット 3本（取材・許可取得・写真） | P0 | 3p | T-11 | Dev | photo_permission=true 確認 |
| C-06 | デフォルトOG画像・ロゴ・ファビコン | P0 | 0.5p | - | Dev/Design | 各サイズ揃える |

**C 小計: 15p（並行・実作業としては制作時間）**

---

### 🚀 ローンチ〜ローンチ後

| # | タスク | 優先 | 工数 | 依存 | 担当 | 受け入れ条件 |
|---|---|---|---|---|---|---|
| L-01 | 全 DoD（phase1-mvp-acceptance.md）チェック | P0 | 0.5p | S3完了 | Dev | 全チェック✓ |
| L-02 | 本番公開（main マージ・デプロイ確認） | P0 | 0.3p | L-01 | Dev | URL アクセス成功 |
| L-03 | Search Console での sitemap 送信・インデックスリクエスト | P0 | 0.3p | L-02 | Dev | 送信完了 |
| L-04 | SNS告知（X、その他） | P1 | 0.3p | L-02 | Dev | ポスト完了 |
| L-05 | GA4 でリアルタイムデータ確認 | P1 | 0.2p | L-02 | Dev | データ流入確認 |
| L-06 | カスタムドメイン取得・設定（ローンチ後2週間以内 / C-4） | P2 | 0.5p | L-02 | Dev | HTTPS化・301リダイレクト |

---

## 3. 依存関係図（抜粋）

```
T-01 (Next.js初期化)
  ├── T-03 (構成) ── T-11 (MDXパーサー) ── T-12 (型) ── T-13 (MDXレンダラ)
  ├── T-04 (依存導入)
  ├── T-05 (Tailwind)
  └── T-06 (フォント)
       ↓
      T-07 (layout) → T-08 (Header) + T-09 (Footer) + T-10 (Breadcrumb)
       ↓
      T-14 (サンプルMDX) → T-15 (企画詳細ひな形) → T-16 (CSS仕上げ)
       ↓
   [ S2: 全ページ実装 ]
      T-20 (Cards) → T-21 (Tag) + T-22 (Pagination) + T-23 (Related) + T-24 (Share)
       ↓
      T-25〜T-40 (各ページ)
       ↓
   [ S3: SEO/計測/QA ]
      T-50〜T-58 (SEO/GA4)
      T-59〜T-60 (Netlify)
      T-61〜T-65 (QA)
      T-66〜T-69 (整備)
       ↓
   [ L: ローンチ ]
      L-01〜L-06
```

---

## 4. 合計工数見積もり

| セクション | 工数 |
|---|---|
| S1: 基盤 | 10p |
| S2: 全ページ実装 | 19p |
| S3: SEO/計測/QA | 13.5p |
| 初期コンテンツ（並行） | 15p |
| ローンチ作業 | 1.5p |
| **合計（実装のみ）** | **44p** |
| **合計（コンテンツ含む）** | **59p** |

1日0.8p 消化換算で **約55営業日（11週間）**、週4p 消化で **約15週間**。

MVPの現実的ローンチ予定: **6〜8週間後**（初期コンテンツ制作と並行すれば圧縮可能）

---

## 5. クリティカルパス

以下のタスクが1つでも遅れるとローンチ日が伸びる：

1. T-01 → T-07 → T-08/T-09/T-10（基盤レイアウト）
2. T-11 → T-13（MDXパーサー・レンダラ）
3. T-20 → T-25〜T-35（全ページ実装）
4. T-50 → T-55（SEOメタ・構造化）
5. T-56 → T-57（GA4計測）
6. T-61 → T-62（Lighthouse / axe 監査）
7. T-59 → T-60 → L-01 → L-02（デプロイ）

---

## 6. リスクと緩和策

| リスク | 発生確率 | 影響 | 緩和策 |
|---|---|---|---|
| MDXパーサーの型設計でつまずく | 中 | 中 | T-11 でContentlayer代替も検討可。1日超えたら pivot |
| Lighthouse スコア未達（画像サイズ等） | 中 | 高 | T-61 の工数を2p確保。画像最適化を初期から徹底 |
| 初期コンテンツ制作が遅延 | 高 | 高 | バッファ本数（R-5対策）を厳守。AI生成で量産対応 |
| GA4 Cookie同意周りで詰まる | 中 | 中 | T-56/T-58 を早めに分割着手。OSSの consent-managerライブラリを検討 |
| カスタムドメイン取得の承認遅延 | 低 | 低 | ローンチは netlify.app で先行。後日移行（C-4確定） |

---

## 7. 進捗管理

- GitHub Projects（または Notion）で**カンバン管理**
- 週次レビュー（毎週月曜）: 消化ポイント / 残タスク / リスク
- 日次コミット（最低1コミット）

---

## 8. 担当（A-1 確定: エンジニア1名）

- **Dev**: 全タスク（実装・コンテンツ運用・デプロイ）
- **Design**（必要時のみ外注 or 生成）: T-54（OG画像）、C-06（ロゴ・ファビコン）
- **Legal**（必要時のみ）: T-69（プライバシーポリシー）

---

*このドキュメントは [`phase1-planning.md`](./phase1-planning.md) に基づく Phase1 成果物です。*
