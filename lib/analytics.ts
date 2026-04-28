// ============================================================
// GA4 カスタムイベント送信ユーティリティ
// kpi.md の GA4 イベント設計に基づく
// ============================================================

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    GA_INITIALIZED?: boolean;
  }
}

type GA4EventParams = Record<string, string | number | boolean | undefined>;

/**
 * GA4カスタムイベントを送信する
 * Cookie同意前・gtag未初期化の場合は何もしない
 */
export function sendGA4Event(eventName: string, params?: GA4EventParams): void {
  if (typeof window === 'undefined') return;
  if (!window.gtag) return;
  window.gtag('event', eventName, params);
}

// ============================================================
// 型安全なイベント送信関数
// ============================================================

export function trackAnthologyView(anthologySlug: string, tagList: string[]): void {
  sendGA4Event('anthology_view', {
    anthology_slug: anthologySlug,
    tag_list: tagList.join(','),
  });
}

export function trackWorkView(workSlug: string, anthologySlug: string, format: string): void {
  sendGA4Event('work_view', {
    work_slug: workSlug,
    anthology_slug: anthologySlug,
    format,
  });
}

export function trackArticleView(articleSlug: string, articleType: string, tagList: string[]): void {
  sendGA4Event('article_view', {
    article_slug: articleSlug,
    article_type: articleType,
    tag_list: tagList.join(','),
  });
}

export function trackSpotView(spotSlug: string): void {
  sendGA4Event('spot_view', { spot_slug: spotSlug });
}

export function trackTagClick(tagName: string, tagCategory: string, sourcePageType: string): void {
  sendGA4Event('tag_click', {
    tag_name: tagName,
    tag_category: tagCategory,
    source_page_type: sourcePageType,
  });
}

export function trackRelatedAnthologyClick(targetAnthologySlug: string, sourcePageType: string): void {
  sendGA4Event('related_anthology_click', {
    target_anthology_slug: targetAnthologySlug,
    source_page_type: sourcePageType,
  });
}

export function trackRelatedWorkClick(targetWorkSlug: string, sourcePageType: string): void {
  sendGA4Event('related_work_click', {
    target_work_slug: targetWorkSlug,
    source_page_type: sourcePageType,
  });
}

export function trackRelatedArticleClick(targetArticleSlug: string, sourcePageType: string): void {
  sendGA4Event('related_article_click', {
    target_article_slug: targetArticleSlug,
    source_page_type: sourcePageType,
  });
}

export function trackShareClick(platform: string, contentType: string, contentSlug: string): void {
  sendGA4Event('share_click', {
    platform,
    content_type: contentType,
    content_slug: contentSlug,
  });
}

export function trackNextWorkClick(targetWorkSlug: string, anthologySlug: string): void {
  sendGA4Event('next_work_click', {
    target_work_slug: targetWorkSlug,
    anthology_slug: anthologySlug,
  });
}

export function trackContributeClick(sourcePage: string): void {
  sendGA4Event('contribute_click', { source_page: sourcePage });
}
