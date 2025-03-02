'use client';

/**
 * API utilities for making requests
 * Refactored from the original firstload.js
 */

/**
 * Loads data from a REST API
 * @param {Object} options - Request options
 * @returns {Promise<Object>} API response data
 */
export async function fetchFromApi({
  url = '',
  device = 0,
  webp = 0,
  id = '',
  template = '',
  logged = 0,
  visible = 0,
  webgl = 1
}) {
  // Log request details in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`${url}?device=${device}&id=${id}&webp=${webp}&template=${template}&logged=${logged}&visible=${visible}`);
  }

  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    // Server-side rendering path
    const params = new URLSearchParams({
      device,
      id,
      webp,
      template,
      logged,
      visible,
      webgl
    });
    
    try {
      // Create a proper URL object to handle relative URLs
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const fullUrl = new URL(url, baseUrl);
      
      const response = await fetch(`${fullUrl.toString()}?${params.toString()}`, {
        method: 'GET',
        next: { revalidate: 3600 } // Cache for 1 hour
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API fetch error:', error);
      return { error: error.message };
    }
  } else {
    // Client-side rendering path
    const formData = new FormData();
    const info = {
      device,
      webp,
      id,
      template,
      logged,
      visible,
      webgl
    };
    
    formData.append('form', JSON.stringify(info));
    
    try {
      // Create a proper URL object to handle relative URLs
      const baseUrl = window.location.origin;
      const fullUrl = new URL(url, baseUrl);
      
      // First try a GET request
      const params = new URLSearchParams({
        device,
        id,
        webp,
        template,
        logged,
        visible,
        webgl
      });
      
      const getResponse = await fetch(`${fullUrl.toString()}?${params.toString()}`);
      
      if (getResponse.ok) {
        return await getResponse.json();
      }
      
      // If GET fails, try POST
      const postResponse = await fetch(fullUrl.toString(), {
        method: 'POST',
        body: formData
      });
      
      if (!postResponse.ok) {
        throw new Error(`API request failed with status ${postResponse.status}`);
      }
      
      return await postResponse.json();
    } catch (error) {
      console.error('API fetch error:', error);
      
      // Return a default response with error
      return {
        error: error.message,
        settings: {
          title: 'Next GL',
          description: 'WebGL experiences with Next.js',
          theme: {
            colors: {
              primary: '#ffffff',
              secondary: '#050505',
            },
          },
          device,
          webp,
          webgl
        }
      };
    }
  }
}
