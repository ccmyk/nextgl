"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Footer() {
  const footerRef = useRef(null);
  const titleRef = useRef(null);
  const linksRef = useRef(null);
  const copyrightRef = useRef(null);
  const contactRef = useRef(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (!footerRef.current) return;

    // Animate footer title when it enters viewport
    const titleAnimation = gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top bottom-=100",
          toggleActions: "play none none none"
        }
      }
    );

    // Animate footer links
    const linksAnimation = gsap.fromTo(
      linksRef.current.querySelectorAll('.Awrite'),
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: linksRef.current,
          start: "top bottom-=50",
          toggleActions: "play none none none"
        }
      }
    );

    // Animate copyright and contact sections
    [copyrightRef, contactRef].forEach((ref, index) => {
      gsap.fromTo(
        ref.current.querySelectorAll('.Awrite'),
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.6,
          delay: 0.3 + (index * 0.2),
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom-=30",
            toggleActions: "play none none none"
          }
        }
      );
    });

    // Cleanup
    return () => {
      if (titleAnimation.scrollTrigger) {
        titleAnimation.scrollTrigger.kill();
      }
      if (linksAnimation.scrollTrigger) {
        linksAnimation.scrollTrigger.kill();
      }
    };
  }, []);

  return (
    <footer className="footer" ref={footerRef}>
      <div className="footer_cm">
        <div className="Atitle" ref={titleRef}>
          <div className="cCover"></div>
          <canvas></canvas>
          <div className="ttj">Contact</div>
        </div>
      </div>
      
      <div className="c-vw-s">
        <div className="cnt">
          <div className="cnt_lk" ref={linksRef}>
            <div className="Awrite">
              <Link href="/projects">Projects</Link>
            </div>
            <div className="Awrite">
              <Link href="/about">About</Link>
            </div>
            <div className="Awrite">
              <Link href="/contact">Contact</Link>
            </div>
            <div className="Awrite">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <i>Twitter</i>
              </a>
            </div>
            <div className="Awrite">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <i>Instagram</i>
              </a>
            </div>
          </div>
          
          <div className="cnt_cr" ref={copyrightRef}>
            <div className="Awrite">&copy; {currentYear} Chris Hall</div>
            <div className="Awrite">All rights reserved</div>
          </div>
          
          <div className="cnt_cp" ref={contactRef}>
            <div className="Awrite">hello@chrishall.xyz</div>
          </div>
        </div>
      </div>
    </footer>
  );
}