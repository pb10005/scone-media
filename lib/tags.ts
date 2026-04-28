import { getAllAnthologies, getAllWorks, getAllArticles, getAllSpots } from './content';
import type { Tag, TaggedContent } from '@/types/content';

// タグ定義（20タグ）
// content-types.md の初期タグ案に基づく
const TAG_DEFINITIONS: Tag[] = [
  // ジャンル
  { name: '短編小説', slug: 'short-fiction', category: 'genre' },
  { name: '詩', slug: 'poetry', category: 'genre' },
  { name: 'エッセイ', slug: 'essay', category: 'genre' },
  { name: '書評', slug: 'book-review', category: 'genre' },
  { name: '現代文学', slug: 'contemporary', category: 'genre' },
  { name: '日本文学', slug: 'japanese-literature', category: 'genre' },
  // テーマ
  { name: '郷愁', slug: 'nostalgia', category: 'theme' },
  { name: '家族', slug: 'family', category: 'theme' },
  { name: '孤独', slug: 'solitude', category: 'theme' },
  { name: '旅', slug: 'travel', category: 'theme' },
  { name: '都市', slug: 'city', category: 'theme' },
  { name: '自然', slug: 'nature', category: 'theme' },
  { name: '記憶', slug: 'memory', category: 'theme' },
  { name: '日常', slug: 'everyday', category: 'theme' },
  // スポット種別
  { name: 'カフェ', slug: 'cafe', category: 'genre' },
  { name: 'スコーン店', slug: 'scone-shop', category: 'genre' },
  { name: '公園', slug: 'park', category: 'genre' },
  // エリア
  { name: '東京', slug: 'tokyo', category: 'theme' },
  { name: '大阪', slug: 'osaka', category: 'theme' },
  { name: '京都', slug: 'kyoto', category: 'theme' },
];

/**
 * 全タグ定義を返す
 */
export function getAllTags(): Tag[] {
  return TAG_DEFINITIONS;
}

/**
 * スラッグからタグを取得
 */
export function getTagBySlug(slug: string): Tag | undefined {
  return TAG_DEFINITIONS.find((t) => t.slug === slug);
}

/**
 * タグ名からタグを取得
 */
export function getTagByName(name: string): Tag | undefined {
  return TAG_DEFINITIONS.find((t) => t.name === name);
}

/**
 * タグ名またはスラッグでコンテンツを横断検索して返す
 */
export function getContentByTag(tagNameOrSlug: string): TaggedContent {
  const tag =
    TAG_DEFINITIONS.find((t) => t.slug === tagNameOrSlug) ||
    TAG_DEFINITIONS.find((t) => t.name === tagNameOrSlug);

  if (!tag) {
    return {
      tag: { name: tagNameOrSlug, slug: tagNameOrSlug },
      anthologies: [],
      works: [],
      articles: [],
      spots: [],
    };
  }

  const matchTag = (tags: string[]) =>
    tags.includes(tag.name) || tags.includes(tag.slug);

  return {
    tag,
    anthologies: getAllAnthologies().filter((a) => matchTag(a.tags)),
    works: getAllWorks().filter((w) => matchTag(w.tags)),
    articles: getAllArticles().filter((a) => matchTag(a.tags)),
    spots: getAllSpots().filter((s) => matchTag(s.tags)),
  };
}

/**
 * タグごとのコンテンツ数を集計して返す（タグ一覧ページ用）
 */
export function getTagsWithCount(): Array<Tag & { count: number }> {
  const anthologies = getAllAnthologies();
  const works = getAllWorks();
  const articles = getAllArticles();
  const spots = getAllSpots();

  return TAG_DEFINITIONS.map((tag) => {
    const matchTag = (tags: string[]) =>
      tags.includes(tag.name) || tags.includes(tag.slug);

    const count =
      anthologies.filter((a) => matchTag(a.tags)).length +
      works.filter((w) => matchTag(w.tags)).length +
      articles.filter((a) => matchTag(a.tags)).length +
      spots.filter((s) => matchTag(s.tags)).length;

    return { ...tag, count };
  });
}
