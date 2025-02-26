// src/lib/startup/fetchSiteSettings.js
export async function fetchSiteSettings() {
  try {
    // const response = await fetch("https://chrishall.io/api/settings");

    if (!response.ok) {
      throw new Error('Failed to fetch site settings');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching settings:', error);
    return null;
  }
}
