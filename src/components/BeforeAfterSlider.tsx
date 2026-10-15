import { useState, useRef, useCallback, type MouseEvent, type TouchEvent } from 'react';

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeLabel = 'RAW SHOT',
  afterLabel = 'INSTANT STUDIO',
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = (e: MouseEvent) => {
    setIsDragging(true);
    handleMove(e.clientX);
  };

  const handleTouchStart = (e: TouchEvent) => {
    setIsDragging(true);
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !e.touches[0]) return;
    handleMove(e.touches[0].clientX);
  };

  const handleStopDragging = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/5] w-full overflow-hidden select-none bg-[#E6DBD2] cursor-ew-resize rounded-none"
      style={{ aspectRatio: '4 / 5' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleStopDragging}
      onMouseLeave={handleStopDragging}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleStopDragging}
      role="slider"
      aria-valuenow={sliderPosition}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') {
          setSliderPosition((prev) => Math.max(0, prev - 5));
        } else if (e.key === 'ArrowRight') {
          setSliderPosition((prev) => Math.min(100, prev + 5));
        }
      }}
    >
      {/* After Image (Full background) */}
      <img
        src={afterSrc}
        alt={afterLabel}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        draggable={false}
      />

      {/* Before Image (Clipped overlay) */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{
          clipPath: `inset(0 calc(100% - ${sliderPosition}%) 0 0)`,
        }}
      >
        <img
          src={beforeSrc}
          alt={beforeLabel}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* Badges / Labels */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 pointer-events-none">
        <span className="inline-block bg-[#2C2C2C]/85 backdrop-blur-sm text-[#F9F2EA] text-[10px] sm:text-[11px] font-mono tracking-wider uppercase px-2.5 sm:px-3 py-1 font-medium select-none shadow-sm rounded-none">
          {beforeLabel}
        </span>
      </div>

      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 pointer-events-none">
        <span className="inline-block bg-[#AA8559]/90 backdrop-blur-sm text-[#F9F2EA] text-[10px] sm:text-[11px] font-mono tracking-wider uppercase px-2.5 sm:px-3 py-1 font-medium select-none shadow-sm rounded-none">
          {afterLabel}
        </span>
      </div>

      {/* Vertical divider line */}
      <div
        className="absolute top-0 bottom-0 z-30 pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-0 bottom-0 -left-[1px] w-[2px] bg-[#F9F2EA] shadow-[0_0_10px_rgba(0,0,0,0.4)]" />
        {/* Handle circle */}
        <div className="absolute top-1/2 -left-[18px] -translate-y-1/2 w-9 h-9 rounded-full bg-[#F9F2EA] text-[#2C2C2C] flex items-center justify-center shadow-[0_2px_12px_rgba(0,0,0,0.3)] border border-black/10 select-none">
          <div className="flex items-center justify-center gap-1 text-[#2C2C2C]">
            <svg
              className="w-2.5 h-3.5 fill-current"
              viewBox="0 0 10 16"
              aria-hidden="true"
            >
              <path d="M8 3L2 8l6 5V3z" />
            </svg>
            <svg
              className="w-2.5 h-3.5 fill-current"
              viewBox="0 0 10 16"
              aria-hidden="true"
            >
              <path d="M2 3l6 5-6 5V3z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
