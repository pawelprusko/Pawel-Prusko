import { ArrowRight } from 'lucide-react';

const services = [
  { num: "01", title: "Workshops", desc: "Intensive 2-day immersive sessions on data strategy." },
  { num: "02", title: "Audits", desc: "Surgical breakdown of your existing data ecosystems." },
  { num: "03", title: "AI in Dataviz", desc: "LLM-driven predictive dashboards and aesthetics." },
  { num: "04", title: "Vibe Prototyping", desc: "Design decisions before writing code." },
];

export default function Services() {
  return (
    <section className="mt-24 px-5 pb-20">
      <div className="flex items-center gap-4 mb-10">
        <h2 className="text-xs uppercase tracking-[0.2em] text-text-muted">Transitional Services</h2>
        <div className="h-[1px] flex-grow bg-white/5" />
      </div>

      <div className="space-y-6">
        {services.map((svc) => (
          <div key={svc.num} className="group border-b border-white/5 pb-6 flex items-start gap-4 cursor-pointer">
            <span className="text-xs font-mono text-tertiary mt-1">{svc.num}</span>
            <div className="flex-grow">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-sans text-lg tracking-wide text-white/90 group-hover:text-primary transition-colors">{svc.title}</h3>
                <ArrowRight size={16} strokeWidth={1} className="text-white/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              <p className="font-sans text-sm text-text-muted">{svc.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
