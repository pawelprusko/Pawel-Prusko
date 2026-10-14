import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StudioSection from '../components/StudioSection';
import FrameworksSection from '../components/FrameworksSection';
import DirectAccessSection from '../components/DirectAccessSection';
import { getArticles, formatArticleDate, type Article } from '../lib/api';

export default function Articles() {
  const [showAllArchive, setShowAllArchive] = useState(false);
  const articles: Article[] = getArticles();
  const latestArticle = articles.length > 0 ? articles[0] : null;
  const archiveArticles = articles.length > 1 ? articles.slice(1) : [];

  const visibleArchiveArticles = showAllArchive 
    ? archiveArticles 
    : archiveArticles.slice(0, 3);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Articles & Perspectives | Pawel Prusko Studio';

    const setMetaTag = (attribute: 'name' | 'property', value: string, content: string) => {
      let meta = document.querySelector(`meta[${attribute}="${value}"]`) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, value);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
      return meta;
    };

    setMetaTag('name', 'description', 'Replacing physical studio friction with generative control. Essays on AI culinary art direction and production economics.');
    setMetaTag('name', 'keywords', 'AI culinary art, virtual food styling, AI food photography, AI studio production, food visual essays');
    setMetaTag('name', 'robots', 'index, follow, max-image-preview:large');

    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', 'https://www.pawelprusko.com/articles');

    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:url', 'https://www.pawelprusko.com/articles');
    setMetaTag('property', 'og:title', 'Articles & Perspectives | Pawel Prusko Studio');
    setMetaTag('property', 'og:description', 'Replacing physical studio friction with generative control. Essays on AI culinary art direction and production economics.');
    setMetaTag('property', 'og:image', 'https://www.pawelprusko.com/og-image.jpg');
    setMetaTag('property', 'og:image:alt', 'Pawel Prusko Studio - Articles & Perspectives');
    
    // Twitter Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', 'Articles & Perspectives | Pawel Prusko Studio');
    setMetaTag('name', 'twitter:description', 'Replacing physical studio friction with generative control. Essays on AI culinary art direction.');
    setMetaTag('name', 'twitter:image', 'https://www.pawelprusko.com/og-image.jpg');
    setMetaTag('name', 'twitter:image:alt', 'Pawel Prusko Studio - Articles & Perspectives');

    const jsonLdData = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Articles & Perspectives",
      "headline": "Articles & Perspectives | Pawel Prusko Studio",
      "description": "Replacing physical studio friction with generative control. Essays on AI culinary art direction and production economics.",
      "url": "https://www.pawelprusko.com/articles",
      "inLanguage": "en-US",
      "publisher": {
        "@type": "Organization",
        "name": "Pawel Prusko Studio",
        "url": "https://www.pawelprusko.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.pawelprusko.com/og-image.jpg"
        }
      }
    };

    let scriptTag = document.getElementById('articles-schema-jsonld') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'articles-schema-jsonld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.text = JSON.stringify(jsonLdData);

    return () => {
      document.title = previousTitle || 'Pawel Prusko | AI Culinary Art Director & Generative Engineer';
      const existingScript = document.getElementById('articles-schema-jsonld');
      if (existingScript) existingScript.remove();
    };
  }, []);

  // Extract first section from article content (everything before first <h2>) or fallback to excerpt
  const getFirstSectionParagraphs = (article: Article): string[] => {
    if (article.content) {
      const firstH2 = article.content.search(/<h2[\s>]/i);
      const firstSectionHtml = firstH2 !== -1 ? article.content.slice(0, firstH2) : article.content;
      const pMatches = Array.from(firstSectionHtml.matchAll(/<p(?:\s+[^>]*)?>([\s\S]*?)<\/p>/gi))
        .map(m => m[1].trim())
        .filter(Boolean);
      if (pMatches.length > 0) {
        return pMatches;
      }
    }
    if (article.excerpt) {
      return article.excerpt.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
    }
    return [];
  };

  const latestSectionParagraphs = latestArticle ? getFirstSectionParagraphs(latestArticle) : [];

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/30 selection:text-text-main">
      <Header categoryTitle="Home" headerLink="/" />

      <main className="max-w-3xl mx-auto px-6 pt-12 pb-20">
        {/* Navigation */}
        <div className="mb-12 flex items-center text-xs font-mono tracking-widest text-text-muted uppercase">
          <Link to="/" className="flex items-center gap-2 hover:text-text-main transition-colors group">
            <span className="text-lg leading-none group-hover:-translate-x-1 transition-transform mt-[-2px]">←</span>
            HOME
          </Link>
        </div>

        {/* 01 / ARTICLES & PERSPECTIVES */}
        <section className="mb-24">
          <h2 className="text-xs font-mono font-semibold tracking-widest text-text-muted mb-6 uppercase">
            01 / ARTICLES & PERSPECTIVES
          </h2>
          <div className="text-[18px] md:text-[26px] text-text-main font-mono leading-[1.4] md:leading-[1.4]">
            Replacing physical studio friction with generative control. Essays on AI culinary art direction and production economics.
          </div>
        </section>

        {/* 02 / Latest Article */}
        {latestArticle && (
          <section className="mb-24">
            <h2 className="text-xs font-mono font-semibold tracking-widest text-text-muted mb-6 uppercase">
              02 / Latest Article
            </h2>

            <div className="flex flex-col">
              <div className="text-xs font-mono tracking-wider text-text-muted mb-3 uppercase">
                {formatArticleDate(latestArticle.date)}
              </div>
              <Link to={`/articles/${latestArticle.slug}`} className="group block mb-6 md:mb-8">
                <h3 className="font-heading text-4xl md:text-5xl lg:text-6xl text-secondary leading-tight group-hover:text-[#886944] transition-colors duration-500">
                  {latestArticle.h1 || latestArticle.title}
                </h3>
              </Link>

              <div className="text-sm md:text-base text-text-muted font-sans leading-relaxed max-w-2xl mb-6 space-y-4">
                {latestSectionParagraphs.map((para, i) => (
                  <p key={i} dangerouslySetInnerHTML={{ __html: para }} />
                ))}
              </div>

              <div className="flex items-center">
                <Link
                  to={`/articles/${latestArticle.slug}`}
                  className="group inline-flex items-center"
                >
                  <span className="text-sm font-semibold tracking-wide text-text-main border-b border-text-main/30 pb-0.5 hover:border-[#886944] hover:text-[#886944] transition-all">
                    Read More
                  </span>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* 03 / Articles Archive */}
        {archiveArticles.length > 0 && (
          <section className="mb-24">
            <h2 className="text-xs font-mono font-semibold tracking-widest text-text-muted mb-6 uppercase">
              03 / Articles Archive
            </h2>

            <div className="flex flex-col divide-y divide-text-darker/40 border-y border-text-darker/40">
              {visibleArchiveArticles.map((article) => (
                <article key={article.slug} className="py-4">
                  <Link to={`/articles/${article.slug}`} className="group block">
                    <div className="text-xs font-mono tracking-wider text-text-muted mb-1">
                      {formatArticleDate(article.date)}
                    </div>
                    <h3 className="font-heading text-lg text-secondary group-hover:text-[#886944] transition-colors">
                      {article.h1 || article.title}
                    </h3>
                  </Link>
                </article>
              ))}
            </div>

            {archiveArticles.length > 3 && (
              <div className="mt-8 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowAllArchive(!showAllArchive)}
                  className="group inline-flex items-center cursor-pointer"
                >
                  <span className="text-sm font-semibold tracking-wide text-text-main border-b border-text-main/30 pb-0.5 group-hover:border-[#886944] group-hover:text-[#886944] transition-all">
                    {showAllArchive ? 'Show Less' : 'Show All Articles'}
                  </span>
                </button>
              </div>
            )}
          </section>
        )}

        {/* 03 / STUDIO */}
        <StudioSection sectionNumber="03" />

        {/* 04 / THE FRAMEWORKS */}
        <FrameworksSection sectionNumber="04" />

        {/* 05 / Direct Access */}
        <DirectAccessSection sectionNumber="05" />
      </main>

      <Footer />
    </div>
  );
}
