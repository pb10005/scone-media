'use client';

import { useEffect } from 'react';
import { trackWorkView } from '@/lib/analytics';

interface Props {
  slug: string;
  anthologySlug: string;
  format: string;
}

export default function WorkViewTracker({ slug, anthologySlug, format }: Props) {
  useEffect(() => {
    trackWorkView(slug, anthologySlug, format);
  }, [slug, anthologySlug, format]);
  return null;
}
