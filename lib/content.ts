import { readAllMdxFiles, readMdxFile } from './mdx';
import type {
  Anthology,
  AnthologyFrontmatter,
  Work,
  WorkFrontmatter,
  Article,
  ArticleFrontmatter,
  Spot,
  SpotFrontmatter,
} from '@/types/content';

// ============================================================
// アンソロジー企画
// ============================================================

export function getAllAnthologies(): Anthology[] {
  const files = readAllMdxFiles<AnthologyFrontmatter>('anthologies');
  return files
    .map(({ frontmatter, body }) => ({ ...frontmatter, body }))
    .filter((a) => a.status === 'published')
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
}

export function getAnthologyBySlug(slug: string): Anthology | null {
  const result = readMdxFile<AnthologyFrontmatter>('anthologies', slug);
  if (!result) return null;
  return { ...result.frontmatter, body: result.body };
}

export function getAllAnthologySlugs(): string[] {
  return getAllAnthologies().map((a) => a.slug);
}

// ============================================================
// 収録作
// ============================================================

export function getAllWorks(): Work[] {
  const files = readAllMdxFiles<WorkFrontmatter>('works');
  return files
    .map(({ frontmatter, body }) => ({ ...frontmatter, body }))
    .filter((w) => w.status === 'published')
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
}

export function getWorkBySlug(slug: string): Work | null {
  const result = readMdxFile<WorkFrontmatter>('works', slug);
  if (!result) return null;
  return { ...result.frontmatter, body: result.body };
}

export function getWorksByAnthology(anthologySlug: string): Work[] {
  return getAllWorks().filter((w) => w.anthology === anthologySlug);
}

export function getAllWorkSlugs(): string[] {
  return getAllWorks().map((w) => w.slug);
}

// ============================================================
// 記事
// ============================================================

export function getAllArticles(): Article[] {
  const files = readAllMdxFiles<ArticleFrontmatter>('articles');
  return files
    .map(({ frontmatter, body }) => ({ ...frontmatter, body }))
    .filter((a) => a.status === 'published')
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
}

export function getArticleBySlug(slug: string): Article | null {
  const result = readMdxFile<ArticleFrontmatter>('articles', slug);
  if (!result) return null;
  return { ...result.frontmatter, body: result.body };
}

export function getAllArticleSlugs(): string[] {
  return getAllArticles().map((a) => a.slug);
}

// ============================================================
// スポット
// ============================================================

export function getAllSpots(): Spot[] {
  const files = readAllMdxFiles<SpotFrontmatter>('spots');
  return files
    .map(({ frontmatter, body }) => ({ ...frontmatter, body }))
    .filter((s) => s.status === 'published' && s.photo_permission === true)
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
}

export function getSpotBySlug(slug: string): Spot | null {
  const result = readMdxFile<SpotFrontmatter>('spots', slug);
  if (!result) return null;
  return { ...result.frontmatter, body: result.body };
}

export function getAllSpotSlugs(): string[] {
  return getAllSpots().map((s) => s.slug);
}

// ============================================================
// 関連コンテンツ（タグマッチ）
// ============================================================

export function getRelatedArticles(tags: string[], excludeSlug: string, limit = 3): Article[] {
  return getAllArticles()
    .filter((a) => a.slug !== excludeSlug && a.tags.some((t) => tags.includes(t)))
    .slice(0, limit);
}

export function getRelatedAnthologies(tags: string[], excludeSlug: string, limit = 3): Anthology[] {
  return getAllAnthologies()
    .filter((a) => a.slug !== excludeSlug && a.tags.some((t) => tags.includes(t)))
    .slice(0, limit);
}

export function getRelatedWorks(tags: string[], excludeSlug: string, limit = 3): Work[] {
  return getAllWorks()
    .filter((w) => w.slug !== excludeSlug && w.tags.some((t) => tags.includes(t)))
    .slice(0, limit);
}
