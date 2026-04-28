# Phase1 成果物サマリ

> 作成日: 2026-04-28  
> Phase1 担当: AIエージェント（フェーズ1：MVP開発の設計）  
> ステータス: **✅ 設計ドキュメント完成。実装（S1）着手可能**

---

## Phase1 のゴール（再掲）

[`phase1-planning.md`](./phase1-planning.md) より：

> 仕様の抜け漏れを潰し、実装タスクを分解し、品質基準を満たすMVPを期限内に出す。

### 要求された成果物（Phase1 指示書）

| # | 成果物 | 本リポジトリでの対応 |
|---|---|---|
| 1 | 実装ToDo（優先度・工数・依存・担当） | [`phase1-tasks.md`](./phase1-tasks.md) |
| 2 | 画面/ページ仕様 | [`phase1-page-specs.md`](./phase1-page-specs.md) |
| 3 | コンテンツモデル | [`content-types.md`](./content-types.md)（Phase0で定義済み） |
| 4 | SEO/OGP/サイトマップ/構造化データ | [`phase1-seo-spec.md`](./phase1-seo-spec.md) |
| 5 | 受け入れ基準（DoD） | [`phase1-mvp-acceptance.md`](./phase1-mvp-acceptance.md) |

### 追加で作成した補助成果物

| # | 成果物 | 目的 |
|---|---|---|
| 6 | [`phase1-quality-spec.md`](./phase1-quality-spec.md) | パフォーマンス／アクセシビリティ／モバイル／エラー基準 |
| 7 | [`phase1-forms-spec.md`](./phase1-forms-spec.md) | 寄稿フォーム（Netlify Forms）仕様 |
| 8 | [`phase1-measurement-spec.md`](./phase1-measurement-spec.md) | GA4 計測・Cookie 同意の実装仕様 |
| 9 | [`phase1-open-questions.md`](./phase1-open-questions.md) | Phase1 中に発生した未確定事項の集約 |

---

## ドキュメント全体像

```
docs/
├── phase0-planning.md          ✅ Phase0: 要件定義・全未決事項解決
├── phase1-planning.md          ✅ Phase1: 作業手順（与件）
│
├── content-types.md            📦 コンテンツモデル定義（Phase0）
├── sitemap.md                  🗺️ サイト構造・回遊導線（Phase0）
├── kpi.md                      📊 KPI・計測設計（Phase0）
├── tech-stack.md               🔧 技術選定（Phase0）
│
├── phase1-summary.md           📘 Phase1 成果物サマリ（本ドキュメント）
├── phase1-mvp-acceptance.md    ✅ 受け入れ基準（DoD）
├── phase1-page-specs.md        🎨 ページ別詳細仕様
├── phase1-seo-spec.md          🔍 SEO/OGP/構造化データ
├── phase1-quality-spec.md      ⚡ パフォーマンス/A11y/モバイル
├── phase1-tasks.md             📋 実装タスク表
├── phase1-forms-spec.md        📝 フォーム仕様
├── phase1-measurement-spec.md  📈 GA4 計測仕様
└── phase1-open-questions.md    ❓ 未確定事項
```

---

## Phase1 で確定した事項（ハイライト）

### 技術決定

| 項目 | 決定 | 根拠ドキュメント |
|---|---|---|
| フレームワーク | Next.js 15 App Router（SSG） | tech-stack.md |
| パッケージ管理 | pnpm / Node 22 LTS | phase1-open-questions.md Q-03 |
| コンテンツ処理 | next-mdx-remote + gray-matter + zod | tech-stack.md + Q-03 |
| スタイル | Tailwind CSS v4（スコーンカラー） | tech-stack.md + page-specs §共通仕様 |
| ホスティング | Netlify（C-2確定） | phase0-planning.md |
| 解析 | GA4 + Cookie同意バナー（C-3確定） | measurement-spec.md |
| フォーム | Netlify Forms | forms-spec.md |

### 設計確定

- **14ページ分**のページ仕様（トップ、企画一覧/詳細、収録作一覧/詳細、記事一覧/詳細、スポット一覧/詳細、タグ一覧/タグ別、About、寄稿、404、500）
- **17コンポーネント**の役割と配置（page-specs §共通コンポーネント一覧）
- **14種のGA4イベント**の発火条件・パラメータ
- **5種のJSON-LD**（WebSite/CreativeWorkSeries/Article/LocalBusiness/BreadcrumbList）
- **受け入れ基準53項目**（機能/品質/運用/法務/計測の5カテゴリ）

