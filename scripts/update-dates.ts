import * as fs from 'fs';
import * as path from 'path';

const dates = [
  "2026-06-11T10:00:00Z",
  "2026-06-04T10:00:00Z",
  "2026-05-28T10:00:00Z",
  "2026-05-21T10:00:00Z",
  "2026-05-14T10:00:00Z"
];

const articlesToUpdate = [
  "src/articles/data-alchemist-journal/trophic-cascade-data-alchemist-journal/article.json",
  "src/articles/data-ecology-memos/architecture-hidden-anticipation/article.json",
  "src/articles/data-architecture-scrolls/data-asymmetry-and-the-boards-illusion-of-now/article.json",
  "src/articles/data-brand-diary/defeating-cognitive-exhaustion/article.json",
  "src/articles/data-psychology-notes/synchronicity-illusion/article.json"
];

articlesToUpdate.forEach((file, idx) => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data.date = dates[idx];
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated ${file} to ${dates[idx]}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});
