"use client";
"use client"// src/app/home/page.js

'use client'

import { useRef, useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useTextAnimation } from '@/hooks/useTextAnimation'
import { useAppState, useAppContext } from '@/context/AppProvider'
import { useWebGL } from '@/context/WebGLContext'
import gsap from 'gsap'
import ErrorBoundary from '@/components/ErrorBoundary'

// Dynamically import WebGL components to prevent SSR execution
const LoaderDOM = dynamic(() => import('@/components/Interface/LoaderDOM'), {
  ssr: false
})

const Footer = dynamic(() => import('@/components/webgl/Footer/Footer'), {
  ssr: false
})

const Background = dynamic(() => import('@/components/webgl/Background/Background'), {
  ssr: false
})

const Title = dynamic(() => import('@/components/webgl/Title/Title'), {
  ssr: false
})

/**
 * Loading component for WebGL elements
 * @returns {JSX.Element} Loading UI
 */
const WebGLFallback = () => (
  <div className="webgl-loading">
    <span className="loading-indicator">Loading immersive experience...</span>
  </div>
)

/**
 * Simple loading state for the page
 * @returns {JSX.Element} Loading UI
 */
const PageLoading = () => (
  <div className="page-loading">
    <div className="loading-spinner"></div>
    <p>Loading content...</p>
  </div>
)

/**
 * Error fallback for WebGL components
 * @returns {JSX.Element} Error UI
 */
const WebGLErrorFallback = () => (
  <div className="webgl-error">
    <p>3D experience unavailable. You can still browse the site normally.</p>
  </div>
)

/**
 * HomePage component - Main landing page with WebGL experiences
 * @returns {JSX.Element} HomePage UI
 */
