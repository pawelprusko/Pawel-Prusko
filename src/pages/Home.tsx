import { useState, useEffect, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, X } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SceneCard from '../components/SceneCard';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
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

  // Waitlist form state
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [isSubmittingWaitlist, setIsSubmittingWaitlist] = useState(false);
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);
  const [showWaitlistToast, setShowWaitlistToast] = useState(false);
  const [toastWaitlistEmail, setToastWaitlistEmail] = useState('');

  // Google Sheets Webhook URL for Waitlist
  const GOOGLE_SHEET_WAITLIST_URL = 'https://script.google.com/macros/s/AKfycbwPbyMwPeWK-lDqdXGlJsN8RFsK3k97SiD-xDM_39SNf1H12zZ8gWoVX-AbkryWWF1q/exec';

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

  const handleWaitlistSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmittingWaitlist) return;

    const emailToSubmit = waitlistEmail.trim();
    if (!emailToSubmit) return;

    setIsSubmittingWaitlist(true);

    try {
      // Single direct dispatch to Google Sheets Apps Script webhook
      if (GOOGLE_SHEET_WAITLIST_URL) {
        await fetch(GOOGLE_SHEET_WAITLIST_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            email: emailToSubmit,
            source: 'Homepage / Instant Culinary Studio',
            timestamp: new Date().toISOString(),
          }),
        }).catch((err) => {
          console.warn('[Waitlist] Google Sheets webhook error:', err);
        });
      }

      setWaitlistSuccess(true);
      setToastWaitlistEmail(emailToSubmit);
      setShowWaitlistToast(true);
      setWaitlistEmail('');

      // Auto dismiss toast after 7s
      setTimeout(() => {
        setShowWaitlistToast(false);
      }, 7000);
    } catch {
      setWaitlistSuccess(true);
      setToastWaitlistEmail(emailToSubmit);
      setShowWaitlistToast(true);
    } finally {
      setIsSubmittingWaitlist(false);
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

        {/* Sekcja 04: Instant Culinary Studio (NOWA SEKCJA - Teaser SaaS) */}
        <section id="instant-studio" className="mb-24 scroll-mt-24">
          <h2 className="text-xs font-mono font-semibold tracking-widest text-text-muted mb-6 uppercase">
            04 / INSTANT CULINARY STUDIO
          </h2>

          <h3 className="font-heading text-4xl md:text-5xl lg:text-6xl text-secondary leading-tight mb-4">
            Smartphone-to-Editorial AI Transformation
          </h3>

          <p className="text-lg text-text-main font-sans leading-relaxed max-w-2xl mb-8">
            Built for restaurants, cocktail bars, and CPG teams. Turn raw kitchen or smartphone photos into campaign-ready visual assets in seconds — preserving 100% of your dish identity while applying high-fashion studio lighting.
          </p>

          {/* Interaktywny suwak Before / After */}
          <div className="mb-10 w-full">
            <BeforeAfterSlider
              beforeSrc={beforeImg}
              afterSrc={afterImg}
              beforeLabel="Raw Smartphone Shot"
              afterLabel="Instant Studio Engine"
            />
          </div>

          {/* 3 Filary Wartości - Układ wiersz pod wierszem (Editorial Layout) */}
          <div className="flex flex-col divide-y divide-text-darker/40 border-y border-text-darker/40 mb-12">
            <div className="py-6 md:py-8 flex flex-col md:flex-row md:items-baseline justify-between gap-3 md:gap-8">
              <h4 className="font-heading text-xl sm:text-2xl md:text-2xl lg:text-[26px] text-secondary md:w-[46%] flex-shrink-0 md:whitespace-nowrap">
                100% Dish Integrity
              </h4>
              <p className="text-sm md:text-base font-sans text-text-muted leading-relaxed flex-1">
                No AI hallucinations. Your exact ingredients, plating, and textures remain completely unaltered.
              </p>
            </div>
            <div className="py-6 md:py-8 flex flex-col md:flex-row md:items-baseline justify-between gap-3 md:gap-8">
              <h4 className="font-heading text-xl sm:text-2xl md:text-2xl lg:text-[26px] text-secondary md:w-[46%] flex-shrink-0 md:whitespace-nowrap">
                Editorial Chiaroscuro
              </h4>
              <p className="text-sm md:text-base font-sans text-text-muted leading-relaxed flex-1">
                Replaces harsh flash or flat kitchen neon with soft, directional daylight and rich shadows.
              </p>
            </div>
            <div className="py-6 md:py-8 flex flex-col md:flex-row md:items-baseline justify-between gap-3 md:gap-8">
              <h4 className="font-heading text-xl sm:text-2xl md:text-2xl lg:text-[26px] text-secondary md:w-[46%] flex-shrink-0 md:whitespace-nowrap">
                Zero Studio Overhead
              </h4>
              <p className="text-sm md:text-base font-sans text-text-muted leading-relaxed flex-1">
                Get luxury agency-grade visuals in 10 seconds without hiring a full production team or food stylist.
              </p>
            </div>
          </div>

          {/* Formularz Waitlist */}
          <div className="mt-10">
            <div className="max-w-xl">
              <h4 className="text-xs font-mono font-semibold tracking-widest text-text-muted mb-3 uppercase">
                Early Access Waitlist
              </h4>
              {waitlistSuccess ? (
                <div className="p-5 bg-[#AA8559]/10 border border-[#AA8559]/30 text-text-main font-sans text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#AA8559] flex-shrink-0" />
                    <div>
                      <p className="font-medium text-secondary">
                        You're on the list.
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">
                        We'll send your 3 complimentary launch credits to {toastWaitlistEmail || 'your email'} upon launch.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWaitlistSuccess(false)}
                    className="text-xs font-mono tracking-wider uppercase text-[#AA8559] hover:text-[#886944] underline cursor-pointer whitespace-nowrap self-end sm:self-auto"
                  >
                    Register another email
                  </button>
                </div>
              ) : (
                <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    required
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    placeholder="Enter your work email"
                    className="flex-1 bg-transparent border border-text-darker/40 px-4 py-3 text-sm text-text-main placeholder:text-text-muted/60 font-sans focus:outline-none focus:border-secondary transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingWaitlist}
                    className="bg-[#2C2C2C] text-[#F9F2EA] px-6 py-3 font-mono text-xs tracking-wider uppercase font-semibold hover:bg-[#AA8559] transition-colors cursor-pointer select-none whitespace-nowrap disabled:opacity-50"
                  >
                    {isSubmittingWaitlist ? 'Requesting...' : 'Request Early Access →'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Sekcja 05: The Engine (Bez headline, tylko subheadline i punkty) */}
        <section className="mb-24">
          <h2 className="text-xs font-mono font-semibold tracking-widest text-text-muted mb-6 uppercase">
            05 / THE ENGINE
          </h2>
          <p className="text-lg text-text-main font-sans mb-10 leading-relaxed max-w-2xl">
            One proprietary visual engine powering both bespoke editorial productions and the automated Instant Culinary Studio.
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

        {/* Sekcja 06: Articles & Perspectives */}
        <section id="articles" className="mb-24 scroll-mt-24">
          <h2 className="text-xs font-mono font-semibold tracking-widest text-text-muted mb-6 uppercase">
            06 / ARTICLES & PERSPECTIVES
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
                  {latestArticle.h1 || latestArticle.title}
                </h4>
              </Link>
              <p className="text-sm md:text-base text-text-muted font-sans leading-relaxed max-w-2xl mb-6">
                {getTruncatedDescription(latestArticle, 200)}
              </p>
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

        {/* Sekcja 07: Direct Access */}
        <DirectAccessSection sectionNumber="07" />
      </main>

      <Footer />

      {/* Floating Waitlist Toast Notification */}
      {showWaitlistToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 max-w-[calc(100vw-3rem)] sm:max-w-md bg-[#1C1A18] text-[#FAF6F0] p-5 shadow-2xl border border-[#AA8559]/60 flex flex-col gap-2 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
        >
          <div className="flex items-center justify-between gap-3 border-b border-[#FAF6F0]/10 pb-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#AA8559] flex-shrink-0" />
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#AA8559] font-semibold">
                Early Access Reserved
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowWaitlistToast(false)}
              className="text-[#FAF6F0]/60 hover:text-[#FAF6F0] p-1 -mr-1 transition-colors cursor-pointer"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-sm font-sans text-[#FAF6F0]/90 leading-snug pt-1">
            Your spot for <span className="text-white font-medium">Instant Culinary Studio</span> has been secured for{' '}
            <span className="text-[#AA8559] font-mono text-xs">{toastWaitlistEmail}</span>. Your 3 complimentary launch credits will be delivered upon release.
          </p>
        </div>
      )}
    </div>
  );
}
