/// <reference types="vite/client" />

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  categoryId: string;
  date: string;
  heroImageUrl: string;
}

export function getLatestArticles(): Article[] {
  // Read local JSON files using Vite's fast glob
  const files = import.meta.glob('/src/articles/*/*/article.json', { eager: true });
  const images = import.meta.glob('/src/articles/*/*/hero.png', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
  
  const articles: Article[] = [];

  for (const path in files) {
    const file = files[path] as { default: any };
    const articleData = file.default;
    
    // Extract category and slug folder name from path: /src/articles/category-name/article-slug/article.json
    const parts = path.split('/');
    const slugFolder = parts[parts.length - 2];
    const categoryFolder = parts[parts.length - 3];
    
    const imagePath = `/src/articles/${categoryFolder}/${slugFolder}/hero.png`;
    const heroImageUrl = images[imagePath] || '';

    articles.push({
      ...articleData,
      categoryId: categoryFolder,
      heroImageUrl
    });
  }

  // Sort by date descending
  return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export interface Scene {
  id: string;
  title: string;
  desc: string;
  videoUrl: string;
  businessBrief?: string;
  images?: {
    establishing?: string;
    action?: string;
    macro?: string;
  };
}

export function getScenes(): Scene[] {
  // Read local JSON files and videos using Vite's fast glob
  const files = import.meta.glob('/src/scenes/*/scene.json', { eager: true });
  const videos = import.meta.glob('/src/scenes/*/video.mp4', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
  const establishingImages = import.meta.glob('/src/scenes/*/establishing_shot.jpg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
  const actionImages = import.meta.glob('/src/scenes/*/action_shot.jpg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
  const macroImages = import.meta.glob('/src/scenes/*/macro_shot.jpg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
  
  const scenes: Scene[] = [];

  for (const path in files) {
    const file = files[path] as { default: any };
    const sceneData = file.default;
    
    // Extract folder name from path: /src/scenes/folder-name/scene.json
    const parts = path.split('/');
    const folderName = parts[parts.length - 2];
    
    const videoPath = `/src/scenes/${folderName}/video.mp4`;
    const videoUrl = videos[videoPath] || '';

    scenes.push({
      ...sceneData,
      id: folderName,
      videoUrl,
      images: {
        establishing: establishingImages[`/src/scenes/${folderName}/establishing_shot.jpg`] || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop',
        action: actionImages[`/src/scenes/${folderName}/action_shot.jpg`] || 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=800&auto=format&fit=crop',
        macro: macroImages[`/src/scenes/${folderName}/macro_shot.jpg`] || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop',
      }
    });
  }

  return scenes.sort((a, b) => a.id.localeCompare(b.id));
}
