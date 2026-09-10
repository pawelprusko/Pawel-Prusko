import * as fs from 'fs';
import * as path from 'path';

const content = {
  "title": "Data Asymmetry and the Board's Illusion of Now",
  "content": "The interface shows a cohesive picture, merging yesterday's data with tomorrow's predictions. The board makes decisions based on the dangerous illusion of a synchronized \"now.\"<br><br>I conduct an architectural simulation on the synthetic operational structure of a corporation. The information environment appears perfect, yet I observe a dysfunction that I define as Latency Asymmetry. The interface presents a perfectly cohesive picture, completely masking the fact that underneath pulse data streams with drastically different delay times.<br><br>Visually, everything happens in the exact same fraction of a second. In reality, AI predictions are generated in real-time, logistics data has a two-hour delay, and financial aggregates flow in daily cycles. The UI recklessly aligns them in a single row. This is an architectural distortion of business spacetime. Executive leadership makes critical decisions based on false synchronization. It is a systemic flaw generating cognitive debt and destroying objective risk assessment.<br><br>I feed this temporal chaos into the Dataviz Advocate (personalized Gemini Gem, available from the link below the post) to execute a cognitive stress-test. The model maps the vectors of cognitive bias and outputs three architectural hypotheses: global latency counters, artificial visual degradation of older data packets, and the concept of \"Chronological Sandboxing.\"<br><br>I subject these options to rigorous analytical evaluation. I reject visual degradation, as it would cause unjustified anxiety. I select Chronological Sandboxing. I enter into a strict dialogue with the Gem, iteratively refining this logic. We design the target architecture where the system physically separates time zones. Any attempt to cross-reference a real-time metric with a delayed one automatically renders a block, forcing a variance analysis.<br><br>Instead of burdening data engineering, I transition this new logic into Figma Make. Utilizing Vibe Prototyping, I generate an interactive mockup of the decision-making space. I simulate a board meeting on this specific prototype. I verify the immediate reduction of cognitive bias and the restoration of strategic focus before developers write a single line of code. The decision-making bottleneck disappears in the design phase.<br><br>When was the last time you verified whether the aesthetics of your dashboards are not hiding time asymmetry from the board, leading to decisions based on a false \"now\"?"
};

const base64Png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

const categoryId = 'data-architecture-scrolls';
const slug = 'data-asymmetry-and-the-boards-illusion-of-now';
const dir = path.join(process.cwd(), 'src/articles', categoryId, slug);

fs.mkdirSync(dir, { recursive: true });

const pngBuffer = Buffer.from(base64Png, 'base64');
fs.writeFileSync(path.join(dir, 'hero.png'), pngBuffer);

// For excerpt take the first part
const excerptStr = content.content.replace(/<[^>]+>/g, '');
const excerpt = excerptStr.length > 150 ? excerptStr.substring(0, 150) + "..." : excerptStr;

const articleJson = {
    id: categoryId + "-1",
    title: content.title,
    slug: slug,
    excerpt: excerpt,
    content: content.content,
    categoryId: categoryId,
    category: "Data Architecture Scrolls",
    date: "2026-05-15T10:00:00Z"
};

fs.writeFileSync(path.join(dir, 'article.json'), JSON.stringify(articleJson, null, 2));

console.log("Article 3 created.");
