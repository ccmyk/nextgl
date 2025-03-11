"use client";

import { useEffect, useState, useRef } from 'react';
import { useAppContext } from '@/components/AppInitializer';
import { loadImages, loadVideos } from '@/lib/utils/pageLoads';
import { createIos, callIos, showIos } from '@/lib/utils/pageIos';
import ProjectIntro from '@/app/project/intro/page';
import In from '@/app/project/intro/ioin';
import Nxt from '@/app/project/intro/io';
import { setupGlobalUtils, waiter } from '@/lib/utils/animationUtils';
import gsap from 'gsap';

export default function Project() {
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
    // Setup global utilities for legacy compatibility
    setupGlobalUtils();
    
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
        
        // Load media
        await loadImages.call({ DOM: domRef.current });
        await loadVideos.call({ DOM: domRef.current });
        
        // Initialize components
        await createComponents();
        
        // Create and initialize intersection observers
        await createIos.call({ 
          DOM: domRef.current,
          iOpage: (animobj) => {
            if (animobj.el.classList.contains('iO-outin')) {
              animobj.class = new In(animobj, device);
            } else if (animobj.el.classList.contains('iO-nxt')) {
              // Create custom event for next project navigation
              const nextProjectEvent = new CustomEvent('nextproject', {
                detail: { project: null }
              });
              
              animobj.class = new Nxt(animobj, device, nextProjectEvent);
            }
            return animobj;
          }
        });
        
        callIos.call({ DOM: domRef.current, isVisible: 1 });
        showIos.call({ DOM: domRef.current });
        
        // Initialize intro animation if needed
        if (componentsRef.current.intro) {
          if (document.querySelector('.faketit')) {
            componentsRef.current.intro.set();
          } else {
            await componentsRef.current.intro.start();
          }
        }
        
        setIsLoaded(true);
      } catch (error) {
        console.error('Error initializing project page:', error);
      }
    };
    
    const createComponents = async () => {
      // Initialize intro component if it exists
      const introElement = domRef.current.el.querySelector('.project_intro');
      if (introElement) {
        componentsRef.current.intro = new ProjectIntro(
          introElement, 
          appContext?.browserInfo?.device || 0
        );
      }
      
      // Setup navigation elements
      setupNavigation();
    };
    
    const setupNavigation = () => {
      // Setup back button
      const backButton = domRef.current.el.querySelector('.backto');
      if (backButton) {
        backButton.addEventListener('click', handleBackClick);
      }
      
      // Setup next project navigation
      document.addEventListener('nextproject', handleNextProject);
    };
    
    const handleBackClick = () => {
      // Navigate back to projects page
      window.history.back();
    };
    
    const handleNextProject = (event) => {
      // Handle navigation to next project
      console.log('Navigate to next project:', event.detail.project);
      
      // Get next project element
      const nextProjectElement = document.querySelector('.nxtPr');
      if (nextProjectElement) {
        // Get name and title elements for animation
        const nameElement = nextProjectElement.querySelector('.cnt_n');
        const titleElement = nextProjectElement.querySelector('.cnt_t');
        
        if (nameElement && titleElement) {
          // Add animation classes
          nameElement.classList.add('nfo_n');
          titleElement.classList.add('nfo_t');
          
          // Set initial position for title on smaller devices
          if (appContext?.browserInfo?.device < 2) {
            gsap.set(titleElement, { x: '34.4rem' });
          }
          
          // Navigate to next project
          const projectId = nextProjectElement.dataset.ids;
          if (projectId) {
            window.location.href = `/project?id=${projectId}`;
          }
        }
      }
    };
    
    // Handle page exit animation
    const handleBeforeUnload = () => {
      // Remove loading classes from elements
      const loadedElements = domRef.current.el.querySelectorAll('.ivi.Ldd');
      loadedElements.forEach(element => {
        element.classList.remove('Ldd');
      });
    };
    
    initPage();
    
    // Add event listener for navigation
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Cleanup function
    return () => {
      // Remove event listeners
      const backButton = document.querySelector('.backto');
      if (backButton) {
        backButton.removeEventListener('click', handleBackClick);
      }
      
      document.removeEventListener('nextproject', handleNextProject);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Run exit animation
      handleBeforeUnload();
    };
  }, [appContext]);
  
  return (
    <div className="project-container">
      {!isLoaded && <div className="loading">Loading project...</div>}
    </div>
  );
}
