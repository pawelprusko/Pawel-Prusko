import fs from 'fs';
import path from 'path';

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  heroImageUrl: string;
}

const articlesDirectory = path.join(process.cwd(), 'data', 'articles');

export async function getLatestArticles(): Promise<Article[]> {
  // Ensure directory exists
  if (!fs.existsSync(articlesDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(articlesDirectory);
  const articles = fileNames
    .filter(fileName => fileName.endsWith('.json'))
    .map(fileName => {
      const fullPath = path.join(articlesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      return JSON.parse(fileContents) as Article;
    });

  return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
