# 公開前チェックリスト

> 運用ドキュメント / 作成日: 2026-04-28  
> 参照: `phase0-planning.md §3-6`・`phase1-mvp-acceptance.md §4`

コンテンツをMDXブランチにPushする前に必ず確認すること。  
`.github/PULL_REQUEST_TEMPLATE.md` のPRチェックと併用する。

---

## 1. フロントマター必須フィールド確認

### アンソロジー企画（`content/anthologies/`）

```yaml
title:        # 必須。企画タイトル
slug:         # 必須。URLスラッグ（英数字・ハイフン）
description:  # 必須。200〜400字
theme:        # 必須。テーマキーワード
cover_image:  # 必須。OGP兼用（/images/anthologies/xxx.jpg）
tags:         # 必須。3〜5タグ
works:        # 必須。収録作slugリスト（順序付き）
published_at: # 必須。ISO 8601形式
status:       # 必須。published / draft / archived
```

### 収録作（`content/works/`）

```yaml
title:          # 必須
slug:           # 必須
author_name:    # 必須（架空の人名 or「SCONE MEDIA 編集部」）
anthology:      # 必須。所属アンソロジーのslug
format:         # 必須。novel / poem / essay / review / other
is_ai_generated: true   # 必須（全作品true固定）
ai_tool:        # 必須。使用AIツール名（例: "Claude"）
tags:           # 必須。2〜4タグ
published_at:   # 必須
status:         # 必須
```

### 記事（`content/articles/`）

```yaml
title:        # 必須
slug:         # 必須
author_name:  # 必須
article_type: # 必須。review / interview / essay / feature / news
excerpt:      # 必須。80〜120字（一覧表示用）
cover_image:  # 必須。OGP兼用
tags:         # 必須。3〜5タグ
published_at: # 必須
status:       # 必須
```

### スポット（`content/spots/`）

```yaml
title:            # 必須
slug:             # 必須
description:      # 必須
cover_image:      # 必須（撮影許可取得済みの写真）
spot_type:        # 必須。cafe / bakery / park / library / other
address:          # 必須
area:             # 必須
tags:             # 必須。2〜4タグ
visited_at:       # 必須。取材日（YYYY-MM-DD）
photo_permission: true  # 必須。falseの場合はstatus: draftのまま公開しない
published_at:     # 必須
status:           # 必須
```

---

## 2. 品質チェック

- [ ] タイトル・本文に誤字・不自然な表現がない（AI生成物は必ずレビューする）
- [ ] 本文の長さが適切（収録作：1,000字以上推奨、記事：800字以上推奨）
- [ ] 句読点・改行が読みやすく整っている

---

## 3. 著作権・権利確認

- [ ] **収録作**：`is_ai_generated: true`・`ai_tool` フィールドが記入されている
- [ ] **スポット**：`photo_permission: true` が確認済み（未確認は `status: draft`）
- [ ] **画像**：以下のいずれかを確認している
  - CC0 または CC BY（ライセンス元を `image_license` フィールドに記録推奨）
  - AI生成画像（使用ツールのTOSで商用利用可を確認済み）
  - 自分が撮影した写真（施設の撮影許可取得済み）

---

## 4. タグ・導線チェック

- [ ] タグが既存タグリストから選択されている（新規タグ追加は `lib/tags.ts` への追加も必要）
- [ ] 関連コンテンツが正しく設定されている（`related_anthologies`, `related_works` 等）
- [ ] 収録作の場合：所属アンソロジーの `works` リストにslugが追加されている

---

## 5. 技術・表示確認

- [ ] Netlify Preview URLでページが正常に表示される
- [ ] モバイル表示で崩れがない（Chrome DevTools）
- [ ] OGP画像・title・descriptionが設定されている
- [ ] パンくずリストが正しい階層で表示されている
- [ ] リンク切れがない（関連コンテンツ、タグリンク等）

---

## 6. 公開手順

```
1. content/ 以下にMDXファイルを作成
2. ブランチ命名: content/[type]/[slug]
   例: content/works/yoru-no-chaya
3. git push → PRを作成
4. Netlify Preview URLで確認
5. main へマージ → 自動デプロイ（約2〜3分）
6. 本番URL（scone-media.netlify.app）で最終確認
7. 公開後30分以内にSNS投稿
```

---

## 7. スポット情報の定期確認（3ヶ月ごと）

掲載中の全スポットについて以下を確認し、変更があれば更新する：

- [ ] 営業中か（閉店・移転のチェック）
- [ ] 営業時間・定休日が変わっていないか
- [ ] 連絡先情報（map_url等）が有効か

変更がある場合は該当MDXを更新してPR → 閉店の場合は `status: archived` に変更。

---

*このドキュメントは [`phase1-mvp-acceptance.md`](./phase1-mvp-acceptance.md) §3 運用DoDに対応します。*
