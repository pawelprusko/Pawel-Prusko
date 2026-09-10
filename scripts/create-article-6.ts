import * as fs from 'fs';
import * as path from 'path';

const content = {
  "title": "Synchronicity Illusion",
  "content": "Does the perfect visual balance of your analytical interface actively undermine your product strategy?<br><br>In cognitive psychology, the Gestalt Law of Common Fate describes our innate tendency to perceive elements as related if they share similar visual characteristics or placement. While this is a fundamental principle of organized design, in the context of Data Experience Design, it frequently triggers a logic error I define as the Synchronicity Illusion.<br><br>The paradox is rooted in the \"polite\" symmetry of modern dashboard grids. As designers, we are trained to place key metrics—such as session duration and conversion rates—within identical containers, aligned perfectly in a single row. This architectural choice forces the user’s brain to unconsciously assume a cause-and-effect relationship between them. When one indicator trends upward while the other stagnates, the product team instinctively constructs a narrative of correlation where none exists.<br><br>This leads to significant organizational waste: teams begin testing false hypotheses and allocating engineering resources based on a visual layout rather than actual data structures. To solve this, we must employ Architectural Decoupling. This involves introducing deliberate structural asymmetry and distinct visual grammars for unrelated data streams. By intentionally breaking the consistency of the grid, the interface actively blocks the brain's pattern-matching reflex, forcing the user into a state of objective, isolated analysis. This shift moves the UI from a passive display to an active cognitive filter.<br><br>Where in our current product does 'polite' symmetry suggest correlation where there is none?"
};

const base64Png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

const categoryId = 'data-psychology-notes';
const slug = 'synchronicity-illusion';
const dir = path.join(process.cwd(), 'src/articles', categoryId, slug);

fs.mkdirSync(dir, { recursive: true });

const pngBuffer = Buffer.from(base64Png, 'base64');
fs.writeFileSync(path.join(dir, 'hero.png'), pngBuffer);

const excerptStr = content.content.replace(/<[^>]+>/g, '');
const excerpt = excerptStr.length > 150 ? excerptStr.substring(0, 150) + "..." : excerptStr;

const articleJson = {
    id: categoryId + "-1",
    title: content.title,
    slug: slug,
    excerpt: excerpt,
    content: content.content,
    categoryId: categoryId,
    category: "Data Psychology Notes",
    date: "2026-05-08T10:00:00Z"
};

fs.writeFileSync(path.join(dir, 'article.json'), JSON.stringify(articleJson, null, 2));

console.log("Article psych created.");
