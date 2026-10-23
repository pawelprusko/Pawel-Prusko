import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, type MouseEvent } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StudioSection from '../components/StudioSection';
import FrameworksSection from '../components/FrameworksSection';
import DirectAccessSection from '../components/DirectAccessSection';
import ArticlesArchive from '../components/ArticlesArchive';
import { getArticles, getArticleBySlug, formatArticleDate, type Article } from '../lib/api';

function formatArticleContent(html: string): string {
  if (!html) return '';
  let cleaned = html;
  if (!cleaned.includes('<p>') && !cleaned.includes('<p ')) {
    // Convert double breaks to paragraphs
    const parts = cleaned.split(/(?:<br\s*\/?>\s*){2,}/gi);
    cleaned = parts
      .map((part) => {
        const trimmed = part.trim();
        if (!trimmed) return '';
        if (trimmed.startsWith('<b>') && trimmed.endsWith('</b>')) return trimmed;
        if (trimmed.startsWith('<h2>') && trimmed.endsWith('</h2>')) return trimmed;
        return `<p>${trimmed}</p>`;
      })
      .filter(Boolean)
      .join('');
  }
  // Remove redundant break tags before or after block-level elements
  cleaned = cleaned
    .replace(/(<\/p>|<\/ul>|<\/ol>|<\/li>|<\/h[1-6]>|<\/b>)\s*(<br\s*\/?>)+/gi, '$1')
    .replace(/(<br\s*\/?>)+\s*(<p>|<ul>|<ol>|<h[1-6]>|<b>|<article>|<section>)/gi, '$2')
    .replace(/(<br\s*\/?>\s*){2,}/gi, '<br>');
  return cleaned;
}

