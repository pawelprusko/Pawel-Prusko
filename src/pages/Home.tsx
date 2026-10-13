import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SceneCard from '../components/SceneCard';
import { getScenes, getArticles, formatArticleDate, type Scene, type Article } from '../lib/api';
import { useState, useEffect } from 'react';

const CULINARY_DOMAINS = [
  {
    id: 'fine-dining-seafood',
    title: 'Fine Dining, Vegetarian & Seafood',
  },
  {
    id: 'elevated-comfort-street-food',
    title: 'Elevated Comfort & Street Food',
  },
  {
    id: 'breakfast-desserts',
    title: 'Breakfast & Desserts',
  },
  {
    id: 'liquid-dynamics-mixology',
    title: 'Liquid Dynamics & Mixology',
  },
];

const ENGINE_FEATURES = [
  { number: '01', title: 'Variable Injection Architecture', desc: 'Preserving brand DNA and a consistent Quiet Luxury aesthetic while seamlessly introducing new product contexts, backgrounds, and styling props.' },
  { number: '02', title: 'Anatomical & Physical Realism', desc: 'Rigorous control over fluid micro-movements, steam dynamics, and natural hand anatomy, completely eliminating traditional AI artifacts.' },
  { number: '03', title: 'Static-to-Motion Pairing', desc: 'A seamless 1:1 workflow where every static frame has an exact video counterpart featuring identical composition, lighting, and atmosphere.' }
];

const FRAMEWORKS = [
  {
    number: '01',
    title: 'Pitch & Concept Assets',
    target: 'Agencies and production houses needing rapid visual validation or pitch-winning assets with a 48–72h turnaround.',
    output: '1 Complete Scene — 1 seamless video loop + 4 high-res editorial photos (wide, action, post-action, and macro angles).'
  },
  {
    number: '02',
    title: 'Core Retainer',
    target: 'Brands seeking a consistent, high-end presence across digital touchpoints.',
    output: '2 Complete Scenes per month — Each scene includes 1 video loop + 4 editorial photos (wide, action, post-action, and macro angles designed for carousel posts). Total: 2 seamless videos + 8 high-res photos.'
  },
  {
    number: '03',
    title: 'Growth Retainer',
    isBestseller: true,
    target: 'Brands seeking a consistent, high-end weekly presence across all digital touchpoints.',
    output: '4 Complete Scenes per month — Each scene includes 1 video loop + 4 editorial photos (wide, action, post-action, and macro angles designed for carousel posts). Total: 4 seamless videos + 16 high-res photos.'
  },
  {
    number: '04',
    title: 'Campaign Scale',
    target: 'Scaling brands running active marketing campaigns, seasonal launches, and multi-channel ads.',
    output: '8 Complete Scenes per month — Each scene includes 1 video loop + 4 editorial photos (wide, action, post-action, and macro angles designed for carousel posts). Total: 8 seamless videos + 32 high-res photos.'
  },
  {
    number: '05',
    title: 'Bespoke Production',
    target: 'Enterprise brands and global agencies requiring high-volume productions (10+ scenes) or custom formats.',
    output: 'Tailored scene volumes, custom display ratios, and full commercial licensing.'
  }
];

