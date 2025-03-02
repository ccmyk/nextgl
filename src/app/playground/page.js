"use client";

import { useEffect, useState, useRef } from 'react';
import { useAppContext } from '@/components/AppInitializer';
import { loadImages, loadVideos, newImages, newVideos } from '@/lib/utils/pageLoads';
import { createIos, callIos, showIos } from '@/lib/utils/pageIos';

export default function Home() {
  const appContext = useAppContext();
  const [isLoaded, setIsLoaded] = useState(false);
  const domRef = useRef({
    el: null,
    images: null,
    videos: null,
    ios: null
  });
  const elsRef = useRef([]);
  const poselRef = useRef(-1);
  
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
        
        // Handle non-WebGL or mobile devices
        if (webgl === 0 || device > 0) {
          document.documentElement.classList.add('NOGL');
          poselRef.current = -1;
          
          // Load media
          await loadImages.call({ DOM: domRef.current });
          await loadVideos.call({ DOM: domRef.current });
          
          // Add mobile-specific class
          if (device === 1) {
            domRef.current.el.classList.add('noclick');
          }
          
          // Setup elements
          elsRef.current = domRef.current.el.querySelectorAll('.el');
          
          // Setup click handlers
          elsRef.current.forEach((element, index) => {
            const writeElement = element.querySelector('.el_b .Awrite');
            
            if (writeElement) {
              const animEvent = new CustomEvent('anim', {
                detail: { state: 0, el: writeElement }
              });
              document.dispatchEvent(animEvent);
            }
            
            const moreDetailsElement = element.querySelector('.el_md');
            if (moreDetailsElement) {
              moreDetailsElement.addEventListener('click', handleMoreDetails);
            }
          });
        }
        
        // Create and initialize intersection observers
        await createIos.call({ DOM: domRef.current });
        callIos.call({ DOM: domRef.current, isVisible: 1 });
        showIos.call({ DOM: domRef.current });
        
        setIsLoaded(true);
      } catch (error) {
        console.error('Error initializing playground:', error);
      }
    };
    
    const handleMoreDetails = async (event) => {
      // Handle more details click
      if (poselRef.current != -1) {
        elsRef.current[poselRef.current].classList.remove('wact');
        
        const h = elsRef.current[poselRef.current].querySelector('.el_b .Awrite');
        const animEvent = new CustomEvent('anim', {
          detail: { state: -1, el: h }
        });
        document.dispatchEvent(animEvent);
        
        if (poselRef.current == event.target.closest('.el').dataset.index) {
          poselRef.current = -1;
          return false;
        }
      }
      poselRef.current = event.target.closest('.el').dataset.index;
      const b = event.target.closest('.el').querySelector('.el_b .Awrite');
      const animEvent = new CustomEvent('anim', {
        detail: { state: 1, el: b }
      });
      document.dispatchEvent(animEvent);
      
      elsRef.current[poselRef.current].classList.add('wact');
    };
    
    initPage();
    
    // Cleanup function
    return () => {
      elsRef.current.forEach(element => {
        const moreDetailsElement = element.querySelector('.el_md');
        if (moreDetailsElement) {
          moreDetailsElement.removeEventListener('click', handleMoreDetails);
        }
      });
    };
  }, [appContext]);
  
  return (
    <div className="playground-container">
      {!isLoaded && <div className="loading">Loading playground...</div>}
    </div>
  );
}
