import type { MetadataRoute } from 'next';
import { getAllAnthologySlugs, getAllWorkSlugs, getAllArticleSlugs, getAllSpotSlugs } from '@/lib/content';
import { getAllTags } from '@/lib/tags';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://scone-media.netlify.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/anthologies`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/works`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/articles`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/spots`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/tags`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  const anthologyPages: MetadataRoute.Sitemap = getAllAnthologySlugs().map((slug) => ({
    url: `${SITE_URL}/anthologies/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const workPages: MetadataRoute.Sitemap = getAllWorkSlugs().map((slug) => ({
    url: `${SITE_URL}/works/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const articlePages: MetadataRoute.Sitemap = getAllArticleSlugs().map((slug) => ({
    url: `${SITE_URL}/articles/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const spotPages: MetadataRoute.Sitemap = getAllSpotSlugs().map((slug) => ({
    url: `${SITE_URL}/spots/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const tagPages: MetadataRoute.Sitemap = getAllTags().map((tag) => ({
    url: `${SITE_URL}/tags/${encodeURIComponent(tag.name)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticPages, ...anthologyPages, ...workPages, ...articlePages, ...spotPages, ...tagPages];
}
