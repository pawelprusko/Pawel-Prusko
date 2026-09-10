import * as fs from 'fs';
import * as path from 'path';

const articlesDir = path.join(process.cwd(), 'src/articles');
const categories = fs.readdirSync(articlesDir).filter(f => fs.statSync(path.join(articlesDir, f)).isDirectory());

categories.forEach(cat => {
    const catDir = path.join(articlesDir, cat);
    if (!fs.existsSync(path.join(catDir, 'article.json'))) return;

    const data = JSON.parse(fs.readFileSync(path.join(catDir, 'article.json'), 'utf8'));
    const slug = data.slug;
    const articleDir = path.join(catDir, slug);
    fs.mkdirSync(articleDir, { recursive: true });

    if (fs.existsSync(path.join(catDir, 'article.json'))) {
        fs.renameSync(path.join(catDir, 'article.json'), path.join(articleDir, 'article.json'));
    }
    if (fs.existsSync(path.join(catDir, 'hero.png'))) {
        fs.renameSync(path.join(catDir, 'hero.png'), path.join(articleDir, 'hero.png'));
    }
});

console.log("Migration done.");
