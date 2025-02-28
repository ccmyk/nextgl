"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function LoaderComponent({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const loaderRef = useRef(null);
  const bgRef = useRef(null);
  const contentRef = useRef(null);
  const numberRef = useRef(null);
  const timelineRef = useRef(null);
  const animationObj = useRef({ num: 0 });

  // Initialize animation
  useEffect(() => {
    if (!loaderRef.current) return;

    // Create GSAP timeline
    timelineRef.current = gsap.timeline({ paused: true })
      .fromTo(
        animationObj.current,
        { num: 0 },
        {
          num: 42,
          ease: "none",
          duration: 2,
          onUpdate: updateNumber,
        },
        0
      )
      .to(
        animationObj.current,
        {
          num: 90,
          ease: "power2.inOut",
          duration: 8,
          onUpdate: updateNumber,
        },
        2.2
      );

    // Initialize text animations
    const animatedElements = loaderRef.current.querySelectorAll('.Awrite');
    animatedElements.forEach(element => {
      initializeTextAnimation(element);
    });

    // Start the animation
    startAnimation();

    // Cleanup function
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  // Update the number display
  const updateNumber = () => {
    if (numberRef.current) {
      const num = animationObj.current.num.toFixed(0).padStart(3, '0');
      numberRef.current.innerHTML = num;
      setProgress(animationObj.current.num);
    }
  };

  // Initialize text animation for an element
  const initializeTextAnimation = (element) => {
    // This would dispatch custom animation events in the original code
    // Here we'll use GSAP directly
    gsap.set(element, { opacity: 0 });
  };

  // Start the animation sequence
  const startAnimation = () => {
    const animatedElements = loaderRef.current.querySelectorAll('.Awrite');
    animatedElements.forEach(element => {
      triggerTextAnimation(element);
    });
    
    if (timelineRef.current) {
      timelineRef.current.play();
    }
  };

  // Trigger text animation for an element
  const triggerTextAnimation = (element) => {
    gsap.to(element, { 
      opacity: 1, 
      duration: 0.8, 
      ease: "power2.out",
      stagger: 0.05
    });
  };

  // Complete the loading sequence
  const completeLoading = () => {
    if (timelineRef.current) {
      timelineRef.current.pause();
      
      gsap.to(animationObj.current, {
        num: 100,
        ease: "power2.inOut",
        duration: 0.49,
        onUpdate: updateNumber,
        onComplete: () => {
          gsap.to(loaderRef.current, {
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: () => {
              if (onComplete) onComplete();
            }
          });
        }
      });
    }
  };

  // Expose the complete method to parent components
  useEffect(() => {
    // Simulate completion after 5 seconds for testing
    const timer = setTimeout(() => {
      completeLoading();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="loader" ref={loaderRef}>
      <div className="loader_bg" ref={bgRef}></div>
      <div className="loader_cnt" ref={contentRef}>
        <div className="loader_tp" ref={numberRef}>000</div>
        <div className="Awrite">Loading Experience</div>
      </div>
    </div>
  );
}