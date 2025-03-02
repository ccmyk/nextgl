"use client";

import { useEffect, useState, useRef } from 'react';
import { useAppContext } from '@/components/AppInitializer';
import { loadImages, loadVideos } from '@/lib/utils/pageLoads';
import { createIos, callIos, showIos } from '@/lib/utils/pageIos';
import Intro from '@/app/home/intro/page';
import * as ScrollUtils from '@/lib/utils/pageScroll';

export default function HomePage() {
  const appContext = useAppContext();
  const [isLoaded, setIsLoaded] = useState(false);
  const domRef = useRef({
    el: null,
    images: null,
    videos: null,
    ios: null
  });
  const componentsRef = useRef({
    intro: null
  });
  
  useEffect(() => {
    const initPage = async () => {
      try {
        // Get main element
        const mainElement = document.querySelector('main');
        if (!mainElement) return;
        
        domRef.current = {
          el: mainElement,
          images: null,
          videos: null,
          ios: null
        };
        
        // Check device capabilities
        const { browserInfo } = appContext || {};
        const device = browserInfo?.device || 0;
        const webgl = browserInfo?.webgl || 0;
        
        // Load media if needed
        if (webgl === 0) {
          await loadImages.call({ DOM: domRef.current });
          await loadVideos.call({ DOM: domRef.current });
        }
        
        // Initialize components
        await createComponents();
        
        // Create and initialize intersection observers
        await createIos.call({ 
          DOM: domRef.current,
          iOpage: (animobj) => {
            if (animobj.el.classList.contains('iO-scroll')) {
              animobj.class = new ScrollUtils.Scroll(animobj, device);
            }
            return animobj;
          }
        });
        
        callIos.call({ DOM: domRef.current, isVisible: 1 });
        showIos.call({ DOM: domRef.current });
        
        setIsLoaded(true);
      } catch (error) {
        console.error('Error initializing home page:', error);
      }
    };
    
    const createComponents = async () => {
      // Initialize intro component if it exists
      const introElement = domRef.current.el.querySelector('.home_intro');
      if (introElement) {
        componentsRef.current.intro = new Intro(
          introElement, 
          appContext?.browserInfo?.device || 0
        );
        
        // Start intro animation
        await componentsRef.current.intro.start();
      }
    };
    
    initPage();
    
    // Cleanup function
    return () => {
      // Any cleanup needed
    };
  }, [appContext]);
  
  return (
    <div className="home-container">
      {!isLoaded && <div className="loading">Loading home page...</div>}
    </div>
  );
}