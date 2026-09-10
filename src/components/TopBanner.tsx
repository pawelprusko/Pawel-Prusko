import React, { useMemo } from 'react';
import { ArrowRight } from 'lucide-react';

export default function TopBanner() {
  const crystalPaths = useMemo(() => {
    const r = (i: number, seed: number) => {
      const fract = Math.sin(i * 13.412 + seed * 37.193) * 43758.5453;
      return fract - Math.floor(fract);
    };

    const genPath = (seed: number, baseY: number, waveAmp: number, waveFreq: number, crystalScale: number, minXStep: number, maxXStep: number) => {
      let path = `M 0 -50 L 1200 -50 `;
      const points: {x: number, y: number}[] = [];
      let x = 0;
      let i = 0;
      while (x < 1200) {
        const wave = Math.sin(x * waveFreq + seed) * waveAmp;
        const noise = (r(i, seed) - 0.5) * crystalScale;
        const y = baseY + wave + noise;
        points.push({ x, y });
        
        x += minXStep + r(i, seed + 1) * (maxXStep - minXStep);
        i++;
      }
      
      const lastWave = Math.sin(1200 * waveFreq + seed) * waveAmp;
      const lastNoise = (r(i, seed) - 0.5) * crystalScale;
      points.push({ x: 1200, y: baseY + lastWave + lastNoise });
      
      points.reverse().forEach(p => {
        path += `L ${p.x.toFixed(1)} ${p.y.toFixed(1)} `;
      });
      path += "Z";
      return path;
    };

    return [
      genPath(15, 110, 35, 0.008, 25, 15, 35),
      genPath(42, 80, 25, 0.008, 20, 20, 45),
      genPath(88, 55, 15, 0.008, 15, 25, 55),
    ];
  }, []);

  return (
    <div className="relative pt-6 pb-4 -mt-[80px]">
      {/* Background shape */}
      <div className="absolute top-0 left-0 right-0 w-full z-0">
        <div className="h-[110px] w-full bg-primary" />
        <div className="w-full leading-none -mt-[2px]">
          <svg fill="var(--color-primary)" viewBox="0 0 1200 160" preserveAspectRatio="none" className="w-full h-24 md:h-32 block drop-shadow-md">
            <path opacity="0.3" d={crystalPaths[0]} />
            <path opacity="0.6" d={crystalPaths[1]} />
            <path d={crystalPaths[2]} />
          </svg>
        </div>
      </div>

      <div className="mx-5 mb-8 mt-[240px] relative isolate z-10">
        <div className="relative isolate overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm px-6 pt-8 pb-8 shadow-2xl w-full border border-white/10 text-white max-w-5xl mx-auto flex flex-col lg:flex-row gap-8 items-center">
          
          <div className="w-full lg:w-1/2 aspect-video rounded-xl overflow-hidden bg-black/40 shadow-inner border border-white/10">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/sBLOYQ-W_Kw" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerPolicy="strict-origin-when-cross-origin" 
              allowFullScreen
              className="w-full h-full object-cover"
            ></iframe>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col items-start gap-5">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">✨</span>
              <span className="font-heading font-bold text-lg text-primary">Discover the Magic</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white leading-tight">
              Data Alchemy in Action
            </h2>
            
            <p className="font-sans text-[16px] text-gray-300 font-medium leading-relaxed">
              Transform raw information into golden insights. Watch how our process distills complexity into clear, actionable visualizations that drive your narrative forward.
            </p>

            <button className="mt-4 bg-primary hover:bg-primary/90 text-white py-3.5 px-6 rounded-xl flex items-center gap-4 transition-colors group shadow-lg">
              <span className="font-sans font-bold text-sm tracking-wide">Dataviz AI Advocate</span>
              <div className="bg-white/20 p-1.5 rounded-lg group-hover:bg-white/30 transition-colors">
                <ArrowRight size={16} className="text-white" />
              </div>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
