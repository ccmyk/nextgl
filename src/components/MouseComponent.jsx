"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function MouseComponent() {
  const [isVisible, setIsVisible] = useState(false);
  const [cursorType, setCursorType] = useState("default");
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);
  const cursorTextRef = useRef(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const targetPosition = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);

  // Initialize mouse cursor
  useEffect(() => {
    // Only show custom cursor on non-touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isTouchDevice) {
      return;
    }
    
    // Show cursor
    setIsVisible(true);
    
    // Add event listeners
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    
    // Add hover listeners to interactive elements
    addInteractiveListeners();
    
    // Start animation loop
    startAnimationLoop();
    
    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      removeInteractiveListeners();
      
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);
  
  // Handle mouse movement
  const handleMouseMove = (e) => {
    mousePosition.current = { x: e.clientX, y: e.clientY };
  };
  
  // Handle mouse down
  const handleMouseDown = () => {
    setCursorType("active");
  };
  
  // Handle mouse up
  const handleMouseUp = () => {
    setCursorType("default");
  };
  
  // Add listeners to interactive elements
  const addInteractiveListeners = () => {
    // Links
    document.querySelectorAll("a, button, [role='button'], input, select, textarea")
      .forEach(el => {
        el.addEventListener("mouseenter", () => handleElementEnter(el));
        el.addEventListener("mouseleave", handleElementLeave);
      });
  };
  
  // Remove listeners from interactive elements
  const removeInteractiveListeners = () => {
    document.querySelectorAll("a, button, [role='button'], input, select, textarea")
      .forEach(el => {
        el.removeEventListener("mouseenter", () => handleElementEnter(el));
        el.removeEventListener("mouseleave", handleElementLeave);
      });
  };
  
  // Handle element hover enter
  const handleElementEnter = (el) => {
    // Check for data attributes for custom cursor behavior
    const cursorText = el.dataset.cursorText;
    
    if (cursorText) {
      setCursorType("text");
      if (cursorTextRef.current) {
        cursorTextRef.current.textContent = cursorText;
      }
    } else {
      setCursorType("hover");
    }
  };
  
  // Handle element hover leave
  const handleElementLeave = () => {
    setCursorType("default");
    if (cursorTextRef.current) {
      cursorTextRef.current.textContent = "";
    }
  };
  
  // Animation loop for smooth cursor movement
  const startAnimationLoop = () => {
    const animate = () => {
      // Smooth interpolation
      targetPosition.current.x += (mousePosition.current.x - targetPosition.current.x) * 0.15;
      targetPosition.current.y += (mousePosition.current.y - targetPosition.current.y) * 0.15;
      
      // Apply transforms
      if (cursorRef.current && cursorDotRef.current) {
        gsap.set(cursorRef.current, {
          x: targetPosition.current.x,
          y: targetPosition.current.y
        });
        
        gsap.set(cursorDotRef.current, {
          x: mousePosition.current.x,
          y: mousePosition.current.y
        });
      }
      
      rafId.current = requestAnimationFrame(animate);
    };
    
    animate();
  };

  if (!isVisible) return null;

  return (
    <>
      <div 
        className={`cursor ${cursorType}`} 
        ref={cursorRef}
      >
        <div className="cursor_text" ref={cursorTextRef}></div>
      </div>
      <div 
        className="cursor_dot" 
        ref={cursorDotRef}
      ></div>
    </>
  );
}
