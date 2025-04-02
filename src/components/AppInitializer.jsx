// src/components/AppInitializer.jsx

import { useEffect, useState, createContext, useContext } from 'react';
import { detectBrowserCapabilities, checkWebGLSupport } from '@/lib/utils/browserUtils';
import { fetchFromApi } from '@/lib/utils/apiUtils';
import LenisProvider from '@/components/LenisProvider';

const AppContext = createContext();

export function useAppContext() {
  return useContext(AppContext);
}

const AppInitializer = ({ children }) => {
  const [fontReady, setFontReady] = useState(false);
  const [browserCapabilities, setBrowserCapabilities] = useState({});
  const [webGLSupported, setWebGLSupported] = useState(false);

  useEffect(() => {
    // Load fonts using the FontFace API
    const loadFonts = async () => {
      try {
        const customFont = new FontFace('CustomFont', "url('/fonts/custom-font.woff2')");
        await customFont.load(); // Wait for font to load
        document.fonts.add(customFont); // Add the custom font to the document
        setFontReady(true); // Mark font as loaded
      } catch (error) {
        console.error('Failed to load fonts:', error);
      }
    };

    // Detect browser capabilities
    const initializeCapabilities = async () => {
      const capabilities = detectBrowserCapabilities();
      setBrowserCapabilities(capabilities);

      const webGL = await checkWebGLSupport();
      setWebGLSupported(webGL);
    };

    loadFonts();
    initializeCapabilities();
  }, []);

  // Render a loading state while the font or browser capabilities are not ready
  if (!fontReady || !webGLSupported) {
    return <div>Loading...</div>;
  }

  return (
    <AppContext.Provider
      value={{
        fontReady,
        browserCapabilities,
        webGLSupported,
      }}
    >
      <LenisProvider>{children}</LenisProvider>
    </AppContext.Provider>
  );
};

export default AppInitializer;