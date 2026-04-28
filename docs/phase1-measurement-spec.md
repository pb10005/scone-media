# GA4 計測実装仕様

> Phase1 成果物 / 作成日: 2026-04-28  
> 依存: [`kpi.md`](./kpi.md), [`phase0-planning.md`](./phase0-planning.md) §3-5  
> 目的: GA4 の導入・Cookie同意・イベント設計を実装レベルで確定させる

---

## 1. 方針

### 1-1. 導入目的

1. 北極星指標（月間アクティブ回遊セッション数）の計測
2. 主要ページ（企画/作品/記事/スポット）の閲覧計測
3. 回遊導線のクリック計測（`*_click`）
4. GDPR / 改正電気通信事業法対応（Cookie同意前はイベント非発火）

### 1-2. 使用サービス

- **GA4**（C-3 確定）
- 測定ID: `G-XXXXXXXXXX`（環境変数 `NEXT_PUBLIC_GA_MEASUREMENT_ID`）
- GTM は使わず、`gtag.js` 直接実装（シンプル優先）

---

## 2. 環境変数

| 変数名 | 用途 | 値（例） |
|---|---|---|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 測定ID | `G-XXXXXXXXXX` |
| `NEXT_PUBLIC_SITE_URL` | 絶対URL生成用 | `https://scone-media.netlify.app` |

未設定時は GA4 を**初期化しない**（ローカル開発・preview 環境で検証可能に）。

---

## 3. Consent Mode（Cookie同意）

### 3-1. 方針

- 初回訪問時に Cookie同意バナーを表示
- **同意前は GA4 スクリプトをロードしない**（厳密な opt-in）
- 同意状態は `localStorage` に保存

### 3-2. 保存形式

```ts
// localStorage key: scone_cookie_consent
type ConsentState = {
  status: 'granted' | 'denied' | 'pending';
  timestamp: string; // ISO8601
  version: '1.0'; // ポリシー更新時にバージョン上げて再取得
};
```

### 3-3. 状態遷移

```
初回訪問 → status=pending（バナー表示・GA非ロード）
  ├── 「同意する」クリック → granted → GA4スクリプト挿入・初期化
  └── 「拒否する」クリック → denied → GA4非ロード（変わらず）

再訪
  ├── granted → GA4 初期化（バナー非表示）
  ├── denied → GA4 非ロード（バナー非表示、ただしフッターに「設定を変更する」）
  └── pending → バナー表示継続
```

### 3-4. バナーUI

- 画面下部 fixed, `z-index: 50`
- メッセージ: 「当サイトはサービス改善のため Google Analytics を使用します。Cookieの使用に同意いただけますか？」
- ボタン:
  - 主ボタン: 「同意する」（primary）
  - 副ボタン: 「拒否する」（outline）
  - テキストリンク: 「詳細（プライバシーポリシー）」 → `/about#privacy`

### 3-5. 設定変更の導線

- フッターに「Cookie設定を変更」リンク
- クリックで localStorage をクリア → バナー再表示

---

## 4. スクリプト実装

### 4-1. gtag ローダー

```tsx
// components/analytics/GoogleAnalytics.tsx
'use client';
import Script from 'next/script';

export function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  if (!measurementId) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            send_page_view: false, // 手動でpage_viewを送る
            anonymize_ip: true
          });
        `}
      </Script>
    </>
  );
}
```

### 4-2. 同意ゲート

```tsx
// components/analytics/AnalyticsGate.tsx
'use client';
import { useEffect, useState } from 'react';
import { GoogleAnalytics } from './GoogleAnalytics';
import { getConsent } from '@/lib/consent';

