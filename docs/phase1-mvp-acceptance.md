# MVP 受け入れ基準（Definition of Done）

> Phase1 成果物 / 作成日: 2026-04-28  
> 前提: [`phase0-planning.md`](./phase0-planning.md) 全未決事項確定済み  
> 目的: ローンチ可否判定の客観的チェックリスト

---

## 読み方

- `[ ]` が 1つでも未達成の場合、ローンチは**ブロック**する
- 項目は「機能」「品質」「運用」「法務」「計測」の5カテゴリに分類
- 各項目には **判定方法** を明記（「主観的に良い」を禁じる）

---

## 1. 機能 DoD（Must機能が動作すること）

### 1-1. ページ実装

- [ ] **トップページ（`/`）**：ヒーロー / スポット3-5件 / 新着企画3件 / 新着記事3件 / 人気タグ10件が表示される
- [ ] **アンソロジー企画一覧（`/anthologies`）**：カード形式、タグフィルタで絞り込み可、12件ごとにページネーション
- [ ] **アンソロジー企画詳細（`/anthologies/[slug]`）**：概要・収録作リスト（順序付き）・編集後記・関連企画が表示
- [ ] **収録作一覧（`/works`）**：企画グループ or タグ絞り込みで一覧表示
- [ ] **収録作詳細（`/works/[slug]`）**：**本文全文掲載**、所属企画バナー、次の収録作ナビ、タグ
- [ ] **記事一覧（`/articles`）**：日付降順、カード形式
- [ ] **記事詳細（`/articles/[slug]`）**：本文・関連企画・関連収録作・タグ
- [ ] **スポット一覧（`/spots`）**：エリア/種別フィルタ、カード形式
- [ ] **スポット詳細（`/spots/[slug]`）**：写真・住所・営業時間・取材日・タグ
- [ ] **タグ一覧（`/tags`）**：全タグをカテゴリ別に表示
- [ ] **タグ別一覧（`/tags/[tag]`）**：そのタグが付く全コンテンツ（企画・記事・作品・スポット混在）
- [ ] **このサイトについて（`/about`）**：ブランドステートメント表示
- [ ] **404ページ**：トップへの導線・検索フォーム or タグ一覧を表示
- [ ] **500ページ**：最低限のエラー文言と再読み込み導線

**判定方法**: Netlify Preview URL上で該当ルートをすべて手動クリック確認。コンテンツが空でもレイアウトは崩れないこと。

### 1-2. 回遊導線

- [ ] 収録作詳細の**上部**に所属企画バナーがある（最重要）
- [ ] 企画詳細に収録作が**全件**順序通り表示される
- [ ] 記事詳細に「関連アンソロジー企画」ウィジェットがある
- [ ] 全コンテンツ詳細ページにタグリンクがある
- [ ] 収録作詳細に「次の収録作」ナビがある（同企画内の次作品へ遷移可）
- [ ] グローバルナビ（ヘッダー）が全ページに存在：ロゴ／企画／記事／スポット／タグ／About
- [ ] パンくずリストが詳細ページに設置されている

**判定方法**: [`sitemap.md`](./sitemap.md) の「回遊強化チェックポイント」表と照合。

### 1-3. 検索・絞り込み

- [ ] 企画一覧でタグ複数選択による絞り込みが動作する
- [ ] スポット一覧でエリア・種別フィルタが動作する
- [ ] タグ別一覧にてコンテンツタイプ別フィルタが動作する

**判定方法**: 代表的なタグ/エリアで絞り込み→結果が該当コンテンツのみ表示されることをE2E的に確認。

---

## 2. 品質 DoD

### 2-1. パフォーマンス（Core Web Vitals）

- [ ] LCP（Largest Contentful Paint）: トップ・企画詳細・収録作詳細で **2.5秒以下**
- [ ] INP（Interaction to Next Paint）: **200ms以下**
- [ ] CLS（Cumulative Layout Shift）: **0.1以下**
- [ ] Lighthouse Performance スコア: モバイル **85以上** / デスクトップ **95以上**
- [ ] 画像はすべて `next/image` 経由で最適化・遅延読み込み
- [ ] フォントは `next/font` で配信、FOIT/FOUTを最小化

**判定方法**: Lighthouse（モバイル構成）を代表5ページ（トップ、企画一覧、企画詳細、収録作詳細、記事詳細）で計測。PageSpeed Insightsの本番URLスコアも併用。

### 2-2. アクセシビリティ（WCAG 2.1 AA 相当）

- [ ] Lighthouse Accessibility スコア: **95以上**
- [ ] すべてのページに `<h1>` が1つ存在し、見出し階層が論理的
- [ ] 画像に適切な `alt` 属性（装飾画像は `alt=""`）
- [ ] インタラクティブ要素にキーボードでフォーカス可能、フォーカスリングが可視
- [ ] カラーコントラスト比: 本文 **4.5:1以上** / 大文字 **3:1以上**
- [ ] ARIA属性の誤用がない（axe-core でエラー0）
- [ ] 言語属性 `<html lang="ja">` が設定されている

**判定方法**: Lighthouse + axe DevTools で全テンプレート種別を監査。

### 2-3. モバイル対応

- [ ] 320px〜の幅で横スクロールが発生しない
- [ ] タップターゲットが **44×44px 以上**
- [ ] グローバルナビがモバイルでハンバーガー or 適切な折りたたみ
- [ ] 画像・動画がビューポート幅を超えない

