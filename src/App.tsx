/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import SceneView from './pages/SceneView';
import ScrollToTop from './components/ScrollToTop';
import { getScenes } from './lib/api';

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

      // Preload all scene assets
      const scenes = getScenes();
      const assetsToLoad: Promise<void>[] = [];

      scenes.forEach(scene => {
        // Preload images
        if (scene.images) {
           Object.values(scene.images).forEach(src => {
             if (src) {
               assetsToLoad.push(new Promise((resolve) => {
                 const img = new Image();
                 img.src = src;
                 img.onload = () => resolve();
                 img.onerror = () => resolve(); // continue on error
               }));
             }
           });
        }
        
        // Preload videos (we wait for loadeddata so the first frame is ready)
        if (scene.videoUrl) {
           assetsToLoad.push(new Promise((resolve) => {
             const video = document.createElement('video');
             video.src = scene.videoUrl;
             video.preload = 'auto';
             video.muted = true;
             video.onloadeddata = () => resolve();
             video.onerror = () => resolve();
             video.load();
           }));
        }
      });

      // Max timeout of 3 seconds so the user isn't stuck forever on a slow connection
      const timeout = new Promise<void>(resolve => setTimeout(resolve, 3000));

      Promise.race([Promise.all(assetsToLoad), timeout]).then(() => {
          // Hide splash screen after assets are ready (or timeout hits)
          document.body.classList.add('app-loaded');
      });

  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scene/:id" element={<SceneView />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  );
}
