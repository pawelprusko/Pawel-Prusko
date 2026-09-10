import { Article } from '../lib/api';

export default function ArticleList({ articles }: { articles: Article[] }) {
  return (
    <div className="flex flex-col gap-10">
      {articles.map((article) => (
        <article key={article.id} className="flex gap-4 group cursor-pointer">
          <div className="w-24 h-24 shrink-0 overflow-hidden bg-white/5 rounded-sm relative">
             <img
              src={article.heroImageUrl}
              alt=""
              className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
             />
          </div>
          <div className="flex flex-col justify-center gap-2">
            <span className="text-[9px] uppercase tracking-wider text-tertiary">
              {article.category} • {new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric'})}
            </span>
            <h3 className="font-heading text-base leading-tight text-white/90 group-hover:text-primary transition-colors line-clamp-2">
              {article.title}
            </h3>
          </div>
        </article>
      ))}
    </div>
  );
}
