import { NextResponse } from 'next/server';

/**
 * API route for fetching site settings
 * This replaces the WordPress API endpoint
 */
export async function GET(request) {
  // Get query parameters
  const { searchParams } = new URL(request.url);
  const device = searchParams.get('device') || 0;
  const webp = searchParams.get('webp') || 0;
  const webgl = searchParams.get('webgl') || 0;
  
  // Mock response - replace with your actual data source
  const settings = {
    title: 'Next GL',
    description: 'WebGL experiences with Next.js',
    theme: {
      colors: {
        primary: '#ffffff',
        secondary: '#050505',
      },
    },
    // Add any other settings you need
    device: parseInt(device),
    webp: parseInt(webp),
    webgl: parseInt(webgl),
  };
  
  return NextResponse.json(settings);
}

/**
 * API route for POSTing settings data
 */
export async function POST(request) {
  try {
    // Parse form data
    const formData = await request.formData();
    const formJson = formData.get('form');
    
    if (!formJson) {
      return NextResponse.json(
        { error: 'Missing form data' },
        { status: 400 }
      );
    }
    
    const formData2 = JSON.parse(formJson);
    
    // Mock response - replace with your actual data processing
    const settings = {
      title: 'Next GL',
      description: 'WebGL experiences with Next.js',
      theme: {
        colors: {
          primary: '#ffffff',
          secondary: '#050505',
        },
      },
      // Return the data that was sent
      ...formData2
    };
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
