import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { formatArticleDate, type Article } from '../lib/api';

interface ArticlesArchiveProps {
  articles: Article[];
  sectionNumber?: string;
  title?: string;
  className?: string;
}

const DEFAULT_VISIBLE_COUNT = 3;
const PAGE_SIZE = 5;

export default function ArticlesArchive({
  articles,
  sectionNumber = '03',
  title = 'Articles Archive',
  className = 'mb-24',
}: ArticlesArchiveProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);

  if (!articles || articles.length === 0) {
    return null;
  }

  const totalArticles = articles.length;
  const totalPages = Math.ceil(totalArticles / PAGE_SIZE);

  // Pagination bounds
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, totalArticles);

  const displayedArticles = isExpanded
    ? articles.slice(startIndex, endIndex)
    : articles.slice(0, DEFAULT_VISIBLE_COUNT);

  const handleExpand = () => {
    setIsExpanded(true);
    setCurrentPage(1);
  };

  const scrollToArchiveTop = () => {
    if (sectionRef.current) {
      const topPos = sectionRef.current.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: Math.max(0, topPos), behavior: 'smooth' });
    }
  };

  const handleCollapse = () => {
    setIsExpanded(false);
    setCurrentPage(1);
    scrollToArchiveTop();
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    setCurrentPage(newPage);
    scrollToArchiveTop();
  };

  return (
    <section ref={sectionRef} className={className}>
      <h2 className="text-xs font-mono font-semibold tracking-widest text-text-muted mb-6 uppercase">
        {sectionNumber} / {title}
      </h2>

      {/* Articles List with thin #E5E2D9 horizontal dividers */}
      <div className="flex flex-col divide-y divide-[#E5E2D9] border-y border-[#E5E2D9] transition-opacity duration-300">
        {displayedArticles.map((article) => (
          <article key={article.slug} className="py-4">
            <Link to={`/articles/${article.slug}`} className="group block">
              <div className="text-xs font-mono tracking-wider text-text-muted mb-1 uppercase">
                {formatArticleDate(article.date)}
              </div>
              <h3 className="font-heading text-lg text-secondary group-hover:text-[#886944] transition-colors">
                {article.title}
              </h3>
            </Link>
          </article>
        ))}
      </div>

      {/* Default State: Trigger button to expand full archive */}
      {totalArticles > DEFAULT_VISIBLE_COUNT && !isExpanded && (
        <div className="mt-8 flex items-center">
          <button
            type="button"
            onClick={handleExpand}
            className="group inline-flex items-center cursor-pointer"
          >
            <span className="text-sm font-semibold tracking-wide text-text-main border-b border-text-main/30 pb-0.5 group-hover:border-[#886944] group-hover:text-[#886944] transition-all">
              Show All Articles
            </span>
          </button>
        </div>
      )}

      {/* Expanded State: Inline Minimalist Pagination Bar + Show Less button below on the left */}
      {isExpanded && (
        <div className="flex flex-col">
          {/* Pagination bar */}
          <div className="mt-8 flex items-center justify-between gap-4">
            {/* Left: Monospace count matching uppercase site labels */}
            <div className="text-xs font-mono tracking-wider text-text-muted uppercase select-none">
              Showing {startIndex + 1}–{endIndex} of {totalArticles}
            </div>

            {/* Right: Minimalist Prev / Next text controls */}
            <div className="flex items-center gap-3 sm:gap-4 text-xs font-mono tracking-wider uppercase">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className={`inline-flex items-center gap-1.5 transition-colors cursor-pointer select-none ${
                  currentPage <= 1
                    ? 'text-text-muted/30 pointer-events-none'
                    : 'text-text-main hover:text-[#886944]'
                }`}
                aria-label="Previous page"
              >
                <span aria-hidden="true">←</span> Prev
              </button>

              <span className="text-text-muted/30 select-none">/</span>

              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className={`inline-flex items-center gap-1.5 transition-colors cursor-pointer select-none ${
                  currentPage >= totalPages
                    ? 'text-text-muted/30 pointer-events-none'
                    : 'text-text-main hover:text-[#886944]'
                }`}
                aria-label="Next page"
              >
                Next <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>

          {/* Show Less button placed underneath pagination on the left, styled identically to Show All Articles */}
          <div className="mt-8 flex items-center">
            <button
              type="button"
              onClick={handleCollapse}
              className="group inline-flex items-center cursor-pointer"
            >
              <span className="text-sm font-semibold tracking-wide text-text-main border-b border-text-main/30 pb-0.5 group-hover:border-[#886944] group-hover:text-[#886944] transition-all">
                Show Less
              </span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
