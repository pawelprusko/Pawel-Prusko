import { ArrowRight } from 'lucide-react';

export default function Newsletter() {
  return (
    <section className="mt-20 px-5 relative isolate">
      <div className="absolute inset-0 bg-primary/5 rounded-2xl mx-2 -z-10" />
      <div className="absolute inset-0 border border-primary/20 rounded-2xl mx-2 -z-10 translate-y-2 translate-x-2" />

      <div className="py-12 px-6 flex flex-col items-start gap-4 cursor-pointer group">
         <span className="text-[10px] tracking-widest uppercase text-tertiary bg-background/80 px-3 py-1 border border-white/5 rounded-full">
            Newsletter Issue #42
         </span>
         
         <h2 className="font-heading text-3xl leading-snug text-white group-hover:text-primary transition-colors mt-2">
           The Architecture of Intentional Friction
         </h2>
         <p className="font-sans text-sm text-text-muted leading-relaxed max-w-sm mb-4">
           Elite insights on why the best data systems force users to slow down. An exploration of artificial cognitive load in high-stakes dashboards, delivered this full moon.
         </p>
         
         <div className="text-[11px] uppercase tracking-widest text-secondary flex items-center gap-2 group-hover:gap-4 transition-all duration-300">
           <span>Read Journal</span>
           <ArrowRight size={14} />
         </div>
      </div>
    </section>
  );
}
