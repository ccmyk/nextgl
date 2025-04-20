// src/app/home/page.js

'use client'

import { useRef, useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useTextAnimation } from '@/hooks/useTextAnimation'
import { useAppState } from '@/context/AppProvider'
import gsap from 'gsap'

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
    <span className="loading-indicator">Loading experience...</span>
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
  
  const { isLoaded, setLoaded, setCurrentPage } = useAppState()
  const [isClient, setIsClient] = useState(false)
  const [animationsReady, setAnimationsReady] = useState(false)
  
  // Initialize animation timelines
  const mainTimelineRef = useRef(null)

  // Track if component is mounted on client
  useEffect(() => {
    setIsClient(true)
    setCurrentPage('home')
    
    // Create main animation timeline
    const timeline = gsap.timeline({ paused: true });
    mainTimelineRef.current = timeline;
    
    // Mark animations as ready for sequencing
    setAnimationsReady(true)
    
    return () => {
      // Cleanup timelines
      if (mainTimelineRef.current) {
        mainTimelineRef.current.kill();
      }
    }
  }, [setCurrentPage])

  // Initialize text animations with proper refs
  useEffect(() => {
    if (!animationsReady || !isClient) return;
    
    // Allow some time for DOM to be ready
    const delay = setTimeout(() => {
      // Start the main animation sequence
      if (mainTimelineRef.current) {
        mainTimelineRef.current.play();
        
        // Set page as loaded after animations complete
        mainTimelineRef.current.eventCallback('onComplete', () => {
          setLoaded(true);
        });
      }
    }, 100);
    
    return () => clearTimeout(delay);
  }, [animationsReady, isClient, setLoaded]);

  // Initialize text animations
  useTextAnimation(firstNameRef)
  useTextAnimation(lastNameRef)
  useTextAnimation(taglineRef)
  useTextAnimation(contactLinkRef, 1) // Use compressed style for links
  useTextAnimation(workLinkRef, 1) // Use compressed style for links
  useTextAnimation(aboutTitleRef)

  return (
    <main className="home">
      <section className="home-hero" ref={heroRef}>
        {isClient && <canvas id="glBg" className="webgl-background" />}
        
        <div className="background-grid">
          <div className="background-column">
            <div className="grid-element grid-element-1" />
            <div className="grid-element grid-element-2" />
          </div>
        </div>

        <div id="content" className="content-container" data-template="home">
          <div className="container">
            <div className="content-wrapper">
              <h1 className="hero-title">
                <div className="animated-title">
                  <div className="canvas-wrapper">
                    {isClient && <canvas className="title-canvas" />}
                  </div>
                  <div className="title-text" data-text="Chris" />
                  <span ref={firstNameRef}>Chris</span>
                </div>
                <div className="animated-title">
                  <div className="canvas-wrapper">
                    {isClient && <canvas className="title-canvas" />}
                  </div>
                  <div className="title-text" data-text="Hall" />
                  <span ref={lastNameRef}>Hall</span>
                </div>
              </h1>

              <div className="hero-content">
                <h2 className="subtitle">Designer + Art Director<br />Living in Los Angeles</h2>
                <h3 className="tagline" ref={taglineRef}>Portfolio</h3>
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

      {/* WebGL Components with Suspense for loading state */}
      <Suspense fallback={<WebGLFallback />}>
        <Footer />
        <Background />
        <Title />
        <LoaderDOM />
      </Suspense>
    </main>
  )
}
