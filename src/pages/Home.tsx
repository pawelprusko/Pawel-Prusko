import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SceneCard from '../components/SceneCard';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import HumanPresenceSection from '../components/HumanPresenceSection';
import DirectAccessSection from '../components/DirectAccessSection';
import { getScenes, getArticles, formatArticleDate, type Scene, type Article } from '../lib/api';

import beforeImg from '../scenes/instant-studio/before.jpg';
import afterImg from '../scenes/instant-studio/after.jpg';

export const ENGINE_FEATURES = [
  {
    number: '01',
    title: 'Variable Injection Architecture',
    desc: 'Preserving brand DNA and a consistent Quiet Luxury aesthetic while seamlessly introducing new product contexts, backgrounds, and styling props.',
  },
  {
    number: '02',
    title: 'Anatomical & Physical Realism',
    desc: 'Rigorous control over fluid micro-movements, steam dynamics, and natural hand anatomy, completely eliminating traditional AI artifacts.',
  },
  {
    number: '03',
    title: 'Static-to-Motion Pairing',
    desc: 'A seamless 1:1 workflow where static editorial frames transition into exact video counterparts featuring identical composition, lighting, and atmosphere.',
  },
];

export const FRAMEWORKS = [
  {
    number: '01',
    title: 'Pitch & Concept Assets',
    target: 'Agencies and production houses needing rapid visual validation or pitch-winning assets with a 48–72h turnaround.',
    output: '1 Complete Scene — 1 seamless video loop + 4 high-res editorial photos (wide, action, post-action, and macro angles).',
  },
  {
    number: '02',
    title: 'Core Retainer',
    target: 'Brands seeking a consistent, high-end presence across digital touchpoints.',
    output: '2 Complete Scenes per month — Each scene includes 1 video loop + 4 editorial photos (wide, action, post-action, and macro angles designed for carousel posts). Total: 2 seamless videos + 8 high-res photos.',
  },
  {
    number: '03',
    title: 'Growth Retainer',
    isBestseller: true,
    target: 'Brands seeking a consistent, high-end weekly presence across all digital touchpoints.',
    output: '4 Complete Scenes per month — Each scene includes 1 video loop + 4 editorial photos (wide, action, post-action, and macro angles designed for carousel posts). Total: 4 seamless videos + 16 high-res photos.',
  },
  {
    number: '04',
    title: 'Campaign Scale',
    target: 'Scaling brands running active marketing campaigns, seasonal launches, and multi-channel ads.',
    output: '8 Complete Scenes per month — Each scene includes 1 video loop + 4 editorial photos (wide, action, post-action, and macro angles designed for carousel posts). Total: 8 seamless videos + 32 high-res photos.',
  },
  {
    number: '05',
    title: 'Bespoke Production',
    target: 'Enterprise brands and global agencies requiring high-volume productions (10+ scenes) or custom formats.',
    output: 'Tailored scene volumes, custom display ratios, and full commercial licensing.',
  },
];

const SHOWCASE_SCENE_IDS = [
  'fine-dining-seafood/scene-2',
  'elevated-comfort-street-food/scene-2',
  'breakfast-desserts/scene-1',
  'liquid-dynamics-mixology/scene-1',
];

