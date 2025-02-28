"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAnimation } from "@/contexts/AnimationContext";
import gsap from "gsap";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState({ hour: "00", minute: "00", ampm: "AM" });
  const navRef = useRef(null);
  const blurRef = useRef(null);
  const logoRef = useRef(null);
  const clockHourRef = useRef(null);
  const clockMinuteRef = useRef(null);
  const clockAmPmRef = useRef(null);
  const clockCityRef = useRef(null);
  const clockSeparatorRef = useRef(null);
  const navLinksRef = useRef(null);
  const { animateText, animateFade, animateBlur } = useAnimation();

  // Initialize navigation
  useEffect(() => {
    // Set initial time
    updateTime();
    
    // Start time interval
    const timeInterval = setInterval(updateTime, 60000); // Update every minute
    
    // Animate in navigation
    const navAnimation = gsap.timeline();
    
    navAnimation.fromTo(
      navRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: "power2.out" },
      0
    );
    
    // Animate logo and clock elements with text scrambling effect
    setTimeout(() => {
      animateText(logoRef.current, 0);
      animateText(clockCityRef.current, 0);
      animateText(clockHourRef.current, 0);
      animateText(clockMinuteRef.current, 0);
      animateText(clockAmPmRef.current, 0);
      
      // Show clock separator
      if (clockSeparatorRef.current) {
        clockSeparatorRef.current.style.opacity = 1;
      }
    }, 100);
    
    // Cleanup
    return () => {
      clearInterval(timeInterval);
    };
  }, [animateText]);
  
  // Update time
  const updateTime = () => {
    const date = new Date();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    
    // Convert to 12-hour format
    const displayHours = hours % 12 || 12;
    
    // Format with leading zeros
    const formattedHours = displayHours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    
    setCurrentTime({
      hour: formattedHours,
      minute: formattedMinutes,
      ampm
    });
    
    // Animate time change
    if (clockHourRef.current && clockMinuteRef.current && clockAmPmRef.current) {
      animateText(clockHourRef.current, 1);
      animateText(clockMinuteRef.current, 1);
      animateText(clockAmPmRef.current, 1);
    }
  };
  
  // Toggle navigation menu
  const toggleNav = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    
    // Animate blur background
    if (blurRef.current) {
      animateBlur(blurRef.current, newState);
    }
    
    // Animate navigation links
    const navLinks = navLinksRef.current?.querySelectorAll('a');
    
    if (navLinks) {
      gsap.to(navLinks, {
        opacity: newState ? 1 : 0,
        y: newState ? 0 : 20,
        duration: 0.4,
        stagger: 0.05,
        ease: "power2.out",
        pointerEvents: newState ? "auto" : "none"
      });
    }
  };

  return (
    <nav className="nav" ref={navRef} style={{ "--light": "#F8F6F2", "--gray": "#8A8A8A", "--dark": "#000" }}>
      <div className="nav_blur" ref={blurRef}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      
      <div className="nav_top">
        <div className="nav_left">
          <Link href="/" className="nav_logo Awrite" ref={logoRef}>
            <div className="word">
              <div className="char"><span className="f">&amp;</span><span className="f">@</span><span className="n">C</span></div>
              <div className="char"><span className="f">#</span><span className="f">&#x7D;</span><span className="n">H</span></div>
              <div className="char"><span className="f">]</span><span className="f">/</span><span className="n">R</span></div>
              <div className="char"><span className="f">€</span><span className="f">]</span><span className="n">I</span></div>
              <div className="char"><span className="f">+</span><span className="f">9</span><span className="n">S</span></div>
              <div className="char"><span className="f">=</span><span className="f">]</span><span className="n">H</span></div>
              <div className="char"><span className="f">)</span><span className="f">+</span><span className="n">A</span></div>
              <div className="char"><span className="f">$</span><span className="f">@</span><span className="n">L</span></div>
              <div className="char"><span className="f">+</span><span className="f">·</span><span className="n">L</span></div>
            </div>
          </Link>
          
          <div className="sep"></div>
          
          <div className="nav_clock">
            <div className="nav_clock_p Awrite" ref={clockCityRef}>
              <div className="word">
                <div className="char"><span className="f">(</span><span className="f">&amp;</span><span className="n">B</span></div>
                <div className="char"><span className="f">{'{'}</span><span className="f">@</span><span className="n">C</span></div>
                <div className="char"><span className="f">#</span><span className="f">/</span><span className="n">N</span></div>
              </div>
            </div>
            
            <div className="nav_clock_h Awrite" ref={clockHourRef}>
              <div className="word">
                <div className="char"><span className="f">&amp;</span><span className="f">|</span><span className="n">{currentTime.hour[0]}</span></div>
                <div className="char"><span className="f">|</span><span className="f">{'}'}</span><span className="n">{currentTime.hour[1]}</span></div>
              </div>
            </div>
            
            <div className="nav_clock_s" ref={clockSeparatorRef}>:</div>
            
            <div className="nav_clock_m Awrite" ref={clockMinuteRef}>
              <div className="word">
                <div className="char"><span className="f">·</span><span className="f">+</span><span className="n eee1">{currentTime.minute[0]}</span></div>
                <div className="char"><span className="f">0</span><span className="f">*</span><span className="n">{currentTime.minute[1]}</span></div>
              </div>
            </div>
            
            <div className="nav_clock_a Awrite" ref={clockAmPmRef}>
              <div className="word">
                <div className="char"><span className="f">%</span><span className="f">$</span><span className="n">{currentTime.ampm[0]}</span></div>
                <div className="char"><span className="f">&amp;</span><span className="f">+</span><span className="n">{currentTime.ampm[1]}</span></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="nav_right">
          <div className="nav_right_ops" ref={navLinksRef}>
            <Link href="/projects" className="Awrite">
              <div className="word">
                <div className="char"><span className="f">(</span><span className="f">&amp;</span><span className="n">P</span></div>
                <div className="char"><span className="f">+</span><span className="f">+</span><span className="n">R</span></div>
                <div className="char"><span className="f">#</span><span className="f">#</span><span className="n">O</span></div>
                <div className="char"><span className="f">9</span><span className="f">0</span><span className="n">J</span></div>
                <div className="char"><span className="f">(</span><span className="f">+</span><span className="n">E</span></div>
                <div className="char"><span className="f">#</span><span className="f">+</span><span className="n">C</span></div>
                <div className="char"><span className="f">$</span><span className="f">0</span><span className="n">T</span></div>
                <div className="char"><span className="f">+</span><span className="f">*</span><span className="n">S</span></div>
              </div>
            </Link>
            
            <Link href="/about" className="Awrite">
              <div className="word">
                <div className="char"><span className="f">#</span><span className="f">+</span><span className="n">A</span></div>
                <div className="char"><span className="f">$</span><span className="f">0</span><span className="n">B</span></div>
                <div className="char"><span className="f">|</span><span className="f">+</span><span className="n">O</span></div>
                <div className="char"><span className="f">0</span><span className="f">)</span><span className="n">U</span></div>
                <div className="char"><span className="f">+</span><span className="f">/</span><span className="n">T</span></div>
              </div>
            </Link>
            
            <Link href="/contact" className="Awrite">
              <div className="word">
                <div className="char"><span className="f">·</span><span className="f">%</span><span className="n">C</span></div>
                <div className="char"><span className="f">=</span><span className="f">&#123;</span><span className="n">O</span></div>
                <div className="char"><span className="f">@</span><span className="f">+</span><span className="n">N</span></div>
                <div className="char"><span className="f">+</span><span className="f">@</span><span className="n">T</span></div>
                <div className="char"><span className="f">]</span><span className="f">#</span><span className="n">A</span></div>
                <div className="char"><span className="f">#</span><span className="f">$</span><span className="n">C</span></div>
                <div className="char"><span className="f">]</span><span className="f">#</span><span className="n">T</span></div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}