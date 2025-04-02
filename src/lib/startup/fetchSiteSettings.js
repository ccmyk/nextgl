// src/lib/startup/fetchSiteSettings.js
"use server";
/**
 * Fetches site settings from the API
 * This is a server component function for use in Next.js
 */

export async function fetchSiteSettings() {
  try {
    // Use the local Next.js API route
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api/settings';
    
    // Create a proper URL object to handle relative URLs
    const url = new URL(apiUrl, process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'));
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch site settings: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return {
      error: error.message,
      // Default settings as fallback
      settings: {
        title: 'Next GL',
        description: 'WebGL experiences with Next.js',
        theme: {
          colors: {
            primary: '#ffffff',
            secondary: '#050505',
          },
        },
        device: -1,
        webp: 1,
        webgl: 1,
      }
    };
  }
}
