import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStudioScene } from '../lib/api';

interface StudioSectionProps {
  sectionNumber?: string;
  context?: 'index' | 'article';
  buttonText?: string;
  linkTo?: string;
}

export default function StudioSection({
  sectionNumber = '03',
  context = 'index',
  buttonText = 'Enter the Studio',
  linkTo = '/scenes',
}: StudioSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const studioScene = getStudioScene(context);
  const videoSrc = studioScene.videoUrl;

  useEffect(() => {
    if (!videoSrc) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!videoRef.current) return;
          if (entry.isIntersecting) {
            videoRef.current.play().catch(() => {});
          } else {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
          }
        });
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, [videoSrc]);

  return (
    <section className="mb-24">
      <h2 className="text-xs font-mono font-semibold tracking-widest text-text-muted mb-6 uppercase">
        {sectionNumber} / STUDIO
      </h2>

      <div className="flex flex-col gap-20 md:gap-28">
        <Link to={linkTo} className="group block cursor-pointer">
          <div 
            className="relative aspect-[4/5] w-full overflow-hidden mb-4 rounded-none bg-[#E6DBD2]"
            style={{ aspectRatio: '4 / 5' }}
          >
            {videoSrc && !videoError ? (
              <video
                ref={videoRef}
                src={videoSrc}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                onError={() => setVideoError(true)}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out"
              />
            ) : (
              <div className="absolute inset-0 bg-[#E6DBD2]" />
            )}
          </div>

          <div className="mb-2.5">
            <span className="inline-block bg-[#2C2C2C] text-[#F9F2EA] text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 font-medium select-none">
              SHOWCASE
            </span>
          </div>

          <h3 className="font-heading text-2xl text-secondary mb-3 leading-snug group-hover:text-[#886944] transition-colors">
            {studioScene.title}
          </h3>

          <p className="text-lg text-text-muted leading-relaxed font-sans mb-3">
            {studioScene.desc}
          </p>

          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold tracking-wide text-text-main border-b border-text-main/30 pb-0.5 group-hover:border-[#886944] group-hover:text-[#886944] transition-all">
              {buttonText}
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
