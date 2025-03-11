"use client";

import { useEffect, useState, useRef } from 'react';
import { useAppContext } from '@/components/AppInitializer';
import { loadImages, loadVideos } from '@/lib/utils/pageLoads';
import { createIos, callIos, showIos } from '@/lib/utils/pageIos';
import ProjectsIntro from '@/app/projects/intro/page';
import { setupGlobalUtils, waiter } from '@/lib/utils/animationUtils';
import gsap from 'gsap';

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
        
        // Initialize with accordion view active
        if (componentsRef.current.accordion) {
          componentsRef.current.accordion.classList.add('act');
          
          // Create custom event for animation
          const animEvent = new CustomEvent('anim', {
            detail: { state: 0, style: 0 }
          });
          
          // Set up nav blur
          const navBlur = document.querySelector('.nav_blur');
          if (navBlur) {
            navBlur.classList.add('up');
          }
        }
        
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
      // Create custom animation event
      const animEvent = new CustomEvent('anim', {
        detail: { state: 0, style: 0 }
      });
      
      // Store event in appContext for access by other components
      if (appContext && !appContext.events) {
        appContext.events = { anim: animEvent };
      }
      
      // Toggle between accordion and list views
      if (componentsRef.current.list) {
        componentsRef.current.list.addEventListener('click', handleListViewToggle);
      }
      
      if (componentsRef.current.accordion) {
        componentsRef.current.accordion.addEventListener('click', handleAccordionViewToggle);
      }
    };
    
    const handleListViewToggle = () => {
      if (componentsRef.current.activeView === 'list') return;
      
      // Remove active class from accordion button
      componentsRef.current.accordion.classList.remove('act');
      
      // Create and dispatch animation event
      const animEvent = new CustomEvent('anim', {
        detail: { state: 1, style: 1 }
      });
      document.dispatchEvent(animEvent);
      
      // Add active class to list button
      componentsRef.current.list.classList.add('act');
      
      // Update active view
      componentsRef.current.activeView = 'list';
      
      // Update container classes
      const container = domRef.current.el.querySelector('.projects_list');
      if (container) {
        container.classList.remove('accordion');
        container.classList.add('list');
      }
    };
    
    const handleAccordionViewToggle = () => {
      if (componentsRef.current.activeView === 'accordion') return;
      
      // Remove active class from list button
      componentsRef.current.list.classList.remove('act');
      
      // Create and dispatch animation event
      const animEvent = new CustomEvent('anim', {
        detail: { state: 0, style: 1 }
      });
      document.dispatchEvent(animEvent);
      
      // Add active class to accordion button
      componentsRef.current.accordion.classList.add('act');
      
      // Update active view
      componentsRef.current.activeView = 'accordion';
      
      // Update container classes
      const container = domRef.current.el.querySelector('.projects_list');
      if (container) {
        container.classList.remove('list');
        container.classList.add('accordion');
      }
    };
    
    const handleProjectClick = async (event) => {
      // Handle project item click with animation
      const target = event.currentTarget;
      const projectId = target.dataset.ids;
      
      if (!projectId) return;
      
      // Animation logic for project click
      if (appContext?.browserInfo?.device < 2) {
        const isSingle = target.classList.contains('single');
        const isSlide = target.classList.contains('cnt_el_sld');
        
        let projectElement = target;
        if (isSlide) {
          projectElement = domRef.current.el.querySelector(`.cnt_el[data-ids="${projectId}"]`);
        }
        
        const nameElement = projectElement.querySelector('.nfo_n');
        const titleElement = projectElement.querySelector('.nfo_t');
        
        // Create animation timeline
        const anim = gsap.timeline({ paused: true });
        
        if (isSingle) {
          anim
            .to(nameElement, { x: '+0rem', duration: 0.8, ease: 'power2.inOut' }, 0.7)
            .to(titleElement, { x: '+34.4rem', duration: 0.4, ease: 'power2.inOut' }, 0.6);
          
          // Wait for animation
          anim.play();
          await waiter(1400);
        } else if (isSlide) {
          if (componentsRef.current.accordion.classList.contains('act')) {
            anim
              .to(titleElement, { x: '+34.4rem', duration: 0.6, ease: 'power2.inOut' }, 0.2);
            
            anim.play();
            await waiter(1000);
          } else {
            anim
              .to(nameElement, { x: '+0rem', duration: 1, ease: 'power2.inOut' }, 0.2)
              .to(titleElement, { x: '+34.4rem', duration: 0.8, ease: 'power2.inOut' }, 0.2);
            
            anim.play();
            await waiter(1200);
          }
        } else {
          anim
            .to(nameElement, { x: '+0rem', duration: 1, ease: 'power2.inOut' }, 0.2)
            .to(titleElement, { x: '+34.4rem', duration: 0.8, ease: 'power2.inOut' }, 0.2);
          
          anim.play();
          await waiter(1200);
        }
      }
      
      // Navigate to project
      window.location.href = `/project?id=${projectId}`;
    };
    
    // Handle page exit animation
    const handleBeforeUnload = () => {
      // Remove nav blur
      const navBlur = document.querySelector('.nav_blur');
      if (navBlur) {
        navBlur.classList.remove('up');
      }
    };
    
    initPage();
    
    // Add event listener for navigation
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Cleanup function
    return () => {
      // Remove event listeners
      const projectItems = document.querySelectorAll('.projects_list .projects_item');
      projectItems.forEach(item => {
        item.removeEventListener('click', handleProjectClick);
      });
      
      if (componentsRef.current.list) {
        componentsRef.current.list.removeEventListener('click', handleListViewToggle);
      }
      
      if (componentsRef.current.accordion) {
        componentsRef.current.accordion.removeEventListener('click', handleAccordionViewToggle);
      }
      
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Run exit animation
      handleBeforeUnload();
    };
  }, [appContext]);
  
  return (
    <div className="projects-container">
      {!isLoaded && <div className="loading">Loading projects...</div>}
    </div>
  );
}
