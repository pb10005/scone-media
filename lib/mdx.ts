import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'content');

/**
 * 指定ディレクトリ内の全MDXファイルのスラッグ（ファイル名）リストを返す
 */
export function getSlugs(contentType: string): string[] {
  const dir = path.join(contentDir, contentType);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}

/**
 * MDXファイルを読み込み、フロントマターとbodyを返す
 */
export function readMdxFile<T>(contentType: string, slug: string): { frontmatter: T; body: string } | null {
  const filePath = path.join(contentDir, contentType, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  return {
    frontmatter: data as T,
    body: content,
  };
}

/**
 * 指定ディレクトリの全MDXを読み込み、フロントマター+bodyの配列を返す
 */
export function readAllMdxFiles<T>(contentType: string): Array<{ frontmatter: T; body: string; slug: string }> {
  const slugs = getSlugs(contentType);
  return slugs
    .map((slug) => {
      const result = readMdxFile<T>(contentType, slug);
      if (!result) return null;
      return { ...result, slug };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
}
