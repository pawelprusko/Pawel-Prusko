import { useState, type Key } from 'react';

interface EditorialFrame {
  filename: string;
  label: string;
}

const EDITORIAL_FRAMES: EditorialFrame[] = [
  {
    filename: 'human-01',
    label: '01 — Full Talent: Burrata & Cherry Tomatoes',
  },
  {
    filename: 'human-02',
    label: '02 — Hands-Only: Slicing Artisan Sourdough',
  },
  {
    filename: 'human-03',
    label: '03 — Full Talent: Seared Steak Dining',
  },
  {
    filename: 'human-04',
    label: '04 — Hands-Only: Drizzling Raw Honey',
  },
];

const sceneHumanImages = import.meta.glob(
  ['/src/scenes/human/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', '/src/scenes/Human/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}'],
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;

function resolveHumanImage(filename: string): string | undefined {
  const match = Object.entries(sceneHumanImages).find(([path]) => {
    const base = path.split('/').pop()?.split('.')[0]?.toLowerCase();
    return base === filename.toLowerCase();
  });
  return match?.[1];
}

function EditorialPlaceholderFrame({ filename, label }: EditorialFrame & { key?: Key }) {
  const [loaded, setLoaded] = useState(false);
  const src = resolveHumanImage(filename);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-none bg-[#E6DBD2] ${
        loaded ? '' : 'aspect-[4/5]'
      }`}
      style={loaded ? undefined : { aspectRatio: '4 / 5' }}
    >
      {/* Graceful placeholder state when image file is empty or not yet placed */}
      {(!src || !loaded) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center select-none pointer-events-none">
          <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-[#A8845A]">
            4 : 5 Editorial Frame
          </span>
          <span className="font-heading text-xl sm:text-2xl text-[#5C5A59]/80 leading-snug max-w-md">
            {label}
          </span>
        </div>
      )}

      {src && (
        <img
          src={src}
          alt={label}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(false)}
          className={
            loaded
              ? 'w-full h-auto block transition-opacity duration-500 opacity-100'
              : 'absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none'
          }
        />
      )}
    </div>
  );
}

export default function HumanPresenceSection() {
  return (
    <section id="human-presence" className="mb-24 scroll-mt-24">
      <h2 className="text-xs font-mono font-semibold tracking-widest text-text-muted mb-6 uppercase">
        04 / HUMAN PRESENCE &amp; EDITORIAL REALISM
      </h2>

      <h3 className="font-heading text-4xl md:text-5xl lg:text-6xl text-secondary leading-tight mb-6">
        Human Story &amp; Tactile Motion — Without Talent Overhead
      </h3>

      <div className="flex flex-col gap-4 mb-12 max-w-2xl">
        <p className="text-lg text-text-main font-sans leading-relaxed">
          Authentic human interaction brings warmth and scale to culinary storytelling—yet traditional lifestyle shoots demand location rentals, model fees, hair and makeup, styling crews, and recurring global usage buyouts while delicate dishes lose their structure across repeated takes.
        </p>
        <p className="text-lg text-text-main font-sans leading-relaxed">
          Every human frame and hand-in-motion scene below is engineered 100% digitally from scratch—delivering natural anatomy, authentic expressions, and 100% dish identity retention with zero model fees or licensing expiration.
        </p>
      </div>

      {/* 4 Stacked Vertical Editorial Frames — full column width & borderless, matching SceneView 02 / Visual Sequence */}
      <div className="flex flex-col gap-12 md:gap-16">
        {EDITORIAL_FRAMES.map((frame) => (
          <EditorialPlaceholderFrame key={frame.filename} filename={frame.filename} label={frame.label} />
        ))}
      </div>

      {/* Key Metrics Callout Block */}
      <div className="w-full mt-14 pt-10 pb-10 border-y border-text-darker/40">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 text-center">
          <div className="flex-1 flex flex-col items-center gap-2">
            <span className="font-heading text-4xl md:text-5xl text-[#A8845A] font-normal tracking-tight tabular-nums leading-none">
              $0
            </span>
            <span className="text-xs font-mono tracking-widest uppercase text-[#5C5A59]">
              TALENT OVERHEAD
            </span>
          </div>

          <span className="text-[#A8845A] text-base leading-none select-none" aria-hidden="true">
            ✦
          </span>

          <div className="flex-1 flex flex-col items-center gap-2">
            <span className="font-heading text-4xl md:text-5xl text-[#A8845A] font-normal tracking-tight tabular-nums leading-none">
              70–80%
            </span>
            <span className="text-xs font-mono tracking-widest uppercase text-[#5C5A59]">
              PRODUCTION COST SAVED
            </span>
          </div>

          <span className="text-[#A8845A] text-base leading-none select-none" aria-hidden="true">
            ✦
          </span>

          <div className="flex-1 flex flex-col items-center gap-2">
            <span className="font-heading text-4xl md:text-5xl text-[#A8845A] font-normal tracking-tight tabular-nums leading-none">
              24–48h
            </span>
            <span className="text-xs font-mono tracking-widest uppercase text-[#5C5A59]">
              CONTENT DELIVERY
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
