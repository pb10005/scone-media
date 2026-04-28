'use client';

import { useEffect } from 'react';
import { trackSpotView } from '@/lib/analytics';

export default function SpotViewTracker({ slug }: { slug: string }) {
  useEffect(() => { trackSpotView(slug); }, [slug]);
  return null;
}
