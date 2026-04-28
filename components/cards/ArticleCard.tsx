import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/types/content';

const ARTICLE_TYPE_LABELS: Record<string, string> = {
  review: '書評',
  interview: 'インタビュー',
  essay: 'エッセイ',
  feature: '特集',
  news: 'ニュース',
};

interface ArticleCardProps {
  article: Article;
  variant?: 'card' | 'list';
}

export default function ArticleCard({ article, variant = 'card' }: ArticleCardProps) {
  const publishedDate = new Date(article.published_at).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (variant === 'list') {
    return (
      <article className="group flex gap-4 py-4 border-b border-[#E8D5C0] last:border-0">
        <Link href={`/articles/${article.slug}`} className="flex gap-4 w-full">
          {article.cover_image && (
            <div className="relative w-20 h-14 shrink-0 rounded-lg overflow-hidden bg-[#F5E6D3]">
              <Image
                src={article.cover_image}
                alt={article.title}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[#A0826D] mb-1">
              {ARTICLE_TYPE_LABELS[article.article_type] ?? article.article_type} · {publishedDate}
            </p>
            <h3 className="text-sm font-bold text-[#2C1810] group-hover:text-[#8B4513] transition-colors line-clamp-2 font-serif">
              {article.title}
            </h3>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="group bg-white rounded-xl border border-[#E8D5C0] overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/articles/${article.slug}`} className="block">
        {/* アイキャッチ */}
        <div className="relative aspect-[16/9] bg-[#F5E6D3] overflow-hidden">
          {article.cover_image ? (
            <Image
              src={article.cover_image}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-4xl text-[#D4B896]">
              ✍️
            </div>
          )}
        </div>

        <div className="p-4">
          {/* 記事タイプ・日付 */}
          <p className="text-xs text-[#A0826D] mb-2">
            {ARTICLE_TYPE_LABELS[article.article_type] ?? article.article_type} · {publishedDate}
          </p>

          {/* タイトル */}
          <h3 className="text-base font-bold text-[#2C1810] mb-2 line-clamp-2 group-hover:text-[#8B4513] transition-colors font-serif">
            {article.title}
          </h3>

          {/* 概要 */}
          <p className="text-sm text-[#5C3317] line-clamp-2 mb-3 leading-relaxed">
            {article.excerpt}
          </p>

          {/* タグ */}
          <div className="flex flex-wrap gap-1">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-[#F5E6D3] text-[#8B4513] px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </article>
  );
}