### 工数見積もり

| セクション | 工数 | 期間目安 |
|---|---|---|
| S1: 基盤セットアップ | 10p | 2週間 |
| S2: 全ページ実装 | 19p | 4週間 |
| S3: SEO/計測/QA/デプロイ | 13.5p | 3週間 |
| 初期コンテンツ制作（並行） | 15p | 並行 |
| ローンチ作業 | 1.5p | 1日 |
| **合計（実装+コンテンツ）** | **59p** | **6〜8週間** |

---

## Phase1 フェーズゲート（実装開始前チェック）

[`phase1-open-questions.md`](./phase1-open-questions.md) §13 の 🔴 項目（S1着手前に決めるべき未確定事項）：

- [ ] Q-01-1: サイト名の表記確定
- [ ] Q-01-4: AI生成コンテンツの表示方針
- [ ] Q-01-6: 著者名の表記ルール
- [x] Q-03-1: パッケージマネージャ（**pnpm 確定**）
- [x] Q-03-3: MDX処理（**next-mdx-remote + gray-matter 確定**）
- [ ] Q-07-1: Netlify アカウント

🔴 項目のうち **3件（Q-01-1 / Q-01-4 / Q-01-6 / Q-07-1）が未決**。運用者の決定が必要。

---

## 次のアクション

### Phase 1（実装フェーズ）の開始

Phase1 の設計ドキュメントは完成。実装着手に進むには次の2択：

1. **オプションA: S1（基盤セットアップ）を即着手**  
   運用者が 🔴 未決項目を回答する間、並行してNext.js初期化・共通レイアウトを進める。成果物ドキュメントに従って着実に実装できる状態。

2. **オプションB: 未決項目の解決を待つ**  
   Q-01-1/4/6（ブランド・AI方針）が解決してから S1 着手。作り直しリスクがやや下がる。

**推奨: オプションA**  
未決の Q-01 系はコンポーネント差し替えで後から対応可能（Header/About の文言調整のみ）。基盤実装を先行する方が期間短縮に効く。

---

## Phase1 → Phase2 への申し送り事項（今後の課題）

Phase1 で「MVP外」と明示した項目（フェーズ2 以降で扱う）：

- 寄稿フォームの管理画面（受信管理・返信ステータス）
- 広告・寄付モデルの実装（D-2確定済みだが実装はPhase2）
- Sentry / エラートラッキング
- Lighthouse CI（GitHub Actions 化）
- ダークモード対応
- BigQuery export / Looker Studio ダッシュボード
- 著者プロフィールページ（Could）
- ブックマーク機能（Could）
- ニュースレター登録（Could）
- サイト内全文検索
- RSS自動配信
- 多言語対応
- 有料会員・課金機能

これらは [`phase0-planning.md`](./phase0-planning.md) §3-2 の Could 項目と対応。

---

## 関連リンク

### Phase0（前フェーズ）
- [phase0-planning.md](./phase0-planning.md) - 要件定義・MVPスコープ確定
- [content-types.md](./content-types.md) - コンテンツモデル
- [sitemap.md](./sitemap.md) - サイト構造
- [kpi.md](./kpi.md) - KPI 設計
- [tech-stack.md](./tech-stack.md) - 技術スタック

### Phase1（本フェーズ）
- [phase1-planning.md](./phase1-planning.md) - Phase1 指示書
- [phase1-mvp-acceptance.md](./phase1-mvp-acceptance.md) - **受け入れ基準（DoD）**
- [phase1-page-specs.md](./phase1-page-specs.md) - **ページ仕様**
- [phase1-seo-spec.md](./phase1-seo-spec.md) - **SEO/OGP/JSON-LD**
- [phase1-quality-spec.md](./phase1-quality-spec.md) - **品質基準**
- [phase1-tasks.md](./phase1-tasks.md) - **実装タスク表**
- [phase1-forms-spec.md](./phase1-forms-spec.md) - **フォーム仕様**
- [phase1-measurement-spec.md](./phase1-measurement-spec.md) - **GA4 計測仕様**
- [phase1-open-questions.md](./phase1-open-questions.md) - **未確定事項**

---

*Phase1 成果物はすべて [`phase1-planning.md`](./phase1-planning.md) の指示に基づき作成されています。*
