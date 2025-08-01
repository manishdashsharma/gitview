import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gitview-analytics.easytechinnovate.site';
  
  // Static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1.0,
    }
  ];

  // You could add popular GitHub usernames here for better SEO
  const popularProfiles = [
    'octocat',
    'torvalds', 
    'gaearon',
    'addyosmani',
    'tj',
    'sindresorhus',
    'yyx990803',
    'defunkt',
    'mojombo',
    'pjhyett'
  ];

  const profileRoutes = popularProfiles.map(username => ({
    url: `${baseUrl}/profile/${username}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const allRoutes = [...staticRoutes, ...profileRoutes];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (route) => `
  <url>
    <loc>${route.url}</loc>
    <lastmod>${route.lastModified}</lastmod>
    <changefreq>${route.changeFrequency}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join('')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Cache for 24 hours
    },
  });
}