import * as fs from 'fs';
import * as path from 'path';

const content = {
  "title": "Defeating cognitive exhaustion (Part 2)",
  "content": "The digital ecosystem operates on a biological paradox: treating human attention as an infinite resource, while our neurochemistry is strictly finite. Redundant data does not build authority; it systematically erodes it.<br><br>Through the lens of Data Experience Design, communication is a structural challenge. Applied to personal branding, a severe optimization flaw emerges. In data visualization, an excess of shallow posts drastically degrades the Signal-to-Noise Ratio. They function as chartjunk, masking true expertise behind systemic noise. Cognitive psychology explains this cost through Cognitive Load. By forcing our network to filter out low-value content, we tax their processing bandwidth. In user experience terms, this broadcasting introduces severe Friction. Instead of guiding peers to your core competence, it guarantees cognitive exhaustion.<br><br>My approach to digital presence relies on intentional reduction. I treat a professional network like a high-fidelity analytical dashboard. Instead of flooding the feed, I curate only the most impactful insights, respecting the biological limits of my audience. This strategy builds authority on predictable quality, ensuring every published data point delivers unambiguous, calibrated value.<br><br>Strategists, product managers, and engineers: how do you optimize your communication architecture to protect your network's bandwidth and separate signal from noise?"
};

const base64Png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

const categoryId = 'data-brand-diary';
const slug = 'defeating-cognitive-exhaustion-2';
const dir = path.join(process.cwd(), 'src/articles', categoryId, slug);

fs.mkdirSync(dir, { recursive: true });

const pngBuffer = Buffer.from(base64Png, 'base64');
fs.writeFileSync(path.join(dir, 'hero.png'), pngBuffer);

const excerptStr = content.content.replace(/<[^>]+>/g, '');
const excerpt = excerptStr.length > 150 ? excerptStr.substring(0, 150) + "..." : excerptStr;

const articleJson = {
    id: categoryId + "-2",
    title: content.title,
    slug: slug,
    excerpt: excerpt,
    content: content.content,
    categoryId: categoryId,
    category: "Data Brand Diary",
    date: "2026-05-09T10:00:00Z"
};

fs.writeFileSync(path.join(dir, 'article.json'), JSON.stringify(articleJson, null, 2));

console.log("Article 5 created.");
