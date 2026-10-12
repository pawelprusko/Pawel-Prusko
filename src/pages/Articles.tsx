import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StudioSection from '../components/StudioSection';
import { getArticles, formatArticleDate, type Article } from '../lib/api';

export default function Articles() {
  const [showAllArchive, setShowAllArchive] = useState(false);
  const articles: Article[] = getArticles();
  const latestArticle = articles.length > 0 ? articles[0] : null;
  const archiveArticles = articles.length > 1 ? articles.slice(1) : [];

  const visibleArchiveArticles = showAllArchive 
    ? archiveArticles 
    : archiveArticles.slice(0, 3);

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/30 selection:text-text-main">
      <Header categoryTitle="Home" headerLink="/" />

      <main className="max-w-3xl mx-auto px-6 pt-12 pb-20">
        {/* Navigation */}
        <div className="mb-12 flex items-center text-xs font-mono tracking-widest text-text-muted uppercase">
          <Link to="/" className="flex items-center gap-2 hover:text-text-main transition-colors group">
            <span className="text-lg leading-none group-hover:-translate-x-1 transition-transform mt-[-2px]">←</span>
            Home
          </Link>
        </div>

        {/* 01 / ARTICLES & PERSPECTIVES */}
        <section className="mb-24">
          <h2 className="text-xs font-mono font-semibold tracking-widest text-text-muted mb-6 uppercase">
            01 / ARTICLES & PERSPECTIVES
          </h2>
          <div className="text-[18px] md:text-[26px] text-text-main font-mono leading-[1.4] md:leading-[1.4]">
            Replacing physical studio friction with generative control. Essays on AI culinary art direction and production economics.
          </div>
        </section>

        {/* 02 / The Latest Article */}
        {latestArticle && (
          <section className="mb-24">
            <h2 className="text-xs font-mono font-semibold tracking-widest text-text-muted mb-6 uppercase">
              02 / The Latest Article
            </h2>

            <div className="flex flex-col">
              <Link to={`/article/${latestArticle.slug}`} className="group block mb-6 md:mb-8">
                <h3 className="font-heading text-4xl md:text-5xl lg:text-6xl text-secondary leading-tight group-hover:text-[#886944] transition-colors duration-500">
                  {latestArticle.h1 || latestArticle.title}
                </h3>
              </Link>

              <div className="text-sm md:text-base text-text-muted font-sans leading-relaxed max-w-2xl mb-6 space-y-4">
                {latestArticle.excerpt ? (
                  latestArticle.excerpt.split(/\n\n+/).map((para, i) => (
                    <p key={i}>{para}</p>
                  ))
                ) : null}
              </div>

              <div className="flex items-center">
                <Link
                  to={`/article/${latestArticle.slug}`}
                  className="group inline-flex items-center"
                >
                  <span className="text-sm font-semibold tracking-wide text-text-main border-b border-text-main/30 pb-0.5 hover:border-[#886944] hover:text-[#886944] transition-all">
                    Read More
                  </span>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* 03 / Articles Archive */}
        {archiveArticles.length > 0 && (
          <section className="mb-24">
            <h2 className="text-xs font-mono font-semibold tracking-widest text-text-muted mb-6 uppercase">
              03 / Articles Archive
            </h2>

            <div className="flex flex-col divide-y divide-text-darker/40 border-y border-text-darker/40">
              {visibleArchiveArticles.map((article) => (
                <article key={article.slug} className="py-4">
                  <Link to={`/article/${article.slug}`} className="group block">
                    <div className="text-xs font-mono tracking-wider text-text-muted mb-1">
                      {formatArticleDate(article.date)}
                    </div>
                    <h3 className="font-heading text-lg text-secondary group-hover:text-[#886944] transition-colors">
                      {article.h1 || article.title}
                    </h3>
                  </Link>
                </article>
              ))}
            </div>

            {archiveArticles.length > 3 && (
              <div className="mt-8 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowAllArchive(!showAllArchive)}
                  className="group inline-flex items-center cursor-pointer"
                >
                  <span className="text-sm font-semibold tracking-wide text-text-main border-b border-text-main/30 pb-0.5 group-hover:border-[#886944] group-hover:text-[#886944] transition-all">
                    {showAllArchive ? 'Show Less' : 'Show All Articles'}
                  </span>
                </button>
              </div>
            )}
          </section>
        )}

        {/* 03 / STUDIO */}
        <StudioSection sectionNumber="03" />

        {/* Direct Access */}
        <section id="contact" className="mb-24">
          <h2 className="text-xs font-mono font-semibold tracking-widest text-text-muted mb-6 uppercase">
            04 / Direct Access
          </h2>
          <div className="flex flex-col">
            <div className="flex flex-col gap-4 mb-6">
              <p className="text-lg text-text-main font-sans leading-relaxed max-w-2xl">
                Available for global commissions, agency pitches, and monthly brand retainers.
              </p>
              <p className="text-lg text-text-main font-sans leading-relaxed max-w-2xl">
                Request a tailored sample render for your upcoming launch during your initial inquiry.
              </p>
            </div>
            <a
              href="mailto:hello@pawelprusko.com"
              className="font-heading text-2xl text-secondary hover:text-[#886944] transition-colors inline-block w-max"
            >
              hello@pawelprusko.com
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
