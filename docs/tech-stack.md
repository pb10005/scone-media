# 推薦技術スタック

> フェーズ0設計書の付属ドキュメント  
> 作成日: 2026-04-28  
> 前提条件: A-1（エンジニア1名）、C-1（商用利用可OSS）

---

## 決定方針

- **全コンポーネントが商用利用可OSS**であること（C-1）
- **エンジニア1名でフルスタック運用可能**であること（A-1）
- **ランニングコストを最小化**（無料枠で運用開始できること）
- **コンテンツをGit管理**（MDXファイルベース。レビュー・差し戻しをPRで管理）

---

## 推薦スタック一覧

| レイヤー | 採用技術 | ライセンス | 理由 |
|---|---|---|---|
| フレームワーク | **Next.js 15** | MIT | App Router + SSG/ISR対応。エコシステム最大。商用無料 |
| 言語 | **TypeScript** | Apache 2.0 | 型安全。Next.jsとの親和性が高い |
| コンテンツ管理 | **MDX + gray-matter** | MIT | MarkdownにJSXが使える。Gitでバージョン管理 |
| コンテンツ処理 | **Contentlayer2** or **next-mdx-remote** | MIT | MDXファイルをNext.jsの型付きデータとして扱う |
| スタイリング | **Tailwind CSS v4** | MIT | ユーティリティファースト。カスタムデザイン容易 |
| UIコンポーネント | **shadcn/ui** | MIT | Tailwind基盤のコピー型コンポーネント集 |
| 検索（タグ絞り込み） | **Fuse.js** | Apache 2.0 | クライアントサイド全文検索。サーバー不要 |
| 画像最適化 | **next/image**（組み込み） | MIT | WebP変換・遅延読み込み自動化 |
| アイコン | **Lucide React** | ISC | MIT互換。商用利用可 |
| フォーム（お問い合わせ） | **React Hook Form** | MIT | 軽量・高性能 |
| アニメーション | **Framer Motion** | MIT | ページトランジション等 |
| テスト | **Vitest + Testing Library** | MIT | 高速。Next.jsとの親和性が高い |
| Lint/Format | **ESLint + Prettier** | MIT | コード品質維持 |

---

## ホスティング推薦（C-2未確定のため複数案）

| 案 | サービス | 無料枠 | 備考 |
|---|---|---|---|
| **推薦A** | **Vercel** | 無料枠あり（Hobby） | Next.jsの開発元。ISR/Edge対応が最も容易 |
| 案B | **Cloudflare Pages** | 無料枠あり | 高速CDN。Next.jsアダプター必要 |
| 案C | **Netlify** | 無料枠あり | 設定簡単だがNext.jsの全機能は非対応 |

**推薦**：案A（Vercel Hobby）でスタート。PVが増えてから有料プランへ移行。

---

## アクセス解析推薦（C-3未確定のため複数案）

| 案 | ツール | コスト | プライバシー | 備考 |
|---|---|---|---|---|
| **推薦A** | **Plausible Analytics** | 有料（$9/月〜） | GDPRフレンドリー。Cookie不要 | オープンソース版をセルフホスト可（MIT） |
| 案B | **Google Analytics 4** | 無料 | Cookie同意バナーが必要 | 機能豊富だが設定複雑 |
| 案C | **Umami** | 無料（セルフホスト） | Cookie不要。OSSで完全自己管理 | MIT。Vercel + Supabaseで無料運用可 |

**推薦**：コスト優先 → 案C（Umami セルフホスト）。手間省略 → 案B（GA4）。

---

## コンテンツ管理フロー（Git運用）

```
ローカル環境
  ↓ MDXファイル作成・編集
  ↓ git push origin feature/content/xxx
GitHub リポジトリ
  ↓ PR作成 → Vercel Preview自動生成
  ↓ プレビューURLで最終確認
  ↓ mainブランチにマージ
Vercel
  ↓ 自動ビルド・デプロイ（通常2〜3分）
  本番公開
```

---

## ディレクトリ構成案（Next.js App Router）

```
scone-media/
├── app/
│   ├── page.tsx                    # トップページ
│   ├── anthologies/
│   │   ├── page.tsx                # 企画一覧
│   │   └── [slug]/page.tsx         # 企画詳細
│   ├── works/
│   │   ├── page.tsx                # 収録作一覧
│   │   └── [slug]/page.tsx         # 収録作詳細
│   ├── articles/
│   │   ├── page.tsx                # 記事一覧
│   │   └── [slug]/page.tsx         # 記事詳細
│   ├── spots/
│   │   ├── page.tsx                # スポット一覧
│   │   └── [slug]/page.tsx         # スポット詳細
│   ├── tags/
│   │   ├── page.tsx                # タグ一覧
│   │   └── [tag]/page.tsx          # タグ別一覧
│   ├── about/page.tsx
│   └── contribute/page.tsx
├── content/                        # MDXコンテンツ（Git管理）
│   ├── anthologies/                # 企画MDXファイル
│   ├── works/                      # 収録作MDXファイル
│   ├── articles/                   # 記事MDXファイル
│   └── spots/                      # スポットMDXファイル
├── components/                     # 共通コンポーネント
├── lib/                            # MDXパーサー・ユーティリティ
├── public/                         # 静的ファイル（画像等）
└── docs/                           # このフェーズ0設計書
```

---

## MDXフロントマター例

### アンソロジー企画

```yaml
---
title: "夜の縁側"
slug: "yoru-no-engawa"
description: "夜の静けさに宿る言葉たちを集めたアンソロジー。"
theme: "郷愁、夜、日常"
cover_image: "/images/anthologies/yoru-no-engawa.jpg"
tags: ["短編", "現代文学", "郷愁"]
works: ["engawa-no-mushi", "tsuki-no-oto"]
published_at: "2026-05-01T10:00:00Z"
status: "published"
---
```

### スポット

```yaml
---
title: "スコーン工房 代官山店"
slug: "scone-kobo-daikanyama"
description: "代官山の路地裏にひっそりと佇む手作りスコーンの専門店。"
spot_type: "bakery"
address: "東京都渋谷区代官山町〇〇"
area: "代官山"
access: "東急東横線 代官山駅から徒歩3分"
business_hours: "11:00〜18:00（月曜定休）"
price_range: "mid"
tags: ["東京", "スコーン店", "代官山"]
visited_at: "2026-04-15"
photo_permission: true
published_at: "2026-05-10T10:00:00Z"
status: "published"
---
```

---

## ライセンス管理表

| 技術 | ライセンス | 商用利用 | 確認日 |
|---|---|---|---|
| Next.js | MIT | ○ | 2026-04-28 |
| TypeScript | Apache 2.0 | ○ | 2026-04-28 |
| Tailwind CSS | MIT | ○ | 2026-04-28 |
| shadcn/ui | MIT | ○ | 2026-04-28 |
| MDX | MIT | ○ | 2026-04-28 |
| gray-matter | MIT | ○ | 2026-04-28 |
| next-mdx-remote | MPL-2.0 | ○ | 2026-04-28 |
| Fuse.js | Apache 2.0 | ○ | 2026-04-28 |
| Lucide React | ISC | ○ | 2026-04-28 |
| React Hook Form | MIT | ○ | 2026-04-28 |
| Framer Motion | MIT | ○ | 2026-04-28 |
| Vitest | MIT | ○ | 2026-04-28 |

> ライセンスは依存関係更新時に再確認すること（年1回以上推奨）。

---

*このドキュメントは [`phase0-planning.md`](./phase0-planning.md) の付属定義書です。*
