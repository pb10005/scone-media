import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getAllArticles } from '@/lib/content';
import ArticleListClient from './ArticleListClient';
import ArticleCard from '@/components/cards/ArticleCard';

export const metadata: Metadata = {
  title: '記事一覧',
  description: 'スコーン・ポータルの編集部記事一覧。書評・エッセイ・特集など。',
  alternates: { canonical: '/articles' },
};

export default function ArticlesPage() {
  const articles = getAllArticles();
  const allTags = [...new Set(articles.flatMap((a) => a.tags))];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2C1810] font-serif mb-2">記事一覧</h1>
        <p className="text-[#8B7355]">編集部による解説・書評・特集など。{articles.length}本掲載中。</p>
      </div>
      <Suspense fallback={
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.slice(0, 6).map((a) => <ArticleCard key={a.slug} article={a} />)}
        </div>
      }>
        <ArticleListClient articles={articles} allTags={allTags} />
      </Suspense>
    </div>
  );
}
