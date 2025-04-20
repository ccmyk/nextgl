// src/components/Interface/Nav.jsx

'use client'

import { useEffect, useRef, useState } from 'react'
import { useAppContext, useAppState } from '@/context/AppProvider'
import Link from 'next/link'
import gsap from 'gsap'
import SplitType from 'split-type'

export default function Nav() {
  // Get references and state from context
  const { navRef } = useAppContext()
  const { menuOpen, setMenuOpen, currentPage } = useAppState()
  
  // Refs for elements
  const burgerRef = useRef(null)
  const navLinksRef = useRef(null)
  const menuContainerRef = useRef(null)
  const clockRef = useRef(null)
  const cityRef = useRef(null)
  const hourRef = useRef(null)
  const minuteRef = useRef(null)
  const ampmRef = useRef(null)
  const logoRef = useRef(null)
  
  // State for time
  const [time, setTime] = useState(() => {
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    return {
      hours: hours > 12 ? hours - 12 : hours === 0 ? 12 : hours,
      minutes: minutes < 10 ? `0${minutes}` : minutes,
      ampm: hours >= 12 ? 'PM' : 'AM'
    }
  })
  
  // References for animations and timers
  const timeIntervalRef = useRef(null)
  const textSplitsRef = useRef({})
  const animationsRef = useRef({})
  const timelineRef = useRef(null)
  
  // Toggle menu state
  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }
  
  // Handle menu animations
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!burgerRef.current || !menuContainerRef.current) return
    
    const burgerLines = burgerRef.current.querySelectorAll('.line')
    
    if (menuOpen) {
      // Menu opening animation
      gsap.to(burgerLines[0], { 
        rotation: 45, 
        y: 7, 
        duration: 0.3, 
        ease: 'power2.out' 
      })
      
      gsap.to(burgerLines[1], { 
        opacity: 0, 
        duration: 0.2 
      })
      
      gsap.to(burgerLines[2], { 
        rotation: -45, 
        y: -7, 
        duration: 0.3, 
        ease: 'power2.out' 
      })
      
      // Show menu container
      gsap.to(menuContainerRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out'
      })
      
      // Animate menu links
      const menuLinks = menuContainerRef.current.querySelectorAll('a')
      gsap.fromTo(
        menuLinks,
        { y: 20, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          stagger: 0.05, 
          duration: 0.4, 
          ease: 'power2.out',
          delay: 0.1
        }
      )
      
      // Add class to body for full-screen menu styling
      document.body.classList.add('menu-open')
      
    } else {
      // Menu closing animation
      gsap.to(burgerLines[0], { 
        rotation: 0, 
        y: 0, 
        duration: 0.3, 
        ease: 'power2.in' 
      })
      
      gsap.to(burgerLines[1], { 
        opacity: 1, 
        duration: 0.3 
      })
      
      gsap.to(burgerLines[2], { 
        rotation: 0, 
        y: 0, 
        duration: 0.3, 
        ease: 'power2.in' 
      })
      
      // Hide menu container
      gsap.to(menuContainerRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in'
      })
      
      // Remove class from body
      document.body.classList.remove('menu-open')
    }
  }, [menuOpen])
  
  // Handle time updates
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    // Update the time every minute
    const updateTime = () => {
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()
      
      setTime({
        hours: hours > 12 ? hours - 12 : hours === 0 ? 12 : hours,
        minutes: minutes < 10 ? `0${minutes}` : minutes,
        ampm: hours >= 12 ? 'PM' : 'AM'
      })
    }
    
    // Initial update
    updateTime()
    
    // Set interval to update every minute
    const intervalId = setInterval(() => {
      updateTime()
    }, 60000) // Check every minute
    
    timeIntervalRef.current = intervalId
    
    return () => {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current)
      }
    }
  }, [])
  
  // Handle text splitting for animations
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    // Wait for DOM to be ready
    const initializeSplitText = () => {
      const elementsToSplit = [
        { ref: cityRef, className: 'city' },
        { ref: hourRef, className: 'hour' },
        { ref: minuteRef, className: 'minute' },
        { ref: ampmRef, className: 'ampm' },
        { ref: logoRef, className: 'logo' }
      ]
      
      // Process each element
      elementsToSplit.forEach(({ ref, className }) => {
        if (ref.current) {
          try {
            const split = new SplitType(ref.current, { 
              types: 'chars',
              tagName: 'span'
            })
            
            // Store for cleanup
            textSplitsRef.current[className] = split
            
            // Add necessary wrapper for animation
            if (split.chars) {
              split.chars.forEach(char => {
                // Create wrapper span
                const wrapper = document.createElement('span')
                wrapper.classList.add('char-wrapper')
                
                // Create inner span for animation
                const inner = document.createElement('span')
                inner.classList.add('n')
                inner.textContent = char.textContent
                
                // Update DOM
                char.textContent = ''
                wrapper.appendChild(inner)
                char.appendChild(wrapper)
              })
            }
          } catch (error) {
            console.warn(`Failed to split text for ${className}:`, error)
          }
        }
      })
    }
    
    // Run after a small delay to ensure DOM is ready
    const timeout = setTimeout(() => {
      initializeSplitText()
    }, 100)
    
    return () => {
      clearTimeout(timeout)
      
      // Clean up split instances
      Object.values(textSplitsRef.current).forEach(split => {
        if (split && typeof split.revert === 'function') {
          split.revert()
        }
      })
    }
  }, [])
  // Initialize animations
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Show elements with initial animations
    const showElements = () => {
      // Create animation for the nav
      gsap.fromTo(
        navRef.current,
        { opacity: 0 },
        { 
          opacity: 1, 
          duration: 0.6, 
          ease: 'power2.out',
          onComplete: () => {
            // Animate clock elements
            const hourChars = hourRef.current?.querySelectorAll('.char .n') || []
            const minuteChars = minuteRef.current?.querySelectorAll('.char .n') || []
            const ampmChars = ampmRef.current?.querySelectorAll('.char .n') || []
            
            gsap.fromTo(
              [...hourChars, ...minuteChars, ...ampmChars],
              { y: 10, opacity: 0 },
              { 
                y: 0, 
                opacity: 1, 
                stagger: 0.02, 
                duration: 0.4, 
                ease: 'power2.out' 
              }
            )
          }
        }
      )
    }

    // Run animations after a small delay
    const timeout = setTimeout(showElements, 200)
    
    return () => clearTimeout(timeout)
  }, [])

  // Handle link hover animations
  const handleLinkHover = (event) => {
    const target = event.currentTarget
    const chars = target.querySelectorAll('.char .n')
    
    if (chars && chars.length) {
      gsap.to(chars, {
        y: -3,
        stagger: 0.02,
        duration: 0.2,
        ease: 'power2.out'
      })
    }
  }
  
  const handleLinkHoverExit = (event) => {
    const target = event.currentTarget
    const chars = target.querySelectorAll('.char .n')
    
    if (chars && chars.length) {
      gsap.to(chars, {
        y: 0,
        stagger: 0.01,
        duration: 0.2,
        ease: 'power2.in'
      })
    }
  }

  return (
    <nav ref={navRef} className="nav" aria-label="Main navigation">
      {/* Logo */}
      <div className="nav_logo">
        <Link href="/" ref={logoRef} className="logo" onMouseEnter={handleLinkHover} onMouseLeave={handleLinkHoverExit}>
          NextGL
        </Link>
      </div>
      
      {/* Clock Display */}
      <div className="nav_clock" ref={clockRef}>
        <div className="nav_clock_city">
          <p ref={cityRef} className="nav_clock_p">New York</p>
        </div>
        <div className="nav_clock_time">
          <span ref={hourRef} className="nav_clock_h">{time.hours}</span>
          <span className="nav_clock_divider">:</span>
          <span ref={minuteRef} className="nav_clock_m">{time.minutes}</span>
          <span ref={ampmRef} className="nav_clock_a">{time.ampm}</span>
        </div>
      </div>
      
      {/* Top Navigation Links */}
      <div className="nav_right" ref={navLinksRef}>
        <Link 
          href="/about" 
          className={currentPage === 'about' ? 'active' : ''}
          onMouseEnter={handleLinkHover}
          onMouseLeave={handleLinkHoverExit}
        >
          About
        </Link>
        <Link 
          href="/projects" 
          className={currentPage === 'projects' ? 'active' : ''}
          onMouseEnter={handleLinkHover}
          onMouseLeave={handleLinkHoverExit}
        >
          Projects
        </Link>
        <Link 
          href="/playground" 
          className={currentPage === 'playground' ? 'active' : ''}
          onMouseEnter={handleLinkHover}
          onMouseLeave={handleLinkHoverExit}
        >
          Playground
        </Link>
      </div>
      
      {/* Burger Menu Button */}
      <button 
        ref={burgerRef} 
        className={`nav_burger ${menuOpen ? 'active' : ''}`}
        onClick={toggleMenu}
        aria-expanded={menuOpen}
        aria-controls="menu-container"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
      >
        <span className="line"></span>
        <span className="line"></span>
        <span className="line"></span>
      </button>
      
      {/* Full-screen Menu Container */}
      <div 
        id="menu-container"
        ref={menuContainerRef} 
        className={`menu-container ${menuOpen ? 'active' : ''}`}
        aria-hidden={!menuOpen}
      >
        <div className="menu-content">
          <ul className="menu-links">
            <li>
              <Link 
                href="/"
                onClick={() => setMenuOpen(false)}
                className={currentPage === 'home' ? 'active' : ''}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                href="/about"
                onClick={() => setMenuOpen(false)}
                className={currentPage === 'about' ? 'active' : ''}
              >
                About
              </Link>
            </li>
            <li>
              <Link 
                href="/projects"
                onClick={() => setMenuOpen(false)}
                className={currentPage === 'projects' ? 'active' : ''}
              >
                Projects
              </Link>
            </li>
            <li>
              <Link 
                href="/playground"
                onClick={() => setMenuOpen(false)}
                className={currentPage === 'playground' ? 'active' : ''}
              >
                Playground
              </Link>
            </li>
            <li>
              <Link 
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className={currentPage === 'contact' ? 'active' : ''}
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