export default function Home() {
  const allScenes = getScenes();
  const SHOW_LATEST_DROP = true; // Toggle this to true to show the section again
  const latestDropScene = allScenes.find(s => s.id === 'the-latest-drop');
  const selectedScenes = allScenes.filter(s => s.id !== 'the-latest-drop');
  const [expandedFramework, setExpandedFramework] = useState<string | null>('03');

  const allArticles: Article[] = getArticles();
  const latestArticle = allArticles.length > 0 ? allArticles[0] : null;
  const recentArticles = allArticles.length > 1 ? allArticles.slice(1, 4) : [];

  const getTruncatedDescription = (article: Article, maxChars = 200): string => {
    let text = '';
    if (article.content) {
      const firstH2 = article.content.search(/<h2[\s>]/i);
      const firstSectionHtml = firstH2 !== -1 ? article.content.slice(0, firstH2) : article.content;
      text = firstSectionHtml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    }
    if (!text && article.excerpt) {
      text = article.excerpt.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    }
    if (!text) return '';
    if (text.length <= maxChars) return text;
    const sub = text.slice(0, maxChars);
    const lastSpace = sub.lastIndexOf(' ');
    return (lastSpace > 160 ? sub.slice(0, lastSpace) : sub).trim() + '...';
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
    
    // Twitter Card
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

  const getSectionNumber = (baseNum: number) => {
    const num = SHOW_LATEST_DROP ? baseNum + 1 : baseNum;
    return `0${num}`;
  };

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/30 selection:text-text-main">
      <Header showArticles={true} />

      <main className="max-w-3xl mx-auto px-6 pt-16">
        {/* Section 0: Author */}
        <section className="mb-24 mt-6">
          <h2 className="text-xs font-mono font-semibold tracking-widest text-text-muted mb-6 uppercase">01 / Statement</h2>
          <div className="text-[22px] md:text-[36px] text-text-main font-mono leading-[1.4] md:leading-[1.4]">
           Taste beyond limits. AI Culinary Art Director crafting high-fashion, editorial food visuals & motion. Eliminating physical studio constraints and overhead to deliver campaign-ready assets in days, not weeks.
          </div>
        </section>

        {/* Section 2: Curated Scenes */}
        <section className="mb-24">
          <h2 className="text-xs font-mono font-semibold tracking-widest text-text-muted mb-6 uppercase">02 / Curated Scenes</h2>
          <div className="flex flex-col gap-4 mb-8 max-w-2xl">
            <p className="text-lg text-text-main font-sans leading-relaxed">
              A selection of 12 visual narratives across four culinary pillars.
            </p>
            <p className="text-lg text-text-main font-sans leading-relaxed">
              Every scene tells a cohesive story through a motion asset and four purposeful shots.
            </p>
          </div>
          <div className="flex flex-col gap-24 md:gap-32">
            {CULINARY_DOMAINS.map((domain) => {
              const domainScenes = selectedScenes
                .filter((s) => s.domainId === domain.id || s.id.startsWith(`${domain.id}/`))
                .sort((a, b) => (a.sceneSubId || a.id).localeCompare(b.sceneSubId || b.id, undefined, { numeric: true }));

              return (
                <div key={domain.id} className="flex flex-col">
                  <h3 className="text-xs font-mono tracking-widest text-text-muted mb-8 uppercase">
                    {domain.title}
                  </h3>
                  <div className="flex flex-col gap-20 md:gap-28">
                    {domainScenes.map((scene) => (
                      <SceneCard
                        key={scene.id}
                        id={scene.id}
                        videoSrc={scene.videoUrl}
                        title={scene.title}
                        desc={scene.desc}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 3: The Latest Drop */}
        {(SHOW_LATEST_DROP && latestDropScene) && (
          <section className="mb-24">
            <h2 className="text-xs font-mono font-semibold tracking-widest text-text-muted mb-6 uppercase">03 / STUDIO FEED</h2>
            <div className="flex flex-col gap-20 md:gap-28">
              <SceneCard
                id={latestDropScene.id}
                videoSrc={latestDropScene.videoUrl}
                title={latestDropScene.title}
                desc={latestDropScene.desc}
                externalLink="https://www.instagram.com/pawelprusko?igsh=MTMxMnRtbWJ3emRkcg%3D%3D&utm_source=qr"
                buttonText="See on Instagram"
                badgeText="EXTENDED SHOWCASE"
              />
            </div>
          </section>
        )}

        {/* Section 4: The Engine */}
        <section className="mb-24">
          <h2 className="text-xs font-mono font-semibold tracking-widest text-text-muted mb-6 uppercase">{getSectionNumber(3)} / The Engine</h2>
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

        {/* Section: Articles & Perspectives */}
        <section className="mb-24">
          <h2 className="text-xs font-mono font-semibold tracking-widest text-text-muted mb-6 uppercase">
            05 / ARTICLES & PERSPECTIVES
          </h2>
          <p className="text-lg text-text-main font-sans mb-10 leading-relaxed max-w-2xl">
            Essays on AI culinary art direction and production economics.
          </p>

          {latestArticle && (
            <div className="mb-12">
              <h3 className="text-xs font-mono tracking-widest text-text-muted mb-4 uppercase">
                LATEST ARTICLE
              </h3>
              <Link to={`/articles/${latestArticle.slug}`} className="group block mb-3">
                <h4 className="font-heading text-3xl md:text-4xl text-secondary leading-tight group-hover:text-[#886944] transition-colors duration-500">
                  {latestArticle.h1 || latestArticle.title}
                </h4>
              </Link>
              <p className="text-sm md:text-base text-text-muted font-sans leading-relaxed max-w-2xl">
                {getTruncatedDescription(latestArticle, 200)}
              </p>
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
                        {article.h1 || article.title}
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

        {/* Section: Frameworks */}
        <section className="mb-24">
          <h2 className="text-xs font-mono font-semibold tracking-widest text-text-muted mb-6 uppercase">{getSectionNumber(5)} / Frameworks</h2>
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
                    className="flex items-center justify-between w-full py-4 text-left group gap-4"
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

        {/* Section: Direct Access */}
        <section id="contact" className="mb-24">
          <h2 className="text-xs font-mono font-semibold tracking-widest text-text-muted mb-6 uppercase">{getSectionNumber(6)} / Direct Access</h2>
          <div className="flex flex-col">
            <div className="flex flex-col gap-4 mb-6">
              <p className="text-lg text-text-main font-sans leading-relaxed max-w-2xl">
                Available for global commissions, agency pitches, and monthly brand retainers.
              </p>
              <p className="text-lg text-text-main font-sans leading-relaxed max-w-2xl">
                Request a tailored sample render for your upcoming launch during your initial inquiry.
              </p>
            </div>
            <a href="mailto:hello@pawelprusko.com" className="font-heading text-2xl text-secondary hover:text-[#886944] transition-colors inline-block w-max">
              hello@pawelprusko.com
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
