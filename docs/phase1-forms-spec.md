# フォーム仕様（寄稿 / お問い合わせ）

> Phase1 成果物 / 作成日: 2026-04-28  
> 優先度: Should（ローンチ時は mailto: リンクで最低限代替可）  
> 目的: 寄稿希望・一般問い合わせの受付と計測の仕組みを定義する

---

## 1. 方針

### 1-1. MVP でのゴール

- **寄稿希望**を取りこぼさず受け付ける
- **フォーム送信件数を GA4 で計測**する（KPIの `contact_submit`）
- エンジニア1名で運用可能にする（サーバレス）

### 1-2. 選定：Netlify Forms

ホスティングが **Netlify（C-2 確定）** のため **Netlify Forms** を採用。

| 項目 | 値 |
|---|---|
| 料金 | 無料枠: 月100送信まで |
| サーバ | 不要（Netlify が受信） |
| スパム対策 | reCAPTCHA v2 / honeypot（組み込み） |
| 通知 | 送信ごとに管理者メール |
| データ保存 | Netlify 管理画面 |

**代替案**: Formspree / Google Forms / mailto。MVPでは Netlify Forms で確定。

---

## 2. フォーム一覧

| フォーム | 設置ページ | 優先度 | 用途 |
|---|---|---|---|
| 寄稿問い合わせ（contribute） | `/contribute` | Should | 寄稿希望の受付 |
| 一般お問い合わせ | `/about` 内セクション or `/contact` | Could | サイト全般の問い合わせ |

---

## 3. 寄稿問い合わせフォーム仕様

### 3-1. 項目定義

| フィールド | 型 | 必須 | バリデーション | UI |
|---|---|---|---|---|
| `name` | text | ○ | 2〜50字 | `<input type="text">` |
| `email` | email | ○ | RFC 5322 簡易、100字以内 | `<input type="email">` |
| `pen_name` | text | - | 50字以内 | `<input type="text">` placeholder「筆名があれば」 |
| `twitter_or_url` | url/text | - | 200字以内 | `<input type="text">` placeholder「X・ポートフォリオURL等」 |
| `format` | select | ○ | 小説/詩/エッセイ/書評/その他 | `<select>` |
| `theme_interest` | text | - | 100字以内 | `<input type="text">` placeholder「興味のあるテーマ」 |
| `sample_work` | textarea | - | 0〜2000字 | `<textarea rows=5>` placeholder「作品サンプル（任意）」 |
| `message` | textarea | ○ | 20〜2000字 | `<textarea rows=8>` |
| `privacy_agree` | checkbox | ○ | true のみ受付 | 「プライバシーポリシーに同意する」 |

### 3-2. 非表示フィールド

- `form-name=contribute`（Netlify識別用）
- honeypot: `<input name="bot-field">`（スパム判定用・CSSで非表示）
- `source_page`（遷移元URLを自動埋め込み、計測用）

### 3-3. バリデーション

- **クライアント側**: React Hook Form + zod で即時バリデーション
- **サーバ側**: Netlify 受信時の空・honeypot チェック（自動）
- エラーメッセージ表示:
  - 該当フィールド下に `<p role="alert">`
  - `aria-describedby` でフィールドと紐付け
  - 初回フォーカスアウト時に検証開始（`mode: 'onBlur'`）

### 3-4. エラーメッセージ文言

| ケース | メッセージ |
|---|---|
| 必須未入力 | 「[項目名]を入力してください」 |
| メール形式不正 | 「正しいメールアドレスの形式で入力してください」 |
| 文字数超過 | 「[項目名]は[N]文字以内で入力してください」 |
| 文字数不足（message） | 「お問い合わせ内容は20文字以上で入力してください」 |
| プライバシー未同意 | 「プライバシーポリシーへの同意が必要です」 |
| 送信失敗（ネットワーク） | 「送信に失敗しました。時間を置いて再度お試しください」 |

### 3-5. 送信フロー

```
[ユーザー] フォーム入力
  ↓
[Client] バリデーション
  ↓ OK
[Client] POST /  (Netlify Forms が受信)
  ├── form-name=contribute を含める
  ├── honeypot bot-field は空
  └── すべてのフィールドを送信
  ↓
[Netlify] スパム判定 → 通過したら保存・管理者にメール通知
  ↓
[Client] /contribute/thanks へリダイレクト
  ↓
[GA4] contact_submit イベント発火（form_type=contribute）
```

### 3-6. サンクスページ（`/contribute/thanks`）

- h1: 「お問い合わせを受け付けました」
- 文言: 「内容を確認のうえ、1週間以内にご返信いたします。」
- 導線: トップへ戻る / 他の記事を読む
- `noindex`

---

## 4. 一般お問い合わせ（Could・MVP外）

- MVP では `/about` ページに管理者メール（例: `contact@scone-media.example`）を表示するだけで代替
- 将来的にフォーム化する際は寄稿問い合わせと同じ構造で `form-name=contact` で分離

---

## 5. Netlify Forms の HTML マークアップ

### 5-1. 静的検出（Netlify のフォーム自動検出）

