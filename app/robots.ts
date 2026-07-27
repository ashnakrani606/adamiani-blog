import { MetadataRoute } from 'next';

const baseUrl = 'https://www.adamiani.ai';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
