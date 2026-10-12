/// <reference types="vite/client" />

export interface Article {
  id: string;
  title: string;
  h1?: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  categoryId: string;
  date: string;
  heroImageUrl?: string;
  ogImage?: string;
  seoTitle?: string;
  metaDescription?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImageAlt?: string;
  aliases?: string[];
}

export function formatArticleDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function getArticles(): Article[] {
  // Read local JSON files using Vite's fast glob - supports both /articles/*/article.json and /articles/*/*/article.json
  const files = import.meta.glob(['/src/articles/*/*/article.json', '/src/articles/*/article.json'], { eager: true });
  const articles: Article[] = [];

  for (const path in files) {
    const file = files[path] as { default: any };
    const data = file.default;
    
    // Extract slug from folder path: /src/articles/slug-name/article.json or /src/articles/category/slug-name/article.json
    const parts = path.split('/');
    const folderSlug = parts[parts.length - 2];
    const categoryFolder = parts.length > 4 ? parts[parts.length - 3] : '';

    const slug = data.slug || folderSlug;
    const id = data.id || slug;

    // Build excerpt if missing
    let excerpt = data.excerpt || '';
    if (!excerpt && data.content) {
      excerpt = data.content.replace(/<[^>]*>/g, '').slice(0, 190);
    }

    articles.push({
      id,
      title: data.title || '',
      h1: data.h1,
      slug,
      aliases: data.aliases || [],
      excerpt,
      content: data.content || '',
      category: data.category || (categoryFolder ? categoryFolder.replace(/-/g, ' ').toUpperCase() : ''),
      categoryId: data.categoryId || categoryFolder,
      date: data.date || new Date().toISOString(),
      heroImageUrl: data.heroImageUrl || '',
      ogImage: data.ogImage || '/og-image.jpg',
      seoTitle: data.seoTitle,
      metaDescription: data.metaDescription,
      keywords: data.keywords,
      canonicalUrl: data.canonicalUrl,
      ogImageAlt: data.ogImageAlt
    });
  }

  // Sort by date descending (newest first)
  return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getLatestArticles(): Article[] {
  return getArticles();
}

export function getArticleBySlug(slug: string): Article | undefined {
  const allArticles = getArticles();
  return allArticles.find(a => a.slug === slug || a.id === slug || a.aliases?.includes(slug));
}

export interface Scene {
  id: string;
  title: string;
  desc: string;
  videoUrl: string;
  businessBrief?: string;
  domain?: string;
  domainId?: string;
  sceneSubId?: string;
  images?: {
    establishing?: string;
    action?: string;
    post?: string;
    macro?: string;
  };
}

export function getScenes(): Scene[] {
  // Read local JSON files, videos and images using Vite's fast glob
  const files = import.meta.glob(['/src/scenes/*/*/scene.json', '/src/scenes/*/scene.json'], { eager: true });
  const videos = import.meta.glob(['/src/scenes/*/*/video.mp4', '/src/scenes/*/video.mp4'], { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
  const establishingImages = import.meta.glob(['/src/scenes/*/*/establishing_shot.jpg', '/src/scenes/*/establishing_shot.jpg'], { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
  const actionImages = import.meta.glob(['/src/scenes/*/*/action_shot.jpg', '/src/scenes/*/action_shot.jpg'], { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
  const postImages = import.meta.glob(['/src/scenes/*/*/post_shot.jpg', '/src/scenes/*/post_shot.jpg'], { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
  const macroImages = import.meta.glob(['/src/scenes/*/*/macro_shot.jpg', '/src/scenes/*/macro_shot.jpg'], { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
  
  const scenes: Scene[] = [];

  for (const path in files) {
    const file = files[path] as { default: any };
    const sceneData = file.default;
    
    if (path.includes('/the-latest-drop/')) {
      const folderPath = '/src/scenes/the-latest-drop';
      const videoUrl = videos[`${folderPath}/video.mp4`] || '';
      scenes.push({
        ...sceneData,
        id: 'the-latest-drop',
        videoUrl,
        images: {
          establishing: establishingImages[`${folderPath}/establishing_shot.jpg`] || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop',
          action: actionImages[`${folderPath}/action_shot.jpg`] || 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=800&auto=format&fit=crop',
          post: postImages[`${folderPath}/post_shot.jpg`] || 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop',
          macro: macroImages[`${folderPath}/macro_shot.jpg`] || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop',
        }
      });
      continue;
    }

    if (path.includes('/studio/')) {
      // Skip standalone studio scene from curated domain scenes list
      continue;
    }

    // Domain nested scene: /src/scenes/{domainFolder}/{sceneSubId}/scene.json
    const parts = path.split('/');
    const sceneSubId = parts[parts.length - 2];
    const domainFolder = parts[parts.length - 3];
    
    const folderPath = `/src/scenes/${domainFolder}/${sceneSubId}`;
    const uniqueId = `${domainFolder}/${sceneSubId}`;
    const domainId = sceneData.domainId || domainFolder;
    const videoUrl = videos[`${folderPath}/video.mp4`] || '';

    scenes.push({
      ...sceneData,
      id: uniqueId,
      domainId,
      sceneSubId,
      videoUrl,
      images: {
        establishing: establishingImages[`${folderPath}/establishing_shot.jpg`] || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop',
        action: actionImages[`${folderPath}/action_shot.jpg`] || 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=800&auto=format&fit=crop',
        post: postImages[`${folderPath}/post_shot.jpg`] || 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop',
        macro: macroImages[`${folderPath}/macro_shot.jpg`] || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop',
      }
    });
  }

  return scenes.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
}

export function getStudioScene(context: 'index' | 'article' = 'index'): { title: string; desc: string; videoUrl: string } {
  if (context === 'article') {
    const jsonFiles = import.meta.glob(
      ['/src/scenes/studio-article/scene.json', '/src/scenes/article-studio/scene.json'],
      { eager: true }
    ) as Record<string, { default?: any }>;
    const jsonData = Object.values(jsonFiles)[0]?.default || {};

    const videos = import.meta.glob(
      [
        '/src/scenes/studio-article/video.mp4',
        '/src/scenes/studio-article/*.mp4',
        '/src/scenes/article-studio/video.mp4',
        '/src/scenes/article-studio/*.mp4',
      ],
      { eager: true, query: '?url', import: 'default' }
    ) as Record<string, string>;
    const videoUrl = Object.values(videos)[0] || '';

    return {
      title: jsonData.title || 'New-Gen Culinary Art',
      desc: jsonData.desc || 'By replacing physical studio setups with AI workflows, we eliminate studio rentals, prop logistics, and unpredictable reshoot costs, enabling instant creative tweaks and campaign-ready “Quiet Luxury” visuals in days, not weeks.',
      videoUrl,
    };
  }

  const jsonFiles = import.meta.glob(['/src/scenes/studio/scene.json'], { eager: true }) as Record<string, { default?: any }>;
  const jsonData = Object.values(jsonFiles)[0]?.default || {};

  const videos = import.meta.glob(['/src/scenes/studio/video.mp4', '/src/scenes/studio/*.mp4'], { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
  const videoUrl = Object.values(videos)[0] || '';
  return {
    title: jsonData.title || 'New-Gen Culinary Art',
    desc: jsonData.desc || 'By replacing physical studio setups with AI workflows, we eliminate studio rentals, prop logistics, and unpredictable reshoot costs, enabling instant creative tweaks and campaign-ready “Quiet Luxury” visuals in days, not weeks.',
    videoUrl,
  };
}
