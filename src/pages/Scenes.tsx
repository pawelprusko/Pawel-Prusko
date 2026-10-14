import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SceneCard from '../components/SceneCard';
import DirectAccessSection from '../components/DirectAccessSection';
import { getScenes, type Scene } from '../lib/api';
import { ENGINE_FEATURES, FRAMEWORKS } from './Home';

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

export default function Scenes() {
  const [expandedFramework, setExpandedFramework] = useState<string | null>('03');
  const allScenes: Scene[] = getScenes();
  const latestDropScene = allScenes.find((s) => s.id === 'the-latest-drop');
  const selectedScenes = allScenes.filter((s) => s.id !== 'the-latest-drop');

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Curated Scenes & Studio Feed | Pawel Prusko Studio';

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

    setMetaTag('name', 'description', 'A selection of 12 visual narratives across four culinary pillars. Designed as complete stories, every scene brings a mood to life through a motion asset and four purposeful shots.');
    setMetaTag('name', 'keywords', 'AI culinary art, virtual food styling, AI food photography, AI studio production, food visual essays, culinary scenes');
    setMetaTag('name', 'robots', 'index, follow, max-image-preview:large');

    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', 'https://www.pawelprusko.com/scenes');

    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:url', 'https://www.pawelprusko.com/scenes');
    setMetaTag('property', 'og:title', 'Curated Scenes & Studio Feed | Pawel Prusko Studio');
    setMetaTag('property', 'og:description', 'A selection of 12 visual narratives across four culinary pillars. Designed as complete stories, every scene brings a mood to life through a motion asset and four purposeful shots.');
    setMetaTag('property', 'og:image', 'https://www.pawelprusko.com/og-image.jpg');
    setMetaTag('property', 'og:image:alt', 'Pawel Prusko Studio - Curated Scenes');

    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', 'Curated Scenes & Studio Feed | Pawel Prusko Studio');
    setMetaTag('name', 'twitter:description', 'A selection of 12 visual narratives across four culinary pillars. Designed as complete stories, every scene brings a mood to life through a motion asset and four purposeful shots.');
    setMetaTag('name', 'twitter:image', 'https://www.pawelprusko.com/og-image.jpg');
    setMetaTag('name', 'twitter:image:alt', 'Pawel Prusko Studio - Curated Scenes');

    return () => {
      document.title = previousTitle || 'Pawel Prusko | AI Culinary Art Director & Generative Engineer';
    };
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/30 selection:text-text-main">
      <Header categoryTitle="Home" headerLink="/" showArticles={true} />

      <main className="max-w-3xl mx-auto px-6 pt-12 pb-20">
        {/* Navigation */}
        <div className="mb-12 flex items-center text-xs font-mono tracking-widest text-text-muted uppercase">
          <Link to="/" className="flex items-center gap-2 hover:text-text-main transition-colors group">
            <span className="text-lg leading-none group-hover:-translate-x-1 transition-transform mt-[-2px]">←</span>
            HOME
          </Link>
        </div>

        {/* 01 / Curated Scenes */}
        <section className="mb-24">
          <h2 className="text-xs font-mono font-semibold tracking-widest text-text-muted mb-6 uppercase">
            01 / Curated Scenes
          </h2>
          <div className="text-[18px] md:text-[26px] text-text-main font-mono leading-[1.4] md:leading-[1.4] mb-12">
            A selection of 12 visual narratives across four culinary pillars. Designed as complete stories, every scene brings a mood to life through a motion asset and four purposeful shots.
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

        {/* 02 / Studio Feed */}
        {latestDropScene && (
          <section className="mb-24">
            <h2 className="text-xs font-mono font-semibold tracking-widest text-text-muted mb-6 uppercase">
              02 / STUDIO FEED
            </h2>
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

        {/* 03 / The Engine */}
        <section className="mb-24">
          <h2 className="text-xs font-mono font-semibold tracking-widest text-text-muted mb-6 uppercase">
            03 / THE ENGINE
          </h2>
          <p className="text-lg text-text-main font-sans mb-10 leading-relaxed max-w-2xl">
            One proprietary visual engine powering both bespoke editorial productions
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

        {/* 04 / The Frameworks */}
        <section className="mb-24">
          <h2 className="text-xs font-mono font-semibold tracking-widest text-text-muted mb-6 uppercase">
            04 / THE FRAMEWORKS
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

        {/* 05 / Direct Access */}
        <DirectAccessSection sectionNumber="05" />
      </main>

      <Footer />
    </div>
  );
}
