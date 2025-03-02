"use client";

import { useEffect, useState, useRef } from 'react';
import { useAppContext } from '@/components/AppInitializer';
import { loadImages, loadVideos } from '@/lib/utils/pageLoads';
import { createIos, callIos, showIos } from '@/lib/utils/pageIos';
import ProjectsIntro from '@/app/projects/intro/page';

export default function Projects() {
  const appContext = useAppContext();
  const [isLoaded, setIsLoaded] = useState(false);
  const domRef = useRef({
    el: null,
    images: null,
    videos: null,
    ios: null
  });
  const componentsRef = useRef({
    intro: null,
    accordion: null,
    list: null,
    activeView: 'accordion'
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
              // Scroll animation logic would go here
              // animobj.class = new Scroll(animobj, device);
            }
            return animobj;
          }
        });
        
        callIos.call({ DOM: domRef.current, isVisible: 1 });
        showIos.call({ DOM: domRef.current });
        
        // Setup event listeners
        setupEventListeners();
        
        setIsLoaded(true);
      } catch (error) {
        console.error('Error initializing projects page:', error);
      }
    };
    
    const createComponents = async () => {
      // Initialize intro component if it exists
      const introElement = domRef.current.el.querySelector('.projects_intro');
      if (introElement) {
        componentsRef.current.intro = new ProjectsIntro(
          introElement, 
          appContext?.browserInfo?.device || 0
        );
      }
      
      // Get accordion and list elements
      componentsRef.current.accordion = domRef.current.el.querySelector('.toAc');
      componentsRef.current.list = domRef.current.el.querySelector('.toLs');
      
      // Initialize with accordion view
      if (componentsRef.current.accordion) {
        componentsRef.current.accordion.classList.add('act');
      }
      
      // Setup project items
      setupProjectItems();
    };
    
    const setupProjectItems = () => {
      // Setup project items
      const projectItems = domRef.current.el.querySelectorAll('.projects_list .projects_item');
      projectItems.forEach((item, index) => {
        // Add data index
        item.dataset.index = index;
        
        // Add click event for project items
        item.addEventListener('click', handleProjectClick);
      });
    };
    
    const setupEventListeners = () => {
      // Toggle between accordion and list views
      const viewToggleButtons = domRef.current.el.querySelectorAll('.projects_toggle span');
      viewToggleButtons.forEach(button => {
        button.addEventListener('click', handleViewToggle);
      });
    };
    
    const handleViewToggle = (event) => {
      const viewType = event.target.classList.contains('toAc') ? 'accordion' : 'list';
      
      if (componentsRef.current.activeView === viewType) return;
      
      // Update active view
      componentsRef.current.activeView = viewType;
      
      // Toggle active class on buttons
      const viewToggleButtons = domRef.current.el.querySelectorAll('.projects_toggle span');
      viewToggleButtons.forEach(button => {
        button.classList.toggle('act');
      });
      
      // Toggle view classes on container
      const container = domRef.current.el.querySelector('.projects_list');
      if (container) {
        if (viewType === 'accordion') {
          container.classList.remove('list');
          container.classList.add('accordion');
        } else {
          container.classList.remove('accordion');
          container.classList.add('list');
        }
      }
    };
    
    const handleProjectClick = (event) => {
      // Handle project item click
      console.log('Project clicked:', event.currentTarget.dataset.index);
      
      // Navigation logic would go here
    };
    
    initPage();
    
    // Cleanup function
    return () => {
      // Remove event listeners
      const projectItems = document.querySelectorAll('.projects_list .projects_item');
      projectItems.forEach(item => {
        item.removeEventListener('click', handleProjectClick);
      });
      
      const viewToggleButtons = document.querySelectorAll('.projects_toggle span');
      viewToggleButtons.forEach(button => {
        button.removeEventListener('click', handleViewToggle);
      });
    };
  }, [appContext]);
  
  return (
    <div className="projects-container">
      {!isLoaded && <div className="loading">Loading projects...</div>}
    </div>
  );
}
