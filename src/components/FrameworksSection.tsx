import { useState } from 'react';
import { FRAMEWORKS } from '../pages/Home';

interface FrameworksSectionProps {
  sectionNumber?: string;
  className?: string;
}

export default function FrameworksSection({
  sectionNumber = '04',
  className = 'mb-24',
}: FrameworksSectionProps) {
  const [expandedFramework, setExpandedFramework] = useState<string | null>('03');

  return (
    <section className={className}>
      <h2 className="text-xs font-mono font-semibold tracking-widest text-text-muted mb-6 uppercase">
        {sectionNumber} / THE FRAMEWORKS
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
                type="button"
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
  );
}
