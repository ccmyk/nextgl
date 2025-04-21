'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { useWebGL } from '@/context/WebGLContext'
import TitleEffect from '@/components/webgl/Title/TitleEffect'
import SplitType from 'split-type'
import gsap from 'gsap'

function NavLink({ href, children, isActive, onMouseEnter, onMouseLeave }) {
  const linkRef = useRef(null)
  const charsRef = useRef(null)

  useEffect(() => {
    if (!linkRef.current) return

    // Use SplitType through ref instead of direct DOM manipulation
    charsRef.current = new SplitType(linkRef.current, {
      types: 'chars',
      tagName: 'span'
    })

    return () => charsRef.current?.revert()
  }, [])

  return (
    <Link 
      href={href}
      ref={linkRef}
      className={isActive ? 'active' : ''}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </Link>
  )
}

function Clock({ time }) {
  const { hours, minutes, ampm } = time
  const clockRef = useRef(null)

  return (
    <TitleEffect>
      <div className="nav_clock" ref={clockRef}>
        <div className="nav_clock_city">
          <p className="nav_clock_p">New York</p>
        </div>
        <div className="nav_clock_time">
          <span className="nav_clock_h">{hours}</span>
          <span className="nav_clock_divider">:</span>
          <span className="nav_clock_m">{minutes}</span>
          <span className="nav_clock_a">{ampm}</span>
        </div>
      </div>
    </TitleEffect>
  )
}

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [time, setTime] = useState(() => {
    const now = new Date()
    const hours = now.getHours()
    return {
      hours: hours > 12 ? hours - 12 : hours === 0 ? 12 : hours,
      minutes: now.getMinutes().toString().padStart(2, '0'),
      ampm: hours >= 12 ? 'PM' : 'AM'
    }
  })

  const navRef = useRef(null)
  const menuRef = useRef(null)
  const { camera } = useWebGL()

  // Menu animation with exact legacy timing
  const toggleMenu = () => {
    if (!menuRef.current) return

    if (!menuOpen) {
      gsap.timeline()
        .set({}, {}, '<') // Start at the same time
        .to(menuRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: 'power4.inOut',
          onStart: () => {
            // Use React state instead of classList
            setMenuOpen(true)
          }
        })
    } else {
      gsap.timeline()
        .to(menuRef.current, {
          y: -20,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.inOut',
          onComplete: () => {
            setMenuOpen(false)
          }
        })
    }
  }

  // Update clock with same interval as legacy
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = now.getHours()
      setTime({
        hours: hours > 12 ? hours - 12 : hours === 0 ? 12 : hours,
        minutes: now.getMinutes().toString().padStart(2, '0'),
        ampm: hours >= 12 ? 'PM' : 'AM'
      })
    }

    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <nav 
      ref={navRef} 
      className={`nav ${menuOpen ? 'menu-open' : ''}`}
      data-device={camera?.aspect < 1 ? 'portrait' : 'landscape'}
    >
      <TitleEffect>
        <div className="nav_logo">
          <NavLink href="/">
            NextGL
          </NavLink>
        </div>
      </TitleEffect>

      <Clock time={time} />

      <div className="nav_right">
        <NavLink href="/about">About</NavLink>
        <NavLink href="/projects">Projects</NavLink>
        <NavLink href="/playground">Playground</NavLink>
      </div>

      <button 
        className={`nav_burger ${menuOpen ? 'active' : ''}`}
        onClick={toggleMenu}
        aria-expanded={menuOpen}
      >
        <span className="line"></span>
        <span className="line"></span>
        <span className="line"></span>
      </button>

      <div 
        ref={menuRef}
        className={`menu-container ${menuOpen ? 'active' : ''}`}
      >
        <div className="menu-content">
          <ul className="menu-links">
            {[
              ['/', 'Home'],
              ['/about', 'About'],
              ['/projects', 'Projects'],
              ['/playground', 'Playground']
            ].map(([href, text]) => (
              <li key={href}>
                <NavLink 
                  href={href}
                  onMouseEnter={(e) => {
                    // Character animation using the same timing
                    gsap.to(e.currentTarget.querySelectorAll('.char .n'), {
                      y: -3,
                      stagger: 0.02,
                      duration: 0.2,
                      ease: 'power4.inOut'
                    })
                  }}
                  onMouseLeave={(e) => {
                    gsap.to(e.currentTarget.querySelectorAll('.char .n'), {
                      y: 0,
                      stagger: 0.01,
                      duration: 0.2,
                      ease: 'power4.inOut'
                    })
                  }}
                >
                  {text}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}
