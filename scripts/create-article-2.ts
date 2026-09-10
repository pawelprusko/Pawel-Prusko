import * as fs from 'fs';
import * as path from 'path';

const content = {
  "title": "The Architecture of Hidden Anticipation",
  "content": "In neurology, phantom limb pain is the real tension felt in an amputated limb; modern systems have engineered its ruthless, digital equivalent. We pay a massive cognitive tax not for the notifications we receive, but for the ones we expect to receive while in a state of permanent tension.<br><br>I wonder if the darkest achievement of communication engineering isn't the automation of waiting itself. We don't need to hold a phone to feel that specific, physical tension right before the next alert. This is a critical architectural flaw, built on the dogma of permanent availability, which has reprogrammed our biology. The brain has stopped entering states of regenerative rest. Even when offline, our nervous system allocates precious mental resources in the background to cognitively \"brace\" for the impact of the next demand. This state of chronic listening is a profound leak of our human presence.<br><br>The solution is not a \"digital detox,\" which unfairly shifts the blame for exhaustion onto the individual. We need a structural signal drought—gaps in processes where the architecture provides the biological certainty of absolute silence. We must design ecosystems that value \"non-interactivity\" just as much as they optimize \"connectivity.\"<br><br>Where in your current architecture could wisely designed \"non-interactivity\" protect your team from cognitive paralysis today?"
};

const base64Png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

const categoryId = 'data-ecology-memos';
const slug = 'architecture-hidden-anticipation';
const dir = path.join(process.cwd(), 'src/articles', categoryId, slug);

fs.mkdirSync(dir, { recursive: true });

const pngBuffer = Buffer.from(base64Png, 'base64');
fs.writeFileSync(path.join(dir, 'hero.png'), pngBuffer);

// For excerpt take the first part
const excerptStr = content.content.replace(/<[^>]+>/g, '');
const excerpt = excerptStr.length > 150 ? excerptStr.substring(0, 150) + "..." : excerptStr;

const articleJson = {
    id: categoryId + "-2",
    title: content.title,
    slug: slug,
    excerpt: excerpt,
    content: content.content,
    categoryId: categoryId,
    category: "Data Ecology Memos",
    date: "2026-06-01T11:00:00Z"
};

fs.writeFileSync(path.join(dir, 'article.json'), JSON.stringify(articleJson, null, 2));

console.log("Article 2 created.");
