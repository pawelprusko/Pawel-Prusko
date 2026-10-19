/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import Scenes from './pages/Scenes';
import SceneView from './pages/SceneView';
import Articles from './pages/Articles';
import ArticleView from './pages/ArticleView';
import ScrollToTop from './components/ScrollToTop';
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  useEffect(() => {
      // [FIX] Hack układu naprawiający błędy mobilnego Safe Area / 100vh
      const nudgeLayout = () => {
          const root = document.getElementById('root');
          if (root) {
              root.style.height = '100.1vh';
              root.style.minHeight = '100.1vh';
              
              window.scrollTo(0, 1);
              
              setTimeout(() => {
                  root.style.height = '100%';
                  root.style.minHeight = '100dvh';
              }, 200);
          }
      };

      nudgeLayout();
      setTimeout(nudgeLayout, 500);

      // Reveal app immediately so each page only loads its own local assets
      requestAnimationFrame(() => {
        document.body.classList.add('app-loaded');
      });
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scenes" element={<Scenes />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/article/:slug" element={<ArticleView />} />
        <Route path="/articles/:slug" element={<ArticleView />} />
        <Route path="/scene/:domainId/:sceneId" element={<SceneView />} />
        <Route path="/scene/:id" element={<SceneView />} />
        <Route path="/scene/*" element={<SceneView />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  );
}
