import { Article } from '../lib/api';

export default function ArticleHero({ article }: { article: Article }) {
  return (
    <article className="flex flex-col gap-6 group cursor-pointer">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-white/5 rounded-sm">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
        <img
          src={article.heroImageUrl}
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-out"
        />
        <div className="absolute bottom-4 left-4 z-20">
          <span className="text-[10px] tracking-widest uppercase text-tertiary bg-background/40 backdrop-blur-md px-3 py-1 border border-white/5 rounded-full">
            {article.category}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-heading text-3xl leading-snug text-text-main group-hover:text-primary transition-colors duration-300">
          {article.title}
        </h2>
        <p className="font-sans text-text-muted leading-relaxed line-clamp-3">
          {article.excerpt}
        </p>
        <div className="text-[11px] uppercase tracking-widest text-secondary flex items-center gap-2">
          <span>Read Scroll</span>
          <div className="w-4 h-[1px] bg-secondary" />
        </div>
      </div>
    </article>
  );
}
