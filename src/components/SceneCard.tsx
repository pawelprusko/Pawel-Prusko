import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

interface SceneCardProps {
  id: string;
  videoSrc: string;
  title: string;
  desc: string;
  externalLink?: string;
  buttonText?: string;
}

export default function SceneCard({ id, videoSrc, title, desc, externalLink, buttonText = "Explore Scene" }: SceneCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!videoRef.current) return;
          if (entry.isIntersecting) {
            // Uruchomienie odtwarzania wideo gdy wejdzie co najmniej do połowy ekranu
            videoRef.current.play().catch(() => {
              // Wyciszenie błędów związanych z autoplay w niektórych przeglądarkach
            });
          } else {
            // Zatrzymanie i reset gdy zniknie z widoku
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
  }, []);

  const innerContent = (
    <>
      <div className="relative aspect-[4/5] w-full overflow-hidden mb-4 rounded-none bg-[#E6DBD2]">
        {/* Gradient ukryty na prośbę: 
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/20 to-transparent z-10 pointer-events-none" /> 
        */}
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out"
        />
      </div>
      
      <h3 className="font-heading text-4xl md:text-5xl lg:text-6xl text-secondary mb-3 leading-tight group-hover:text-[#886944] transition-colors duration-500">
        {title}
      </h3>
      <p className="text-lg text-text-muted leading-relaxed font-sans mb-3">
        {desc}
      </p>
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold tracking-wide text-text-main border-b border-text-main/30 pb-0.5 group-hover:border-[#886944] group-hover:text-[#886944] transition-all">{buttonText}</span>
      </div>
    </>
  );

  if (externalLink) {
    return (
      <a href={externalLink} target="_blank" rel="noopener noreferrer" className="group block cursor-pointer">
        {innerContent}
      </a>
    );
  }

  return (
    <Link to={`/scene/${id}`} className="group block cursor-pointer">
      {innerContent}
    </Link>
  );
}
