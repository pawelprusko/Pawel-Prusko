import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getScenes } from '../lib/api';

export default function SceneView() {
  const params = useParams<{ id?: string; domainId?: string; sceneId?: string }>();
  
  const allScenes = getScenes();
  
  // Resolve scene id across both /scene/:id and /scene/:domainId/:sceneId
  const queryId = params.domainId && params.sceneId 
    ? `${params.domainId}/${params.sceneId}` 
    : (params['*'] || params.id || '');

  // Find current scene
  const currentScene = allScenes.find(s => 
    s.id === queryId ||
    s.id === queryId.replace('/', '-') ||
    `${s.domainId}/${s.sceneSubId}` === queryId ||
    s.sceneSubId === queryId ||
    (s.domainId && s.sceneSubId && queryId.endsWith(s.sceneSubId) && queryId.includes(s.domainId))
  );
  
  if (!currentScene) {
    return (
      <div className="min-h-screen bg-background text-text-main flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="font-mono text-sm tracking-widest uppercase">Scene not found.</p>
        </main>
      </div>
    );
  }

  // Get other scenes from the same domain
  const domainScenes = allScenes.filter(
    s => s.domainId === currentScene.domainId && s.id !== currentScene.id
  );
  const otherScenes = domainScenes; // Only show scenes from the same domain

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/30 selection:text-text-main">
      <Header categoryTitle="Back" />

      <main className="max-w-3xl mx-auto px-6 pt-12 pb-20">
        
        {/* Navigation */}
        <div className="mb-12 flex items-center text-xs font-mono tracking-widest text-text-muted uppercase">
          <Link to="/" className="flex items-center gap-2 hover:text-text-main transition-colors group">
            <span className="text-lg leading-none group-hover:-translate-x-1 transition-transform mt-[-2px]">←</span>
            Back
          </Link>
        </div>

        {/* Header & Intro */}
        <section className="mb-16">
          <h2 className="text-xs font-mono font-semibold tracking-widest text-text-muted mb-6 uppercase">01 / Description</h2>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-secondary mb-6 leading-tight">
            {currentScene.title}
          </h1>
          <p className="text-lg text-text-muted leading-relaxed font-sans max-w-2xl">
            {currentScene.desc}
          </p>
        </section>

        {/* Hero Video */}
        <section className="mb-24">
          <div className="relative w-full overflow-hidden rounded-none bg-[#E6DBD2]">
            <video
              src={currentScene.videoUrl}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="w-full h-auto block"
            />
          </div>
        </section>

        {/* Visual Sequence */}
        <section className="mb-24">
          <h2 className="text-xs font-mono font-semibold tracking-widest text-text-muted mb-6 uppercase">
            02 / Visual Sequence
          </h2>
          <div className="flex flex-col gap-12 md:gap-16">
            {[
              { label: 'Establishing Shot', src: currentScene.images?.establishing, fallback: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop' },
              { label: 'Action Shot', src: currentScene.images?.action, fallback: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=800&auto=format&fit=crop' },
              { label: 'Post Shot', src: currentScene.images?.post, fallback: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop' },
              { label: 'Macro Shot', src: currentScene.images?.macro, fallback: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop' },
            ].map((shot, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="relative w-full overflow-hidden bg-[#E6DBD2]">
                  <img 
                    src={shot.src || shot.fallback} 
                    alt={shot.label} 
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      if (target.src !== shot.fallback) {
                        target.src = shot.fallback;
                      }
                    }}
                    className="w-full h-auto block" 
                  />
                </div>
                <span className="text-xs font-mono tracking-widest text-text-muted uppercase">{shot.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Business Brief */}
        <section className="mb-24">
          <h2 className="text-xs font-mono font-semibold tracking-widest text-text-muted mb-6 uppercase">
            03 / Business Brief
          </h2>
          <div className="flex flex-col">
            <p className="text-lg text-text-main font-sans leading-relaxed max-w-2xl">
              {currentScene.businessBrief || 'The viral factor is driven by the perfectly AI-frozen motion of descending sea salt, creating a mystical aura over the dish. This is an ideal concept for premium specialty brands (e.g., artisanal salt producers, organic CPG brands) or luxury restaurants promoting a plant-based B2B menu.'}
            </p>
          </div>
        </section>

        {/* Explore More Scenes */}
        {otherScenes.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xs font-mono font-semibold tracking-widest text-text-muted mb-6 uppercase">
              04 / Continue {currentScene.domain || currentScene.domainId}
            </h2>
            <div className="flex flex-col divide-y divide-text-darker/40 border-y border-text-darker/40 mb-12">
              {otherScenes.map((scene) => (
                <Link 
                  key={scene.id} 
                  to={`/scene/${scene.id}`} 
                  className="group flex items-center justify-between py-6 transition-colors"
                >
                  <h3 className="font-heading text-2xl md:text-3xl text-secondary group-hover:text-[#886944] transition-colors">
                    {scene.title}
                  </h3>
                  <span className="text-text-main/30 group-hover:text-text-main transition-colors text-2xl md:text-3xl font-light">
                    →
                  </span>
                </Link>
              ))}
            </div>
            
            <div className="flex items-center">
              <Link to="/" className="group inline-flex items-center gap-3">
                <span className="text-sm font-semibold tracking-wide text-text-main border-b border-text-main/30 pb-0.5 group-hover:border-[#886944] group-hover:text-[#886944] transition-all">
                  Explore All Collections
                </span>
              </Link>
            </div>
          </section>
        )}

      </main>

      <Footer />
    </div>
  );
}
