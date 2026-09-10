const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'data', 'articles');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const baseDate = new Date('2024-05-14T10:00:00Z');
for (let i = 4; i <= 12; i++) {
  const d = new Date(baseDate.getTime() - i * 86400000);
  const json = {
    id: i.toString(),
    title: `Data Insights Vol ${i}: Refining the Signal`,
    slug: `data-insights-${i}`,
    excerpt: `Exploring the ongoing evolution of data streams and how minimalist architecture can drastically improve signal-to-noise ratios.`,
    content: "<p>Content goes here.</p>",
    category: "Data Ecology Memos",
    date: d.toISOString(),
    heroImageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  };
  fs.writeFileSync(path.join(dir, `article-${i}.json`), JSON.stringify(json, null, 2));
}
