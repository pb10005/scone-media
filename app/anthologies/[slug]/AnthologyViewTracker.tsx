'use client';

import { useEffect } from 'react';
import { trackAnthologyView } from '@/lib/analytics';

interface Props {
  slug: string;
  tags: string[];
}

export default function AnthologyViewTracker({ slug, tags }: Props) {
  useEffect(() => {
    trackAnthologyView(slug, tags);
  }, [slug, tags]);
  return null;
}