**判定方法**: Chrome DevTools のデバイスエミュレーション（iPhone SE, iPhone 14 Pro, Pixel 7, iPad）で視認確認。

### 2-4. SEO / メタ

- [ ] 全ページに固有の `<title>` と `<meta name="description">`
- [ ] OGP（`og:title`, `og:description`, `og:image`, `og:url`, `og:type`）が設定されている
- [ ] Twitter Card（`twitter:card=summary_large_image`）が設定されている
- [ ] `canonical` が正しく設定されている（タグページ・ページネーションでの重複対策）
- [ ] `sitemap.xml` を自動生成し `/sitemap.xml` で配信
- [ ] `robots.txt` を配置し sitemap.xml のURLを記載
- [ ] 構造化データ（JSON-LD）を記事・企画・スポット詳細に実装（`Article` / `CreativeWork` / `LocalBusiness`）
- [ ] タグページに導入文またはnoindexが設定されている（重複コンテンツ対策）

**判定方法**: Rich Results Test（Google）で JSON-LD の妥当性を検証。OGP Debugger（Facebook）・Card Validator（X）で表示確認。

詳細は [`phase1-seo-spec.md`](./phase1-seo-spec.md) を参照。

### 2-5. 404 / エラー

- [ ] 存在しないslugアクセスで404ページが返る（静的404でも可）
- [ ] 404ページからトップ・タグ一覧・Aboutへの導線がある
- [ ] ビルドエラー時のNetlify Preview失敗通知がSlack等で受領できる（任意）

---

## 3. 運用 DoD

- [ ] `README.md` に開発者向けセットアップ手順（`pnpm install`→`pnpm dev`）が記載
- [ ] MDXフロントマター仕様が `docs/content-types.md` に合致し、バリデーションがビルド時に動く
- [ ] コンテンツ追加フローが `docs/phase0-planning.md §3-6` の通りGit PRベースで完結する
- [ ] Netlify Preview が PR作成時に自動生成される
- [ ] `main` マージで本番（`scone-media.netlify.app`）に自動デプロイされる
- [ ] 公開前チェックリスト（phase0-planning.md §3-6）がリポジトリ内の `docs/pre-publish-checklist.md` or PRテンプレートにある

---

## 4. 法務・権利 DoD

- [ ] 収録作すべてに `is_ai_generated: true` と `ai_tool` フィールドが記録されている（R-2対策）
- [ ] スポット掲載物すべてに `photo_permission: true` が確認できる（R-3対策）。falseのものは `status: draft`
- [ ] 画像素材のライセンス情報がMDXメタデータ（`image_license` 等）に記録されている（R-4対策）
- [ ] フッターに著作権表示（© SCONE MEDIA 2026）が存在
- [ ] 「このサイトについて」ページに AI生成コンテンツである旨の表示方針が明文化されている（R-1対策）
- [ ] GA4利用のためのCookie同意バナーが全ページで表示され、「同意」前はGA4イベントが発火しない（C-3・GDPR対応）
- [ ] プライバシーポリシー（最低限のテンプレート）が `/about` または `/privacy` にある

---

## 5. 計測 DoD

- [ ] GA4 測定ID が環境変数 `NEXT_PUBLIC_GA_MEASUREMENT_ID` で注入されている
- [ ] ページビューがSPA遷移でも正しく記録される
- [ ] [`kpi.md`](./kpi.md) 定義のカスタムイベントが全て発火する:
  - [ ] `anthology_view`
  - [ ] `work_view`
  - [ ] `article_view`
  - [ ] `spot_view`
  - [ ] `tag_click`
  - [ ] `related_anthology_click`
  - [ ] `related_work_click`
  - [ ] `related_article_click`
  - [ ] `share_click`
  - [ ] `next_work_click`
  - [ ] `contribute_click`
- [ ] GA4 DebugView でイベントとパラメータが期待通り飛ぶことを確認
- [ ] 同意バナーで「同意」した場合のみGA4が初期化される

詳細は [`phase1-measurement-spec.md`](./phase1-measurement-spec.md) を参照。

---

## 6. ローンチブロッカー（絶対条件）

以下が **1つでも満たされないとローンチ不可**：

1. 機能 DoD すべてにチェック（1-1, 1-2, 1-3）
2. Lighthouse Performance モバイル 85以上 / Accessibility 95以上
3. OGP と sitemap.xml が動作
4. GA4 の `work_view` / `anthology_view` / `article_view` / `spot_view` の4つが最低限計測可能
5. Cookie同意バナーが実装されている
6. コンテンツ最小ライン（企画3本 / 収録作12本 / 記事5本 / スポット3本 / タグ20）が投入済み
7. Netlify 本番デプロイが成功し `scone-media.netlify.app` でアクセス可能

---

## 7. ローンチ後1週間以内の確認事項（ソフトDoD）

- [ ] 主要ページの表示崩れが無い（ユーザー報告ゼロ）
- [ ] Search Consoleにサイトマップ登録完了・インデックス状況確認
- [ ] GA4で実ユーザーのデータが流入し北極星指標（回遊セッション数）が測れている
- [ ] 5xxエラー率 < 0.5%

---

*このドキュメントは [`phase1-planning.md`](./phase1-planning.md) に基づき Phase1 で作成された成果物です。*
