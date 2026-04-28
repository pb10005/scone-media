'use client';

import { useEffect } from 'react';
import { trackArticleView } from '@/lib/analytics';

interface Props {
  slug: string;
  articleType: string;
  tags: string[];
}

export default function ArticleViewTracker({ slug, articleType, tags }: Props) {
  useEffect(() => {
    trackArticleView(slug, articleType, tags);
  }, [slug, articleType, tags]);
  return null;
}
