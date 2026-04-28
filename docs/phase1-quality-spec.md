# 品質仕様（パフォーマンス / アクセシビリティ / モバイル / エラー）

> Phase1 成果物 / 作成日: 2026-04-28  
> 目的: MVP の品質基準を「測定可能な数値」で定義する

---

## 1. パフォーマンス目標

### 1-1. Core Web Vitals（モバイル優先）

| 指標 | 目標（Good） | 許容（Needs Improvement） | 失敗（Poor） |
|---|---|---|---|
| **LCP**（Largest Contentful Paint） | **≤ 2.5秒** | 2.5〜4.0秒 | > 4.0秒 |
| **INP**（Interaction to Next Paint） | **≤ 200ms** | 200〜500ms | > 500ms |
| **CLS**（Cumulative Layout Shift） | **≤ 0.1** | 0.1〜0.25 | > 0.25 |
| **FCP**（First Contentful Paint） | ≤ 1.8秒 | 1.8〜3.0秒 | > 3.0秒 |
| **TTFB**（Time to First Byte） | ≤ 800ms | 800ms〜1.8秒 | > 1.8秒 |

### 1-2. Lighthouse スコア目標

| カテゴリ | モバイル | デスクトップ |
|---|---|---|
| Performance | **≥ 85** | **≥ 95** |
| Accessibility | **≥ 95** | ≥ 95 |
| Best Practices | ≥ 95 | ≥ 95 |
| SEO | **100** | 100 |

### 1-3. ネットワーク想定条件

- **4G相当**（150ms RTT, 1.6Mbps）でテスト
- トップページで **3秒以内** に LCP 到達

### 1-4. バンドルサイズ上限

| 指標 | 上限 |
|---|---|
| First Load JS（トップページ） | 150kB gzipped |
| Route-specific JS（詳細ページ） | +50kB 以内 |
| 個別 JSチャンク | 100kB 以内 |
| 初期 CSS | 30kB 以内 |

### 1-5. 実装上の具体策

#### 画像最適化
- `next/image` を必ず使用。`width` / `height` 必須
- ヒーロー画像のみ `priority={true}`
- WebP / AVIF 自動配信
- 遅延読み込みデフォルト（priorityなし）

#### フォント最適化
- `next/font/google` で日本語フォントをセルフホスト
- `display: 'swap'`
- サブセット化: 本文フォントは JIS 第一水準＋仮名
- 見出し用 `Noto Serif JP` は wght 400, 700 のみ

#### JavaScript
- Client Componentは最小限。原則 Server Component
- 動的 import で code splitting
- Framer Motion は必要なページのみ（`next/dynamic` で遅延）
- Fuse.js（検索）は使用ページのみで読み込む

#### CSS
- Tailwind v4 の JIT モード
- 未使用クラスを PurgeCSS で排除
- クリティカル CSS はインライン（Next.js 自動）

#### SSG / ISR
- 全てのコンテンツページは **SSG**（ビルド時生成）
- 新規公開は Netlify の main マージでビルド実行

---

## 2. アクセシビリティ目標

### 2-1. 準拠レベル

**WCAG 2.1 AA 相当** を目標とする。Lighthouse Accessibility 95以上。

### 2-2. 構造

- [ ] ページごとに `<h1>` が1つ、見出し階層が論理順（h1→h2→h3）
- [ ] `<main>` / `<nav>` / `<aside>` / `<footer>` / `<header>` でランドマーク区切り
- [ ] リストは `<ul>` / `<ol>` で構造化
- [ ] テーブルは `<th scope="...">` を指定

### 2-3. キーボード操作

- [ ] 全ての操作可能要素（link / button / input）にキーボードでフォーカス可能
- [ ] フォーカスリングが視認できる（`outline: 2px solid #8B4513` 等）
- [ ] タブ順序が DOM 順と一致
- [ ] Skip link: ヘッダーに「本文へスキップ」をTabで最初にフォーカスさせる
- [ ] モーダル/ドロワーは Esc で閉じる、内部フォーカストラップ

### 2-4. 画像 / メディア

- [ ] 意味のある画像に `alt` 属性を設定
- [ ] 装飾画像は `alt=""`
- [ ] 画像内の文字は原則避ける（OGP画像を除く）