export function AnalyticsGate() {
  const [consent, setConsent] = useState<'granted' | 'denied' | 'pending'>('pending');

  useEffect(() => {
    setConsent(getConsent().status);
    const handler = () => setConsent(getConsent().status);
    window.addEventListener('scone:consent-change', handler);
    return () => window.removeEventListener('scone:consent-change', handler);
  }, []);

  if (consent !== 'granted') return null;
  return <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!} />;
}
```

### 4-3. ページビュー送信

```tsx
// components/analytics/PageViewTracker.tsx
'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window.gtag !== 'function') return;
    const url = pathname + (searchParams.toString() ? `?${searchParams}` : '');
    window.gtag('event', 'page_view', {
      page_path: url,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}
```

### 4-4. 配置

`app/layout.tsx` に:

```tsx
<AnalyticsGate />
<PageViewTracker />
<CookieConsentBanner />
```

---

## 5. カスタムイベント一覧（完全版）

### 5-1. ページ閲覧系（View Events）

| イベント名 | 発火タイミング | 必須パラメータ | 任意パラメータ |
|---|---|---|---|
| `anthology_view` | 企画詳細ページ表示 | `anthology_slug` | `tag_list` |
| `work_view` | 収録作詳細ページ表示 | `work_slug`, `anthology_slug` | `format`, `is_ai_generated` |
| `article_view` | 記事詳細ページ表示 | `article_slug` | `article_type`, `tag_list` |
| `spot_view` | スポット詳細ページ表示 | `spot_slug` | `area`, `spot_type` |

実装場所: 各詳細ページの Server Component 内で Client用のイベント送信 Hook を呼ぶ

```tsx
// hooks/useContentView.ts
'use client';
import { useEffect } from 'react';

export function useContentView(event: string, params: Record<string, string | boolean>) {
  useEffect(() => {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', event, params);
  }, []);
}
```

使用例:
```tsx
useContentView('anthology_view', {
  anthology_slug: anthology.slug,
  tag_list: anthology.tags.join(','),
});
```

### 5-2. クリック系（Click Events）

| イベント名 | 発火タイミング | パラメータ |
|---|---|---|
| `tag_click` | タグリンクをクリック | `tag_name`, `tag_category`, `source_page_type` |
| `related_anthology_click` | 関連/所属企画リンククリック | `target_anthology_slug`, `source_page_type`, `source_slug` |
| `related_work_click` | 関連/収録作リスト内のクリック | `target_work_slug`, `source_page_type`, `source_slug` |
| `related_article_click` | 関連記事クリック | `target_article_slug`, `source_page_type`, `source_slug` |
| `next_work_click` | 「次の収録作」ナビクリック | `target_work_slug`, `anthology_slug`, `direction`（prev/next） |
| `contribute_click` | `/contribute` への遷移時 | `source_page` |
| `share_click` | シェアボタンクリック | `platform`（x/copy/gmaps）, `content_type`, `content_slug` |

### 5-3. フォーム系

| イベント名 | 発火タイミング | パラメータ |
|---|---|---|
| `contribute_form_view` | フォーム要素スクロールイン | - |
| `contact_submit` | 送信成功 | `form_type`, `submission_source` |
| `contact_submit_error` | 送信失敗 | `form_type`, `error_reason` |

### 5-4. パラメータ値の型

- すべて **string**（数値も文字列化）
- `tag_list` はカンマ区切り（例: `"短編,郷愁,夜"`）
- `source_page_type` の列挙値: `home` / `anthology_list` / `anthology_detail` / `work_list` / `work_detail` / `article_list` / `article_detail` / `spot_list` / `spot_detail` / `tag_list` / `tag_detail` / `about`

---

## 6. 実装ヘルパー

### 6-1. tagイベント送信関数

```ts
// lib/analytics.ts
type EventParams = Record<string, string | boolean | number>;

export function trackEvent(name: string, params: EventParams = {}) {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', name, params);
}
```

### 6-2. 内部リンクラッパ（計測付きLink）

```tsx
// components/analytics/TrackedLink.tsx
'use client';
import Link from 'next/link';
import { trackEvent } from '@/lib/analytics';

type Props = React.ComponentProps<typeof Link> & {
  eventName: string;
  eventParams?: Record<string, string>;
};

export function TrackedLink({ eventName, eventParams, onClick, ...rest }: Props) {
  return (
    <Link
      {...rest}
      onClick={(e) => {
        trackEvent(eventName, eventParams);
        onClick?.(e);
      }}
    />
  );
}
```

### 6-3. タグチップの計測統合

```tsx
<TrackedLink
  href={`/tags/${tag.slug}`}
  eventName="tag_click"
  eventParams={{
    tag_name: tag.name,
    tag_category: tag.category ?? 'unknown',
    source_page_type: 'work_detail',
  }}
>
  #{tag.name}
</TrackedLink>
```

---

## 7. 北極星指標の計測

### 7-1. 定義の再掲

> 月間アクティブ回遊セッション数  
> = 1セッション内で 2ページ以上（異なるコンテンツページ）を閲覧したセッションの月間合計

### 7-2. GA4 での集計方法

GA4 の標準メトリクス「**エンゲージメント > エンゲージセッション数**」を代替指標として使用。

より厳密に計測したい場合：
- Looker Studio / BigQuery export で以下クエリを運用
  - セッションごとに `event_name='page_view'` のユニーク `page_path` が 2以上

### 7-3. 代替: カスタムイベント

セッション開始時に `session_start_path` を記録し、2ページ目遷移時に `engaged_session` イベントを送る方法もあるが、MVPでは GA4 標準指標で十分。

---

## 8. DebugView / Test Mode

### 8-1. 開発時デバッグ

ローカル開発時は **GA4 DebugView** を使用：

```tsx
// lib/analytics.ts（デバッグ用）
if (process.env.NODE_ENV === 'development') {
  window.gtag?.('config', measurementId, { debug_mode: true });
}
```

DebugView にリアルタイムでイベントが表示される。

### 8-2. 本番での検証

- Chrome 拡張「GA Debugger」でイベント送信を確認
- 本番でも Realtime レポートにデータ流入を確認

---

## 9. Netlify Deploy Preview での扱い

- プレビュー環境では **GA4 を初期化しない**（本番データの汚染防止）
- 方法:

```tsx
const isProduction = process.env.CONTEXT === 'production';
if (!isProduction) return null;
```

または `NEXT_PUBLIC_GA_MEASUREMENT_ID` を **本番環境でのみ設定**する（Netlify の環境変数スコープ機能）。

---

## 10. プライバシー / 法令対応

### 10-1. GDPR / 改正電気通信事業法

- [ ] 明示的な opt-in（同意バナー）
- [ ] 拒否した場合 GA4 を**一切ロードしない**
- [ ] プライバシーポリシーに GA4 利用を明記
- [ ] IPアドレスの匿名化（`anonymize_ip: true`）
- [ ] Googleシグナル（広告機能）: **無効**（MVP時点）
- [ ] データ保持期間: 14ヶ月（GA4 デフォルト）

### 10-2. ユーザーの権利

- [ ] 設定変更導線（フッターの「Cookie設定」）
- [ ] データ削除請求フロー（メール問い合わせで対応、「このサイトについて」に記載）

---

## 11. ダッシュボード / レポート

### 11-1. GA4 標準レポート

- Realtime
- レポート > エンゲージメント > 概要・イベント・ページ
- レポート > 集客 > ユーザー獲得

### 11-2. カスタムレポート（MVP後半）

- 週次ダッシュボード：UU / セッション / PV/セッション / 回遊セッション数（kpi.md §ダッシュボード設計）
- 月次ダッシュボード：北極星指標 / リピーター率 / コンテンツ別PV

MVP 時点では GA4 の探索レポートで代替し、Looker Studio は Phase 2 で検討。

---

## 12. 実装チェックリスト（DoDとの対応）

- [ ] 環境変数 `NEXT_PUBLIC_GA_MEASUREMENT_ID` を Netlify に設定
- [ ] `<GoogleAnalytics>` コンポーネント実装（同意後のみレンダー）
- [ ] `<CookieConsentBanner>` 実装（状態遷移・localStorage）
- [ ] フッターに「Cookie設定を変更」リンク
- [ ] `<PageViewTracker>` で SPA 遷移時の page_view 発火
- [ ] §5 の全イベント（計14個）を実装
- [ ] DebugView で全イベントが期待通り飛ぶことを確認
- [ ] Netlify Preview で GA4 が**非ロード**であることを確認
- [ ] プライバシーポリシーに GA4 利用を明記
- [ ] Lighthouse Best Practices に影響なし（Script `afterInteractive`）

---

## 13. イベント送信のテスト観点

| テスト項目 | 期待 |
|---|---|
| 初回訪問 → バナー表示 → 同意 → GA4 ロード | `page_view` が発火する |
| 初回訪問 → バナー拒否 → ページ遷移 | GA4 ネットワーク通信ゼロ |
| 同意済み → リロード | バナー非表示 / GA4 継続ロード |
| 同意済み → タグクリック | `tag_click` が DebugView に表示 |
| 同意済み → `/works/xxx` に遷移 | `work_view` + `page_view` が発火 |
| フォーム送信成功 | `contact_submit` が発火 |
| Netlify Preview 環境 | GA4 スクリプトが読み込まれない |

---

## 14. 未確定事項

- [ ] GA4 プロパティ作成・測定ID取得（運用担当作業）
- [ ] Googleシグナル / Google広告連携の有無（MVPは無効で確定、将来再検討）
- [ ] BigQuery export の導入可否（無料枠で可だが MVP では不要）
- [ ] クロスドメイン計測（カスタムドメイン取得後に設定見直し / C-4）

---

*このドキュメントは [`phase1-planning.md`](./phase1-planning.md) に基づく Phase1 成果物です。*