Netlify は **ビルド時にHTMLをスキャンしてフォームを認識**する。このため、Next.js で動的に描画するだけでは認識されない。対策：

**案A（推奨）**: `public/__forms.html` に静的なマークアップを配置しておく

```html
<!-- public/__forms.html -->
<html>
  <body>
    <form name="contribute" netlify netlify-honeypot="bot-field" hidden>
      <input type="text" name="name" />
      <input type="email" name="email" />
      <input type="text" name="pen_name" />
      <input type="text" name="twitter_or_url" />
      <select name="format"><option>小説</option></select>
      <input type="text" name="theme_interest" />
      <textarea name="sample_work"></textarea>
      <textarea name="message"></textarea>
      <input type="checkbox" name="privacy_agree" />
      <input type="text" name="source_page" />
    </form>
  </body>
</html>
```

**案B**: Next.js の Server Component で `<form>` を直接SSG出力（netlify属性付き）

### 5-2. React コンポーネント（クライアント側）

```tsx
// components/forms/ContributeForm.tsx
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email().max(100),
  // ...
});

export function ContributeForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('form-name', 'contribute');
    Object.entries(data).forEach(([k, v]) => formData.append(k, v));
    formData.append('source_page', document.referrer);

    const res = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData as any).toString(),
    });

    if (res.ok) {
      // GA4 event
      window.gtag?.('event', 'contact_submit', {
        form_type: 'contribute',
        submission_source: document.referrer || 'direct',
      });
      window.location.href = '/contribute/thanks';
    } else {
      alert('送信に失敗しました');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} data-netlify="true" name="contribute">
      <input type="hidden" name="form-name" value="contribute" />
      <input type="hidden" name="bot-field" style={{ display: 'none' }} />
      {/* ...fields... */}
      <button type="submit" disabled={isSubmitting}>送信する</button>
    </form>
  );
}
```

---

## 6. アクセシビリティ

- [ ] 各 `<input>` に `<label for>` を紐付け
- [ ] 必須項目に `aria-required="true"`
- [ ] エラーメッセージに `aria-live="polite"`、該当 input に `aria-invalid="true"` / `aria-describedby`
- [ ] 送信ボタンは `disabled` + ローディング表示（`aria-busy`）
- [ ] フォーカスリング明示
- [ ] プライバシーポリシーへのリンクは新規タブで `rel="noopener noreferrer"`

---

## 7. プライバシーポリシー（最低限）

寄稿フォーム送信時に同意を取るため、以下を `/about` or `/privacy` に明記：

- 収集する情報の種類（氏名・メール・筆名・メッセージ等）
- 利用目的（返信・連絡のみ、マーケティング目的には使わない）
- 第三者提供の有無（なし）
- 保存期間（問い合わせ対応後 2年）
- 削除請求の連絡先（管理者メール）
- GA4 による匿名アクセス解析情報の収集について

---

## 8. スパム対策

- Netlify honeypot（`bot-field`）
- Netlify 内蔵 Akismet スパムフィルタ
- （任意）reCAPTCHA v2 を追加。MVP時点では様子見
- 1 IP あたり 5分に1回まで送信可（Netlify レート制限を活用）

---

## 9. 計測

### GA4 イベント

| イベント名 | 発火タイミング | パラメータ |
|---|---|---|
| `contribute_click` | `/contribute` ページ遷移時（source_page = 遷移元） | `source_page` |
| `contribute_form_view` | フォームのスクロールイン時 | - |
| `contact_submit` | 送信成功時 | `form_type`, `submission_source` |
| `contact_submit_error` | 送信失敗時 | `form_type`, `error_reason` |

詳細は [`phase1-measurement-spec.md`](./phase1-measurement-spec.md) を参照。

---

## 10. 運用

### 10-1. 受信確認

- Netlify 管理画面 `Forms` タブで受信一覧を確認
- 管理者メール通知を **毎日** 確認する（SLA: 1週間以内に返信）

### 10-2. レビュー・返信

- 受信内容を Notion or スプレッドシートに転記（選択的）
- 対応ステータス管理: `未対応` / `対応中` / `返信済み` / `不要`

### 10-3. スパム対応

- 明らかなスパムは Netlify 管理画面で削除
- 一定期間（1ヶ月）スパムが増加したら reCAPTCHA 追加検討

---

## 11. ローンチ時の最小実装

**MVP ローンチで必須ではない**。以下の順で段階導入可：

1. **L0（ローンチ時）**: `/contribute` に mailto: リンクのみ（フォーム無し）
2. **L1（ローンチ後2週間以内）**: Netlify Forms でフォーム実装（本仕様）
3. **L2（1ヶ月後）**: スパムが増えたら reCAPTCHA 追加
4. **L3（Phase 2）**: 管理画面（受信管理・対応ステータス）検討

---

## 12. 未確定事項

- [ ] 管理者メールアドレス（`contact@...` の確定）
- [ ] プライバシーポリシー文面の最終版（T-69）
- [ ] 寄稿の審査基準・謝礼有無の社内決定
- [ ] reCAPTCHA v2 のサイトキー取得要否

---

*このドキュメントは [`phase1-planning.md`](./phase1-planning.md) に基づく Phase1 成果物です。*