export default function ArticleView() {
  const navigate = useNavigate();
  const params = useParams<{ slug?: string }>();
  const slug = params.slug || '';
  const article = getArticleBySlug(slug);

  const handleArticleClick = (e: MouseEvent<HTMLDivElement>) => {
    const target = (e.target as HTMLElement).closest('a');
    if (target) {
      const href = target.getAttribute('href');
      if (href && href.startsWith('/')) {
        e.preventDefault();
        navigate(href);
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    }
  };

  const allArticles: Article[] = getArticles();
  // Filter out current article so archive shows other articles (or all articles)
  const archiveArticles = allArticles.filter((a) => a.slug !== slug);

  useEffect(() => {
    if (!article) return;

    const previousTitle = document.title;
    const previousCanonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');

    // Page Title
    const pageTitle = article.seoTitle 
      ? `${article.seoTitle} | Pawel Prusko Studio`
      : `${article.title} | Pawel Prusko Studio`;
    document.title = pageTitle;

    // Helper to set or create meta tag
    const setMetaTag = (attribute: 'name' | 'property', value: string, content: string): HTMLMetaElement => {
      let meta = document.querySelector(`meta[${attribute}="${value}"]`) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, value);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
      return meta;
    };

    // Standard SEO Meta Tags
    if (article.metaDescription || article.excerpt) {
      setMetaTag('name', 'description', article.metaDescription || article.excerpt);
    }
    if (article.keywords) {
      setMetaTag('name', 'keywords', article.keywords);
    }
    setMetaTag('name', 'robots', 'index, follow, max-image-preview:large');

    // Canonical link
    const canonicalHref = article.canonicalUrl || `https://www.pawelprusko.com/articles/${article.slug}`;
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalHref);

    const ogImageHref = article.ogImage || 'https://pawelprusko.com/og-image.jpg';
    let dynamicAlt = article.ogImageAlt || `${article.seoTitle || article.title} - Pawel Prusko Studio`;
    if (dynamicAlt.includes('Pawel Prusko Studio') && !dynamicAlt.includes(' - Pawel Prusko Studio') && !dynamicAlt.includes(' | Pawel Prusko Studio')) {
      dynamicAlt = dynamicAlt.replace(/(\S)Pawel Prusko Studio/g, '$1 - Pawel Prusko Studio');
    }

    // Open Graph / Social Sharing
    setMetaTag('property', 'og:type', 'article');
    setMetaTag('property', 'og:url', canonicalHref);
    setMetaTag('property', 'og:title', article.seoTitle || article.title);
    setMetaTag('property', 'og:description', article.metaDescription || article.excerpt);
    setMetaTag('property', 'og:image', ogImageHref);
    setMetaTag('property', 'og:image:width', '1200');
    setMetaTag('property', 'og:image:height', '630');
    setMetaTag('property', 'og:image:alt', dynamicAlt);

    // Twitter Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', article.seoTitle || article.title);
    setMetaTag('name', 'twitter:description', article.metaDescription || article.excerpt);
    setMetaTag('name', 'twitter:image', ogImageHref);
    setMetaTag('name', 'twitter:image:alt', dynamicAlt);

    // Plain text article body for GEO (Generative Engine Optimization)
    const cleanArticleBody = (article.content || '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();

    // BlogPosting JSON-LD Schema (GEO & AI Engine optimized)
    const jsonLdData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": article.seoTitle || article.title,
      "description": article.metaDescription || article.excerpt,
      "articleBody": cleanArticleBody,
      "inLanguage": "en-US",
      "keywords": article.keywords,
      "datePublished": article.date,
      "dateModified": article.date,
      "image": {
        "@type": "ImageObject",
        "url": ogImageHref,
        "width": 1200,
        "height": 630
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": canonicalHref
      },
      "author": {
        "@type": "Person",
        "name": "Pawel Prusko",
        "jobTitle": "AI Culinary Art Director & Generative Engineer",
        "url": "https://pawelprusko.com"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Pawel Prusko Studio",
        "url": "https://pawelprusko.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://pawelprusko.com/og-image.jpg"
        }
      }
    };

    let scriptTag = document.getElementById('article-schema-jsonld') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'article-schema-jsonld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.text = JSON.stringify(jsonLdData);

    return () => {
      document.title = previousTitle || 'Pawel Prusko | AI Culinary Art Director & Generative Engineer';
      if (canonicalLink) {
        canonicalLink.setAttribute('href', previousCanonical || 'https://www.pawelprusko.com');
      }
      setMetaTag('name', 'description', 'AI Culinary Art Director crafting high-fashion, editorial F&B visuals and motion. Eliminating physical studio constraints for luxury brands and CPG.');
      setMetaTag('property', 'og:type', 'website');
      setMetaTag('property', 'og:url', 'https://www.pawelprusko.com');
      setMetaTag('property', 'og:title', 'Pawel Prusko | AI Culinary Art Director');
      setMetaTag('property', 'og:description', 'Eliminating physical studio constraints with Quiet Luxury generative F&B editorial visuals and video.');
      setMetaTag('property', 'og:image', 'https://www.pawelprusko.com/og-image.jpg');
      setMetaTag('property', 'og:image:alt', 'Pawel Prusko - AI Culinary Art Director & Generative Engineer');
      setMetaTag('name', 'twitter:title', 'Pawel Prusko | AI Culinary Art Director');
      setMetaTag('name', 'twitter:description', 'Quiet Luxury AI F&B visual production for global brands.');
      setMetaTag('name', 'twitter:image', 'https://www.pawelprusko.com/og-image.jpg');
      setMetaTag('name', 'twitter:image:alt', 'Pawel Prusko - AI Culinary Art Director & Generative Engineer');
      const existingScript = document.getElementById('article-schema-jsonld');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [article]);

  if (!article) {
    return (
      <div className="min-h-screen bg-background text-text-main flex flex-col font-sans">
        <Header categoryTitle="All Articles" headerLink="/articles" />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <p className="font-mono text-sm tracking-widest uppercase text-text-muted mb-6">
            Article not found
          </p>
          <Link
            to="/articles"
            className="font-mono text-xs tracking-wider text-[#886944] uppercase hover:underline"
          >
            ← ALL ARTICLES
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/30 selection:text-text-main">
      <Header categoryTitle="All Articles" headerLink="/articles" />

      <main className="max-w-3xl mx-auto px-6 pt-12 pb-20">
        {/* Navigation */}
        <div className="mb-12 flex items-center text-xs font-mono tracking-widest text-text-muted uppercase">
          <Link to="/articles" className="flex items-center gap-2 hover:text-text-main transition-colors group">
            <span className="text-lg leading-none group-hover:-translate-x-1 transition-transform mt-[-2px]">←</span>
            ALL ARTICLES
          </Link>
        </div>

        {/* Article Meta Header */}
        <header className="mb-12">
          <div className="flex items-center gap-4 text-xs font-mono tracking-wider text-text-muted mb-4 uppercase">
            <span>{formatArticleDate(article.date)}</span>
          </div>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-secondary leading-tight mb-8">
            {article.title}
          </h1>
        </header>

        {/* Article Content - Pure Typography (No visible graphics, Headless Metadata architecture) */}
        <article className="mb-24">
          <div
            className="article-body text-base md:text-lg text-text-main/90 font-sans"
            onClick={handleArticleClick}
            dangerouslySetInnerHTML={{
              __html: formatArticleContent(article.content)
            }}
          />
        </article>

        {/* 02 / Articles Archive */}
        <ArticlesArchive articles={archiveArticles} sectionNumber="02" />

        {/* Bridge Section: 03 / STUDIO */}
        <StudioSection sectionNumber="03" context="article" />

        {/* 04 / THE FRAMEWORKS */}
        <FrameworksSection sectionNumber="04" />

        {/* Direct Access Section */}
        <DirectAccessSection sectionNumber="05" />
      </main>

      <Footer />
    </div>
  );
}