### 2-5. カラーコントラスト

| テキスト種別 | 最低コントラスト比 |
|---|---|
| 本文（16px 以上） | **4.5:1** |
| 大文字（18px+ or 14px+ 太字） | **3:1** |
| UIコントロール・フォーカスリング | **3:1** |

カラーパレット `primary (#A0826D) on #FFFEFB` 等の組み合わせを事前検証する。

### 2-6. フォーム

- [ ] `<label>` と `<input>` を `for`/`id` で紐づけ
- [ ] エラーメッセージは `aria-describedby` で関連付け
- [ ] 必須は `required` + 視覚表示（「必須」ラベル）
- [ ] エラー時に該当フィールドへフォーカス自動移動

### 2-7. 動きのあるコンテンツ

- [ ] `prefers-reduced-motion: reduce` を尊重
- [ ] 自動再生のカルーセルは**使用しない**（ヒーローは手動操作のみ）
- [ ] Framer Motion のアニメーションを 100ms 以内・opacity中心に抑える

### 2-8. 言語

- [ ] `<html lang="ja">`
- [ ] 外国語の混在時は `<span lang="en">` 等で指定

### 2-9. ARIA

- [ ] セマンティック HTML を優先。不要な ARIA を乱用しない
- [ ] `aria-label` / `aria-labelledby` はランドマークの名前が曖昧な場合に使用
- [ ] 状態表現 (`aria-expanded`, `aria-selected`) は実装通りに更新

### 2-10. Lighthouse / axe チェック

- [ ] axe-core で critical / serious エラー **0件**
- [ ] Lighthouse Accessibility **95以上**（100目標）

---

## 3. モバイル対応

### 3-1. 対応デバイス

| 分類 | 代表デバイス | 幅 |
|---|---|---|
| 最小 | iPhone SE (2nd) | 375px |
| 標準 | iPhone 14 Pro | 393px |
| 大 | Pixel 7 Pro | 412px |
| タブレット縦 | iPad mini | 768px |
| タブレット横 | iPad Pro 11 | 1024px |

### 3-2. レイアウト規則

- [ ] 320px 幅までデザイン崩れゼロ（対応下限）
- [ ] 横スクロールが発生しない
- [ ] タップターゲット **44×44px 以上**（WCAG 推奨）
- [ ] タップターゲット間隔 **8px 以上**
- [ ] 画像・動画が viewport 幅を超えない
- [ ] フォントサイズ最小 **14px**（本文 16px）

### 3-3. モバイルナビ

- [ ] `md` 未満（< 768px）: ハンバーガーメニュー
- [ ] メニュー展開時は body を `overflow: hidden`
- [ ] Escキー・背景タップで閉じる

### 3-4. タッチ操作

- [ ] hover に依存した UI を作らない（常にタップで代替）
- [ ] 長押しメニューは不使用
- [ ] 横スワイプで誤操作しない（スポットギャラリー等）

### 3-5. モバイル特有の最適化

- [ ] `viewport` メタタグ: `width=device-width, initial-scale=1`
- [ ] `user-scalable=no` は**付けない**（アクセシビリティ配慮）
- [ ] `<meta name="theme-color" content="#A0826D">` で PWA 風ヘッダ

### 3-6. QA 手順

- Chrome DevTools デバイスエミュレーション（iPhone SE, 14 Pro, Pixel 7, iPad）で全テンプレートを視認
- 実機（Safari iOS, Chrome Android）で少なくとも1回確認
- 縦横の両方向を確認

---

## 4. エラー処理

### 4-1. 404 ページ（`app/not-found.tsx`）

- [ ] レイアウト（ヘッダー・フッター）は維持
- [ ] h1: 「お探しのページが見つかりません」
- [ ] 説明文: 「URL が変更されたか、コンテンツが削除された可能性があります。」
- [ ] 導線: トップへ戻る / タグ一覧 / 人気企画カード 3件
- [ ] `noindex`
- [ ] 戻るボタン（window.history.back）を提供しない（履歴依存を避ける）

### 4-2. 500 / エラーバウンダリ（`app/error.tsx`）