export default function Home() {
  const allScenes = getScenes();
  const [expandedFramework, setExpandedFramework] = useState<string | null>('03');

  // 4 Curated Showcase Scenes (Seared Scallops, Pinsa Romana, Honeycomb & Yogurt, Berry Tonic)
  const curatedShowcaseScenes = SHOWCASE_SCENE_IDS
    .map((id) => allScenes.find((s) => s.id === id))
    .filter((s): s is Scene => Boolean(s));

  // Articles
  const allArticles: Article[] = getArticles();
  const latestArticle = allArticles.length > 0 ? allArticles[0] : null;
  const recentArticles = allArticles.length > 1 ? allArticles.slice(1, 4) : [];

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

  const handleScrollToDirectAccess = () => {
    const el = document.getElementById('direct-access') || document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    document.title = 'Pawel Prusko | AI Culinary Art Director & Generative Engineer';

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

    setMetaTag('name', 'description', 'AI Culinary Art Director crafting high-fashion, editorial F&B visuals and motion. Eliminating physical studio constraints for luxury brands and CPG.');
    setMetaTag('name', 'keywords', 'AI Culinary Art Director, AI Food Photography, AI Commercial Video F&B, Quiet Luxury CPG, Virtual Food Styling, Pawel Prusko');
    setMetaTag('name', 'robots', 'index, follow, max-image-preview:large');

    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', 'https://www.pawelprusko.com');

    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:url', 'https://www.pawelprusko.com');
    setMetaTag('property', 'og:title', 'Pawel Prusko | AI Culinary Art Director');
    setMetaTag('property', 'og:description', 'Eliminating physical studio constraints with Quiet Luxury generative F&B editorial visuals and video.');
    setMetaTag('property', 'og:image', 'https://www.pawelprusko.com/og-image.jpg');
    setMetaTag('property', 'og:image:alt', 'Pawel Prusko - AI Culinary Art Director & Generative Engineer');

    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', 'Pawel Prusko | AI Culinary Art Director');
    setMetaTag('name', 'twitter:description', 'Quiet Luxury AI F&B visual production for global brands.');
    setMetaTag('name', 'twitter:image', 'https://www.pawelprusko.com/og-image.jpg');
    setMetaTag('name', 'twitter:image:alt', 'Pawel Prusko - AI Culinary Art Director & Generative Engineer');

    // Structured Entity Knowledge Graph (JSON-LD) for GEO & AI Search Engines
    const homeJsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Person",
          "@id": "https://www.pawelprusko.com/#person",
          "name": "Pawel Prusko",
          "jobTitle": "AI Culinary Art Director & Generative Engineer",
          "description": "AI Culinary Art Director crafting high-fashion, editorial food visuals & motion. Eliminating physical studio constraints and overhead to deliver campaign-ready assets in days, not weeks.",
          "url": "https://www.pawelprusko.com",
          "image": "https://www.pawelprusko.com/og-image.jpg",
          "sameAs": [
            "https://www.linkedin.com/in/pawelprusko"
          ],
          "knowsAbout": [
            "AI Culinary Art",
            "AI Food Photography",
            "AI Commercial Video F&B",
            "Generative Food & Beverage Video and Photography Production",
            "Culinary Art Direction",
            "Fluid Dynamics in F&B Video",
            "Quiet Luxury Visual Aesthetics",
            "Virtual Food Styling",
            "CPG Visual Asset Development",
            "Digital Liquid Modeling & Emulsions"
          ]
        },
        {
          "@type": "Organization",
          "@id": "https://www.pawelprusko.com/#organization",
          "name": "Pawel Prusko Studio",
          "url": "https://www.pawelprusko.com",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.pawelprusko.com/og-image.jpg"
          },
          "founder": {
            "@id": "https://www.pawelprusko.com/#person"
          },
          "description": "Virtual food styling and generative AI studio production for Quiet Luxury CPG brands, global packaging, and commercial video."
        },
        {
          "@type": "WebSite",
          "@id": "https://www.pawelprusko.com/#website",
          "url": "https://www.pawelprusko.com",
          "name": "Pawel Prusko Studio",
          "inLanguage": "en-US",
          "publisher": {
            "@id": "https://www.pawelprusko.com/#organization"
          }
        }
      ]
    };

    let scriptTag = document.getElementById('home-schema-jsonld') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'home-schema-jsonld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.text = JSON.stringify(homeJsonLd);

    return () => {
      const existingScript = document.getElementById('home-schema-jsonld');
      if (existingScript) existingScript.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/30 selection:text-text-main">
      <Header showArticles={true} />

      <main className="max-w-3xl mx-auto px-6 pt-16">
        {/* Sekcja 01: Hero Statement */}
        <section className="mb-24 mt-6">
          <h2 className="text-xs font-mono font-semibold tracking-widest text-text-muted mb-6 uppercase">
            01 / Statement
          </h2>
          <div className="text-[22px] md:text-[36px] text-text-main font-mono leading-[1.4] md:leading-[1.4]">
            Taste beyond limits. AI Culinary Art Director crafting high-fashion, editorial food visuals & motion. Eliminating physical studio constraints and overhead to deliver campaign-ready assets in days, not weeks.
          </div>
        </section>

        {/* Sekcja 02: Bespoke Scene Production (4 wybrane sceny + link do /scenes) */}
        <section id="bespoke-production" className="mb-24 scroll-mt-24">
          <h2 className="text-xs font-mono font-semibold tracking-widest text-text-muted mb-6 uppercase">
            02 / BESPOKE SCENE PRODUCTION
          </h2>
          <div className="flex flex-col gap-4 mb-8 max-w-2xl">
            <p className="text-lg text-text-main font-sans leading-relaxed">
              Production-ready visual pipelines engineered for luxury F&B campaigns and digital retainers.
            </p>
            <p className="text-lg text-text-main font-sans leading-relaxed">
              Every scene tells a cohesive story through a motion asset and four purposeful shots.
            </p>
          </div>

          <div className="flex flex-col gap-20 md:gap-28">
            {curatedShowcaseScenes.map((scene) => (
              <SceneCard
                key={scene.id}
                id={scene.id}
                videoSrc={scene.videoUrl}
                title={scene.title}
                desc={scene.desc}
              />
            ))}
          </div>

          <div className="mt-12 flex items-center">
            <Link
              to="/scenes"
              className="bg-[#2C2C2C] text-[#F9F2EA] px-6 py-3 font-mono text-xs tracking-wider uppercase font-semibold hover:bg-[#AA8559] transition-colors cursor-pointer select-none inline-block w-max"
            >
              DISCOVER ALL 12 SCENES →
            </Link>
          </div>
        </section>

        {/* Sekcja 03: The Frameworks (Główna oferta agencyjna i pakiety retainerowe) */}
        <section className="mb-24">
          <h2 className="text-xs font-mono font-semibold tracking-widest text-text-muted mb-6 uppercase">
            03 / Frameworks
          </h2>
          <p className="text-lg text-text-main font-sans mb-8 leading-relaxed max-w-2xl">
            Bespoke visual content pipelines built around complete multi-angle scenes for social media calendars, digital campaigns, and high-stakes pitches.
          </p>
          <div className="flex flex-col divide-y divide-text-darker/40 border-y border-text-darker/40 mb-8">
            {FRAMEWORKS.map((fw) => {
              const isExpanded = expandedFramework === fw.number;
              return (
                <div key={fw.number} className="flex flex-col">
                  <button 
                    onClick={() => setExpandedFramework(isExpanded ? null : fw.number)}
                    className="flex items-center justify-between w-full py-4 text-left group gap-4 cursor-pointer"
                  >
                    <div className="flex-1 flex flex-col items-start gap-1.5">
                      {fw.isBestseller && (
                        <span className="bg-[#2C2C2C] text-[#F9F2EA] text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 font-medium select-none">
                          MOST REQUESTED
                        </span>
                      )}
                      <h3 className="font-heading text-2xl text-secondary group-hover:text-[#886944] transition-colors">
                        {fw.title}
                      </h3>
                    </div>
                    <span className="text-text-main/30 group-hover:text-text-main transition-colors text-2xl font-light font-sans">
                      {isExpanded ? '−' : '+'}
                    </span>
                  </button>
                  {isExpanded && (
                    <div className="pb-8 pl-4 pr-4">
                      <div className="flex flex-col gap-4 text-sm font-sans text-text-muted leading-relaxed">
                        <p><strong className="text-text-main font-semibold">Target:</strong> {fw.target}</p>
                        <p><strong className="text-text-main font-semibold">Output:</strong> {fw.output}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-sm text-text-muted font-sans leading-relaxed max-w-2xl">
            To maintain direct founder access and uncompromised visual quality, active retainer capacity is strictly managed. All frameworks can be aligned with your internal campaign calendar.
          </p>
        </section>

        {/* Sekcja 04: Human Presence & Editorial Realism */}
        <HumanPresenceSection />

        {/* Sekcja 05: Instant Culinary Studio (Bespoke Reference-to-Editorial Art Direction) */}
        <span id="instant-studio" className="block relative -top-24 pointer-events-none" />
        <section id="05-instant-culinary-studio" className="mb-24 scroll-mt-24">
          <h2 className="text-xs font-mono font-semibold tracking-widest text-text-muted mb-6 uppercase">
            05 / INSTANT CULINARY STUDIO
          </h2>

          <h3 className="font-heading text-4xl md:text-5xl lg:text-6xl text-secondary leading-tight mb-4">
            Reference-to-Editorial Culinary Elevation
          </h3>

          <p className="text-lg text-text-main font-sans leading-relaxed max-w-2xl mb-8">
            A personalized, high-touch art direction service for restaurants, F&amp;B brands, and cookbook publishers. Start from an existing reference or smartphone photo of your actual prepared dish—we elevate lighting, surfaces, and atmosphere into Quiet Luxury editorial photography for menus, digital campaigns, and print publications while remaining 100% faithful to your exact plating, ingredients, and structure.
          </p>

          {/* Interaktywny suwak Before / After */}
          <div className="mb-10 w-full">
            <BeforeAfterSlider
              beforeSrc={beforeImg}
              afterSrc={afterImg}
              beforeLabel="RAW SHOT"
              afterLabel="INSTANT STUDIO"
            />
          </div>

          {/* 3 Filary Wartości - Układ wiersz pod wierszem (Editorial Layout) */}
          <div className="flex flex-col divide-y divide-text-darker/40 border-y border-text-darker/40 mb-12">
            <div className="py-6 md:py-8 flex flex-col md:flex-row md:items-baseline justify-between gap-3 md:gap-8">
              <h4 className="font-heading text-xl sm:text-2xl md:text-[25px] text-secondary md:w-[44%] flex-shrink-0 leading-snug">
                100% Structural &amp; Ingredient Fidelity
              </h4>
              <p className="text-sm md:text-base font-sans text-text-muted leading-relaxed flex-1">
                Your real dish stays untouched. Exact ingredients, proportions, plating geometry, and culinary textures from your reference shot are preserved without alteration.
              </p>
            </div>
            <div className="py-6 md:py-8 flex flex-col md:flex-row md:items-baseline justify-between gap-3 md:gap-8">
              <h4 className="font-heading text-xl sm:text-2xl md:text-[25px] text-secondary md:w-[44%] flex-shrink-0 leading-snug">
                Quiet Luxury Editorial Styling
              </h4>
              <p className="text-sm md:text-base font-sans text-text-muted leading-relaxed flex-1">
                Harsh kitchen lighting and cluttered backgrounds are replaced with directional chiaroscuro daylight, artisanal tableware, and refined tactile surfaces tailored for menus, campaigns, or cookbooks.
              </p>
            </div>
            <div className="py-6 md:py-8 flex flex-col md:flex-row md:items-baseline justify-between gap-3 md:gap-8">
              <h4 className="font-heading text-xl sm:text-2xl md:text-[25px] text-secondary md:w-[44%] flex-shrink-0 leading-snug">
                Bespoke 1-on-1 Art Direction
              </h4>
              <p className="text-sm md:text-base font-sans text-text-muted leading-relaxed flex-1">
                No generic software presets or automated filters. Every image is personally art-directed and refined around your dish and brand guidelines—delivering studio-grade assets without a physical photoshoot.
              </p>
            </div>
          </div>

          {/* Direct Personal Inquiry CTA */}
          <div className="mt-10 max-w-xl">
            <p className="text-sm md:text-base text-text-muted font-sans leading-relaxed mb-5">
              Have existing dish photos ready for elevation? Send a sample frame for a tailored consultation.
            </p>
            <button
              type="button"
              onClick={handleScrollToDirectAccess}
              className="bg-[#181716] text-[#F9F2EA] px-6 py-3 font-mono text-xs tracking-wider uppercase font-semibold hover:bg-[#A8845A] transition-colors cursor-pointer select-none inline-block whitespace-nowrap"
            >
              DISCUSS YOUR DISHES
            </button>
          </div>
        </section>

        {/* Sekcja 06: The Engine */}
        <section className="mb-24">
          <h2 className="text-xs font-mono font-semibold tracking-widest text-text-muted mb-6 uppercase">
            06 / THE ENGINE
          </h2>
          <p className="text-lg text-text-main font-sans mb-10 leading-relaxed max-w-2xl">
            One proprietary visual engine powering both bespoke scene productions and Instant Culinary Studio dish elevations.
          </p>
          <div className="flex flex-col gap-8 md:gap-12">
            {ENGINE_FEATURES.map((feat) => (
              <div key={feat.number} className="flex flex-col md:flex-row items-baseline md:items-start gap-2 md:gap-6">
                <span className="font-heading text-4xl font-light text-text-muted/60 w-16 flex-shrink-0 italic mt-[-4px]">
                  {feat.number}
                </span>
                <div className="flex-1">
                  <h3 className="font-heading text-2xl text-secondary mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-sm font-sans text-text-muted leading-relaxed max-w-2xl">
                    {feat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sekcja 07: Articles & Perspectives */}
        <section id="articles" className="mb-24 scroll-mt-24">
          <h2 className="text-xs font-mono font-semibold tracking-widest text-text-muted mb-6 uppercase">
            07 / ARTICLES & PERSPECTIVES
          </h2>
          <p className="text-lg text-text-main font-sans mb-10 leading-relaxed max-w-2xl">
            Essays on AI culinary art direction and production economics.
          </p>

          {latestArticle && (
            <div className="mb-12">
              <h3 className="text-xs font-mono tracking-widest text-text-muted mb-4 uppercase">
                LATEST ARTICLE
              </h3>
              <Link to={`/articles/${latestArticle.slug}`} className="group block mb-3 md:mb-4">
                <h4 className="font-heading text-4xl md:text-5xl lg:text-6xl text-secondary leading-tight group-hover:text-[#886944] transition-colors duration-500">
                  {latestArticle.title}
                </h4>
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
          )}

          {recentArticles.length > 0 && (
            <div>
              <h3 className="text-xs font-mono tracking-widest text-text-muted mb-6 uppercase">
                RECENT PERSPECTIVES
              </h3>
              <div className="flex flex-col divide-y divide-text-darker/40 border-y border-text-darker/40">
                {recentArticles.map((article) => (
                  <article key={article.slug} className="py-4">
                    <Link to={`/articles/${article.slug}`} className="group block">
                      <div className="text-xs font-mono tracking-wider text-text-muted mb-1">
                        {formatArticleDate(article.date)}
                      </div>
                      <h4 className="font-heading text-lg text-secondary group-hover:text-[#886944] transition-colors">
                        {article.title}
                      </h4>
                    </Link>
                  </article>
                ))}
              </div>
              <div className="mt-8 flex items-center">
                <Link
                  to="/articles"
                  className="group inline-flex items-center cursor-pointer"
                >
                  <span className="text-sm font-semibold tracking-wide text-text-main border-b border-text-main/30 pb-0.5 group-hover:border-[#886944] group-hover:text-[#886944] transition-all">
                    Explore All Articles
                  </span>
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* Sekcja 08: Direct Access */}
        <DirectAccessSection sectionNumber="08" />
      </main>

      <Footer />
    </div>
  );
}
