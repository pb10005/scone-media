// ============================================================
// コンテンツタイプ定義
// フェーズ0設計書 content-types.md に基づく型定義
// ============================================================

export type ContentStatus = 'draft' | 'published' | 'archived';

export type WorkFormat = 'novel' | 'poem' | 'essay' | 'review' | 'other';

export type ArticleType = 'review' | 'interview' | 'essay' | 'feature' | 'news';

export type SpotType = 'cafe' | 'bakery' | 'park' | 'library' | 'other';

export type PriceRange = 'free' | 'low' | 'mid' | 'high';

export type TagCategory = 'genre' | 'theme' | 'format' | 'era' | 'mood';

// ============================================================
// アンソロジー企画（anthology）
// ============================================================
export interface AnthologyFrontmatter {
  title: string;
  slug: string;
  description: string;
  theme: string;
  cover_image: string;
  tags: string[];
  works: string[]; // Work slugの参照リスト（順序付き）
  published_at: string;
  editor_note?: string;
  status: ContentStatus;
  related_anthologies?: string[]; // Anthology slugの参照リスト
}

export interface Anthology extends AnthologyFrontmatter {
  body: string; // MDXソースコード
}

// ============================================================
// 収録作（work）
// ============================================================
export interface WorkFrontmatter {
  title: string;
  slug: string;
  author_name: string;
  author_bio?: string;
  anthology: string; // Anthology slugの参照
  format: WorkFormat;
  is_excerpt: false; // B-4確定：全文掲載固定
  word_count?: number;
  tags: string[];
  cover_image?: string;
  published_at: string;
  is_ai_generated: boolean; // B-1確定：全作品true
  ai_tool?: string; // 内部管理用・非公開
  status: ContentStatus;
}

export interface Work extends WorkFrontmatter {
  body: string;
}

// ============================================================
// 記事（article）
// ============================================================
export interface ArticleFrontmatter {
  title: string;
  slug: string;
  author_name: string;
  article_type: ArticleType;
  cover_image: string;
  excerpt: string; // 80〜120字、一覧表示用
  tags: string[];
  related_anthologies?: string[];
  related_works?: string[];
  published_at: string;
  status: ContentStatus;
}

export interface Article extends ArticleFrontmatter {
  body: string;
}

// ============================================================
// スポット（spot）
// ============================================================
export interface SpotFrontmatter {
  title: string;
  slug: string;
  description: string;
  cover_image: string;
  gallery_images?: string[];
  spot_type: SpotType;
  address: string;
  area: string;
  access?: string;
  business_hours?: string;
  price_range?: PriceRange;
  map_url?: string;
  tags: string[];
  visited_at: string; // 必須：陳腐化防止
  photo_permission: boolean; // false の場合は status: draft を維持
  permission_note?: string; // 内部管理用・非公開
  published_at: string;
  status: ContentStatus;
}

export interface Spot extends SpotFrontmatter {
  body: string;
}

// ============================================================
// タグ（tag）
// ============================================================
export interface Tag {
  name: string;
  slug: string;
  description?: string;
  category?: TagCategory;
}

// ============================================================
// タグ別コンテンツ集合（タグページ用）
// ============================================================
export interface TaggedContent {
  tag: Tag;
  anthologies: Anthology[];
  works: Work[];
  articles: Article[];
  spots: Spot[];
}

// ============================================================
// ページネーション
// ============================================================
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}