- [ ] h1: 「エラーが発生しました」
- [ ] 説明文: 「一時的な不具合の可能性があります。時間を置いて再度お試しください。」
- [ ] 「再読み込み」ボタン（`reset()` 呼び出し）
- [ ] トップへ戻るリンク
- [ ] `noindex`
- [ ] console.error でエラー情報を出力（ローカル・デバッグ用）
- [ ] 本番では Sentry等のエラートラッキングは **MVP外**（Phase 2で検討）

### 4-3. 空状態・ローディング

- [ ] 一覧の 0件: 「まだコンテンツがありません」+ 代替導線
- [ ] フィルタ結果 0件: 「該当なし」+「フィルタを解除」リンク
- [ ] ローディング（`loading.tsx`）: スケルトンUI
- [ ] 取得失敗: 「読み込みに失敗しました」+ 再試行ボタン

### 4-4. ビルドエラー

- [ ] `status: draft` で必須フィールドが欠けていてもビルド失敗しない（skip）
- [ ] `status: published` で必須フィールドが欠けている場合は**ビルド失敗**（品質担保）
- [ ] 欠損箇所を Netlify のビルドログに明示

---

## 5. セキュリティ（MVP最小限）

### 5-1. HTTPS

- [ ] Netlify の自動HTTPS で全ページ HTTPS 配信
- [ ] HTTP → HTTPS リダイレクト（Netlify デフォルト）

### 5-2. セキュリティヘッダ（`netlify.toml`）

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
```

### 5-3. CSP（Content Security Policy）

MVPは緩め設定（GA4 と画像 CDN を許可）：

```
default-src 'self';
script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self' data:;
connect-src 'self' https://www.google-analytics.com;
```

### 5-4. 外部リンク

- [ ] `target="_blank"` には必ず `rel="noopener noreferrer"`

---

## 6. ブラウザ対応範囲

| ブラウザ | 対応バージョン |
|---|---|
| Chrome | 最新2バージョン |
| Safari | iOS 15+ / macOS Safari 15+ |
| Firefox | 最新2バージョン |
| Edge | 最新2バージョン |
| IE11 | **非対応**（明示） |

Next.js 15 のデフォルト polyfill に従う。

---

## 7. ログ・モニタリング（MVPレベル）

### 7-1. Netlify Analytics

- 有料オプションだが、ローンチ直後は一旦無効。GA4 で代替

### 7-2. ビルド失敗通知

- Netlify → Email 通知で運用者に届くよう設定

### 7-3. Lighthouse CI（オプション）

- GitHub Actions で PR ごとに Lighthouse を回せるが、MVPでは手動実施
- Phase 2 で CI 化を検討

---

## 8. パフォーマンス QA 手順

### 開発中
1. Chrome DevTools の Lighthouse（モバイル/デスクトップ別）を実行
2. Performance タブで LCP / CLS を確認
3. Network タブで First Load JS を計測

### リリース前
1. 代表 5ページ（トップ / 企画一覧 / 企画詳細 / 収録作詳細 / 記事詳細）で Lighthouse を実行
2. PageSpeed Insights に本番URLを入力してスコア確認
3. Core Web Vitals 目標を全ページで満たすまで調整

---

## 9. アクセシビリティ QA 手順

### 開発中
1. axe DevTools 拡張機能で全テンプレートを検査
2. キーボードのみでナビゲーション（Tab / Enter / Escape / ArrowKeys）
3. VoiceOver（macOS）または NVDA（Windows）で見出し・ランドマークを読み上げ確認

### リリース前
1. 全テンプレート種別で axe エラー **0件**
2. キーボードだけで「トップ→企画→収録作」を完走できる
3. `prefers-reduced-motion` 有効時の動作確認

---

## 10. 未確定事項（本仕様で残されたもの）

- [ ] Sentry / エラートラッキングの導入可否（Phase 2で検討）
- [ ] Lighthouse CI の GitHub Actions 化（Phase 2で検討）
- [ ] PWA 化（オフライン対応）（Phase 3で検討）
- [ ] 画像の AVIF 変換率（Next.js デフォルトに任せる）

---

*このドキュメントは [`phase1-planning.md`](./phase1-planning.md) に基づく Phase1 成果物です。*
