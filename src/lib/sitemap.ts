import fs from 'fs';
import path from 'path';

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: string;
}

export function generateSitemapUrls(baseUrl = 'https://www.pawelprusko.com'): SitemapUrl[] {
  const urls: SitemapUrl[] = [];
  const today = new Date().toISOString().split('T')[0];

  // 1. Core Pages
  urls.push({
    loc: `${baseUrl}/`,
    changefreq: 'daily',
    priority: '1.0',
    lastmod: today,
  });

  urls.push({
    loc: `${baseUrl}/articles`,
    changefreq: 'daily',
    priority: '0.9',
    lastmod: today,
  });

  // 2. Dynamic Articles (from /src/articles)
  const articlesDir = path.resolve(process.cwd(), 'src/articles');
  if (fs.existsSync(articlesDir)) {
    const entries = fs.readdirSync(articlesDir);
    for (const entry of entries) {
      const filePath = path.join(articlesDir, entry, 'article.json');
      if (fs.existsSync(filePath)) {
        try {
          const raw = fs.readFileSync(filePath, 'utf-8');
          const data = JSON.parse(raw);
          const slug = data.slug || entry;
          let lastmod = today;
          if (data.date) {
            const parsed = new Date(data.date);
            if (!isNaN(parsed.getTime())) {
              lastmod = parsed.toISOString().split('T')[0];
            }
          }
          urls.push({
            loc: `${baseUrl}/articles/${slug}`,
            changefreq: 'weekly',
            priority: '0.8',
            lastmod,
          });
        } catch (err) {
          console.warn(`[sitemap] Error reading article ${entry}:`, err);
        }
      }
    }
  }

  // 3. Dynamic Scenes (from /src/scenes)
  const scenesDir = path.resolve(process.cwd(), 'src/scenes');
  if (fs.existsSync(scenesDir)) {
    const entries = fs.readdirSync(scenesDir);
    for (const entry of entries) {
      if (entry === 'studio' || entry === 'studio-article') continue;
      const entryPath = path.join(scenesDir, entry);
      if (!fs.statSync(entryPath).isDirectory()) continue;

      if (entry === 'the-latest-drop') {
        urls.push({
          loc: `${baseUrl}/scene/the-latest-drop`,
          changefreq: 'weekly',
          priority: '0.8',
          lastmod: today,
        });
        continue;
      }

      const subEntries = fs.readdirSync(entryPath);
      for (const sub of subEntries) {
        const sceneFile = path.join(entryPath, sub, 'scene.json');
        if (fs.existsSync(sceneFile)) {
          const stat = fs.statSync(sceneFile);
          const lastmod = stat.mtime.toISOString().split('T')[0];
          urls.push({
            loc: `${baseUrl}/scene/${entry}/${sub}`,
            changefreq: 'monthly',
            priority: '0.7',
            lastmod,
          });
        }
      }
    }
  }

  return urls;
}

export function generateSitemapXml(baseUrl = 'https://www.pawelprusko.com'): string {
  const urls = generateSitemapUrls(baseUrl);

  const xmlEntries = urls
    .map((item) => {
      let entry = `  <url>\n    <loc>${item.loc}</loc>`;
      if (item.lastmod) {
        entry += `\n    <lastmod>${item.lastmod}</lastmod>`;
      }
      if (item.changefreq) {
        entry += `\n    <changefreq>${item.changefreq}</changefreq>`;
      }
      if (item.priority) {
        entry += `\n    <priority>${item.priority}</priority>`;
      }
      entry += `\n  </url>`;
      return entry;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>`;
}
