"use client";

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppContext } from '@/components/AppInitializer';
import { loadImages, loadVideos } from '@/lib/utils/pageLoads';
import { createIos, callIos, showIos } from '@/lib/utils/pageIos';

export default function ProjectDetail() {
  const params = useParams();
  const router = useRouter();
  const appContext = useAppContext();
  const [isLoaded, setIsLoaded] = useState(false);
  const [projectData, setProjectData] = useState(null);
  
  const domRef = useRef({
    el: null,
    images: null,
    videos: null,
    ios: null
  });
  
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        // In a real app, we would fetch the project data based on the slug
        // For now, we'll just simulate this
        const slug = params.slug;
        
        // Fetch project data from API
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api/settings';
        const response = await fetch(`${apiUrl}/projects/${slug}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch project data for ${slug}`);
        }
        
        const data = await response.json();
        setProjectData(data);
        
        // Initialize the page with the fetched data
        await initPage();
      } catch (error) {
        console.error('Error fetching project data:', error);
        // Handle error - maybe redirect to 404 page
        router.push('/error');
      }
    };
    
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
        
        // Create and initialize intersection observers
        await createIos.call({ 
          DOM: domRef.current,
          iOpage: (animobj) => {
            // Add any specific animations for project detail page
            return animobj;
          }
        });
        
        callIos.call({ DOM: domRef.current, isVisible: 1 });
        showIos.call({ DOM: domRef.current });
        
        setIsLoaded(true);
      } catch (error) {
        console.error('Error initializing project detail page:', error);
      }
    };
    
    if (params.slug) {
      fetchProjectData();
    }
    
    // Cleanup function
    return () => {
      // Any cleanup needed
    };
  }, [params.slug, appContext, router]);
  
  const handleBackClick = () => {
    router.push('/projects');
  };
  
  if (!isLoaded) {
    return <div className="loading">Loading project details...</div>;
  }
  
  return (
    <div className="project-detail-container">
      {projectData && (
        <>
          <button className="back-button" onClick={handleBackClick}>
            Back to Projects
          </button>
          
          <h1 className="project-title">{projectData.title}</h1>
          
          <div className="project-content">
            {/* Project content would be rendered here */}
          </div>
        </>
      )}
    </div>
  );
}