export default function HomePage() {
  const heroRef = useRef(null)
  const firstNameRef = useRef(null)
  const lastNameRef = useRef(null)
  const taglineRef = useRef(null)
  const contactLinkRef = useRef(null)
  const workLinkRef = useRef(null)
  const aboutTitleRef = useRef(null)
  const contentRef = useRef(null)
  
  // Get app state and context
  const appState = useAppState()
  const { pageRef } = useAppContext()
  
  // Access WebGL context
  const webgl = useWebGL()
  
  // Essential state for rendering content
  const [isClient, setIsClient] = useState(false)
  const [animationsReady, setAnimationsReady] = useState(false)
  const [pageLoaded, setPageLoaded] = useState(false)
  const [contentVisible, setContentVisible] = useState(false)
  const [webglError, setWebglError] = useState(false)
  // Initialize animation timelines
  const mainTimelineRef = useRef(null)

  // Track if component is mounted on client and make content visible ASAP
  useEffect(() => {
    setIsClient(true)
    appState.setCurrentPage('home')
    
    // Show content immediately regardless of WebGL status
    setContentVisible(true)
    
    // Create main animation timeline
    const timeline = gsap.timeline({ paused: true });
    mainTimelineRef.current = timeline;
    
    // Mark animations as ready for sequencing
    setAnimationsReady(true)
    
    // Set a timeout to force pageLoaded state after a reasonable delay
    // This ensures users see content even if WebGL initialization is slow
    const forceLoadTimeout = setTimeout(() => {
      if (!pageLoaded) {
        setPageLoaded(true);
        appState.setLoaded();
      }
    }, 3000);
    
    return () => {
      // Cleanup timelines
      if (mainTimelineRef.current) {
        mainTimelineRef.current.kill();
      }
      
      clearTimeout(forceLoadTimeout);
    }
  }, [appState, pageLoaded])
  
  // Setup page references for WebGL after content is visible
  useEffect(() => {
    if (!contentRef.current || !pageRef || !isClient) return;
    
    try {
      // Store page reference for global access
      pageRef.current = {
        DOM: { el: contentRef.current },
        main: { device: webgl?.gl }
      };
    } catch (error) {
      console.error("Error setting up page references:", error);
      setWebglError(true);
    }
    
    return () => {
      // Clean up page reference
      if (pageRef && pageRef.current) {
        pageRef.current = null;
      }
    }
  }, [contentRef, pageRef, webgl?.gl, isClient])

  // Initialize text animations with proper refs
  useEffect(() => {
    if (!animationsReady || !isClient) return;
    
    // Allow some time for DOM to be ready
    const delay = setTimeout(() => {
      try {
        // Start the main animation sequence
        if (mainTimelineRef.current) {
          mainTimelineRef.current.play();
          
          // Set page as loaded after animations complete
          mainTimelineRef.current.eventCallback('onComplete', () => {
            setPageLoaded(true);
            appState.setLoaded();
          });
        }
      } catch (error) {
        console.error("Error starting animations:", error);
        // Ensure page is marked as loaded even if animations fail
        setPageLoaded(true);
        appState.setLoaded();
      }
    }, 100);
    
    return () => clearTimeout(delay);
  }, [animationsReady, isClient, appState]);
  
  // Handle WebGL initialization errors
  useEffect(() => {
    if (!webgl && isClient) {
      // Set a timeout to detect if WebGL fails to initialize
      const errorTimeout = setTimeout(() => {
        setWebglError(true);
      }, 5000);
      
      return () => clearTimeout(errorTimeout);
    }
  }, [webgl, isClient]);

  // Initialize text animations
  useTextAnimation(firstNameRef)
  useTextAnimation(lastNameRef)
  useTextAnimation(taglineRef)
  useTextAnimation(contactLinkRef, 1) // Use compressed style for links
  useTextAnimation(workLinkRef, 1) // Use compressed style for links
  useTextAnimation(aboutTitleRef)

  // Show loading state if content isn't ready yet
  if (!isClient) {
    return <PageLoading />;
  }

  return (
    <ErrorBoundary fallback={<div className="error-fallback">Something went wrong with the home page. Please refresh.</div>}>
      <main className="home">
        {contentVisible ? (
          <>
            <section className="home-hero" ref={heroRef}>
              {/* No need for local background canvas - using WebGL provider's canvas */}
              
              <div className="background-grid">
                <div className="background-column">
                  <div className="grid-element grid-element-1" />
                  <div className="grid-element grid-element-2" />
                </div>
              </div>

              <div id="content" className="content-container" ref={contentRef} data-template="home">
                <div className="container">
                  <div className="content-wrapper">
                    <h1 className="hero-title">
                      <div className="animated-title">
                        <div className="canvas-wrapper">
                          {isClient && !webglError && <canvas className="title-canvas" />}
                        </div>
                        <div className="title-text" data-text="Chris" />
                        <span ref={firstNameRef}>Chris</span>
                      </div>
                      <div className="animated-title">
                        <div className="canvas-wrapper">
                          {isClient && !webglError && <canvas className="title-canvas" />}
                        </div>
                        <div className="title-text" data-text="Hall" />
                        <span ref={lastNameRef}>Hall</span>
                      </div>
                    </h1>

              <div className="hero-content">
                <h2 className="subtitle">Designer & Art Director<br />Living in Los Angeles</h2>
                <h3 className="tagline" ref={taglineRef}>Portfolio_20/25</h3>
                <div className="hero-links">
                  <Link 
                    href="/contact" 
                    className="animated-link"
                    aria-label="Contact page"
                  >
                    <div className="link-icon" />
                    <span ref={contactLinkRef}>Contact</span>
                  </Link>
                  <Link 
                    href="/projects" 
                    className="animated-link"
                    aria-label="Projects page"
                  >
                    <div className="link-icon" />
                    <span ref={workLinkRef}>Work</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-about">
        <div className="background-overlay" />
        <div className="container">
          <div className="about-content">
            <h2 className="section-title" ref={aboutTitleRef}>About</h2>
            {/* Content to be added here */}
          </div>
        </div>
      </section>
              {/* Display WebGL error message if there are issues */}
              {webglError && <WebGLErrorFallback />}

              {/* WebGL Components with Suspense for loading state */}
              <ErrorBoundary fallback={<WebGLErrorFallback />}>
                <Suspense fallback={<WebGLFallback />}>
                  {webgl?.isReady && !webglError && (
                    <>
                      <Footer />
                      <Background />
                      <Title />
                      <LoaderDOM />
                    </>
                  )}
                </Suspense>
              </ErrorBoundary>
            </>
        ) : (
          // Show loading state when content is not yet visible
          <div className="initial-loading">
            <div className="loading-container">
              <h1>NextGL</h1>
              <div className="loading-bar">
                <div className="loading-progress"></div>
              </div>
              <p>Loading your experience...</p>
            </div>
          </div>
        )}
      </main>
    </ErrorBoundary>
  );
}
