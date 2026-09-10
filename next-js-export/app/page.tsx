// Example of a page.tsx leveraging Next.js Server Components.
import Header from '../components/Header';
import CategoryFilter from '../components/CategoryFilter';
import ArticleHero from '../components/ArticleHero';
import ArticleList from '../components/ArticleList';
import Newsletter from '../components/Newsletter';
import Services from '../components/Services';
import { getLatestArticles } from '../lib/api';

export default async function Page() {
  const articles = await getLatestArticles();
  const heroArticle = articles[0];
  const remainingArticles = articles.slice(1);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pb-24">
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-1000 ease-out fill-mode-both">
          <CategoryFilter />

          <div className="px-5 mt-8 space-y-16">
            {heroArticle && <ArticleHero article={heroArticle} />}

            {remainingArticles.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-xs uppercase tracking-[0.2em] text-text-muted">Latest Memos</h2>
                  <div className="h-[1px] flex-grow bg-white/5" />
                </div>
                <ArticleList articles={remainingArticles} />
              </section>
            )}
          </div>
        </div>
        <Newsletter />
        <Services />
      </main>
    </div>
  );
}
