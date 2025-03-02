'use client';

import { useEffect, useState } from 'react';
import { createContext, useContext } from 'react';
import FontFaceObserver from 'fontfaceobserver';
import { detectBrowserCapabilities, checkWebGLSupport } from '@/lib/utils/browserUtils';
import { fetchFromApi } from '@/lib/utils/apiUtils';
import LenisProvider from '@/components/LenisProvider';

// Create context for global app state
export const AppContext = createContext(null);

// Hook to use app context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppInitializer');
  }
  return context;
};

/**
 * AppInitializer component
 * Handles app initialization, device detection, and font loading
 */
export default function AppInitializer({ children, initialSettings = null }) {
  const [appState, setAppState] = useState({
    initialized: false,
    browserInfo: null,
    apiData: initialSettings || null,
    fontsLoaded: false,
    error: null
  });

  useEffect(() => {
    // Initialize app on client side only
    const initializeApp = async () => {
      try {
        // Detect browser capabilities
        const browserInfo = detectBrowserCapabilities();
        
        // Check WebGL support
        const webglSupport = checkWebGLSupport();
        browserInfo.webgl = webglSupport ? 1 : 0;
        
        if (!webglSupport && navigator.userAgent.toLowerCase().indexOf("android") > -1) {
          document.documentElement.classList.add('AND');
        }
        
        // Set CSS variables for viewport dimensions
        if (typeof window !== 'undefined') {
          document.documentElement.style.setProperty("--ck_hvar", window.innerHeight + 'px');
          
          // Add dev class if in development
          if (process.env.NODE_ENV === 'development') {
            document.documentElement.classList.add('dev');
          }
          
          // Set device-specific CSS variables
          if (browserInfo.isTouch) {
            document.documentElement.style.setProperty("--ck_hscr", window.screen.height + 'px');
            document.documentElement.style.setProperty("--ck_hvar", window.innerHeight + 'px');
            document.documentElement.style.setProperty("--ck_hmin", document.documentElement.clientHeight + 'px');
          } else {
            document.documentElement.style.setProperty("--ck_hscr", window.innerHeight + 'px');
            document.documentElement.style.setProperty("--ck_hvar", window.innerHeight + 'px');
            document.documentElement.style.setProperty("--ck_hmin", window.innerHeight + 'px');
          }
          
          // Calculate design scaling factors
          const designConfig = {
            L: {
              w: 1440,
              h: 800,
              multi: 0.4,
              ratio: 5.56,
              wide: ((window.innerHeight * 10) / window.innerWidth).toFixed(2),
            },
            P: {
              w: 390,
              h: 640,
              multi: 0.4,
            }
          };
          
          // Calculate L (landscape) scaling
          designConfig.L.total = ((designConfig.L.w / window.innerWidth) * 10);
          designConfig.L.total = 10 - ((10 - designConfig.L.total) * designConfig.L.multi);
          designConfig.L.total = Math.min(10, designConfig.L.total);
          
          // Calculate P (portrait) scaling
          designConfig.P.total = ((designConfig.P.w / window.innerWidth) * 10);
          designConfig.P.total = 10 - ((10 - designConfig.P.total) * designConfig.P.multi);
          designConfig.P.total = Math.min(10, designConfig.P.total);
          
          // Set CSS variables for scaling
          document.documentElement.style.setProperty("--ck_multiL", designConfig.L.total);
          document.documentElement.style.setProperty("--ck_multiP", designConfig.P.total);
          
          // Set theme colors
          document.documentElement.style.setProperty("--ck_accent", '#fff');
          document.documentElement.style.setProperty("--ck_other", '#050505');
        }
        
        // Load fonts
        const fontPromises = [
          new FontFaceObserver('Neue Montreal').load(),
          new FontFaceObserver('Neue Montreal Mono').load(),
          new FontFaceObserver('Air').load(),
        ];
        
        // Load API data if not provided through initialSettings
        let apiData = initialSettings;
        if (!apiData) {
          try {
            // Try to get content element (from old WordPress structure)
            const content = document.querySelector('#content');
            
            // If content element exists, use its data attributes
            const params = {
              url: process.env.NEXT_PUBLIC_API_URL || '/api/settings',
              device: browserInfo.device,
              webp: browserInfo.webp,
              webgl: browserInfo.webgl,
            };
            
            // Add optional parameters if they exist
            if (content) {
              if (content.dataset.id) params.id = content.dataset.id;
              if (content.dataset.template) params.template = content.dataset.template;
            }
            
            // Fetch API data
            apiData = await fetchFromApi(params);
          } catch (error) {
            console.error('Error fetching API data:', error);
            // Continue with initialSettings if available
            apiData = initialSettings;
          }
        }
        
        // Wait for fonts to load
        await Promise.all(fontPromises);
        
        // Update app state
        setAppState({
          initialized: true,
          browserInfo: {
            ...browserInfo,
            designConfig
          },
          apiData,
          fontsLoaded: true,
          error: null
        });
        
        // Remove loading class
        document.documentElement.classList.remove('loading');
        
      } catch (error) {
        console.error('Error initializing app:', error);
        setAppState(prev => ({
          ...prev,
          error: error.message,
          initialized: true // Mark as initialized even with error
        }));
      }
    };
    
    // Run initialization
    initializeApp();
    
    // Cleanup function
    return () => {
      // Any cleanup code here
    };
  }, [initialSettings]);
  
  // Show loading state
  if (!appState.initialized) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }
  
  // Show error state
  if (appState.error) {
    return (
      <div className="app-error">
        <h1>Something went wrong</h1>
        <p>{appState.error}</p>
      </div>
    );
  }
  
  // Render app with context provider
  return (
    <AppContext.Provider value={appState}>
      <LenisProvider isTouch={appState.browserInfo?.isTouch}>
        {children}
      </LenisProvider>
    </AppContext.Provider>
  );
}
