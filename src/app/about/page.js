"use client";

import { useEffect, useState, useRef } from 'react';
import { useAppContext } from '@/components/AppInitializer';
import { loadImages, loadVideos } from '@/lib/utils/pageLoads';
import { createIos, callIos, showIos } from '@/lib/utils/pageIos';
import AboutIntro from '@/app/about/intro/page';
import Scr from '@/app/about/dual/io';

export default function About() {
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
            if (animobj.el.classList.contains('iO-scr')) {
              animobj.class = new Scr(animobj, device, browserInfo?.isTouch);
            }
            return animobj;
          }
        });
        
        callIos.call({ DOM: domRef.current, isVisible: 1 });
        showIos.call({ DOM: domRef.current });
        
        setIsLoaded(true);
      } catch (error) {
        console.error('Error initializing about page:', error);
      }
    };
    
    const createComponents = async () => {
      // Initialize intro component if it exists
      const introElement = domRef.current.el.querySelector('.about_intro');
      if (introElement) {
        componentsRef.current.intro = new AboutIntro(
          introElement, 
          appContext?.browserInfo?.device || 0
        );
      }
      
      // Clone and append icons to list items
      const i = domRef.current.el.querySelector('.about_list .Awrite i');
      for(let a of domRef.current.el.querySelectorAll('.about_dual .cnt_t a')){
        a.insertAdjacentElement('beforeend',i.cloneNode(true))
      }

      // Remove icons from list items on larger devices
      if(appContext?.browserInfo?.device > 1){
        for(let a of domRef.current.el.querySelectorAll('.about_list .Awrite .iO')){
          a.parentNode.classList.add('ivi')
          a.parentNode.classList.add('nono')
          a.remove()
        }
      }
    };
    
    initPage();
    
    // Cleanup function
    return () => {
      // Any cleanup needed
    };
  }, [appContext]);
  
  return (
    <div className="about-container">
      {!isLoaded && <div className="loading">Loading about page...</div>}
    </div>
  );
}