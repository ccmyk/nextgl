'use client';

import { useEffect } from 'react';
import TextAnimation from './TextAnimation';
import { initScrollAnimations } from '@/lib/animations/scrollAnimations';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import useTextAnimation from '@/hooks/useTextAnimation';

/**
 * Example component showcasing various animation techniques
 */
export default function AnimationExample() {
  // Initialize smooth scrolling
  const { lenis } = useSmoothScroll();
  
  // Example of using the hook directly
  const { ref: writeRef, className: writeClass } = useTextAnimation({
    type: 'write',
    params: '0.5,3'
  });
  
  // Initialize scroll animations when lenis is ready
  useEffect(() => {
    if (lenis) {
      initScrollAnimations(document, lenis);
    }
  }, [lenis]);
  
  return (
    <div className="animation-examples">
      <section className="section">
        <h2>Text Animation Examples</h2>
        
        <div className="example-grid">
          {/* Text animation - splits into lines */}
          <div className="example-item">
            <h3>Text Animation (Lines)</h3>
            <TextAnimation type="text">
              This text will be split into lines and animated with a staggered effect.
              Each line will animate independently.
            </TextAnimation>
          </div>
          
          {/* Line animation */}
          <div className="example-item">
            <h3>Line Animation</h3>
            <TextAnimation type="line">
              This animation treats the entire text as a single line element.
            </TextAnimation>
          </div>
          
          {/* Character animation */}
          <div className="example-item">
            <h3>Character Animation</h3>
            <TextAnimation type="write">
              This text animates each character with a typewriter-like effect.
            </TextAnimation>
          </div>
          
          {/* Custom timing parameters */}
          <div className="example-item">
            <h3>Custom Timing</h3>
            <TextAnimation type="write" params="0.5,3">
              This animation has custom timing parameters.
            </TextAnimation>
          </div>
          
          {/* Auto-playing animation */}
          <div className="example-item">
            <h3>Auto-Play Animation</h3>
            <TextAnimation type="write" autoPlay>
              This animation plays automatically on mount.
            </TextAnimation>
          </div>
          
          {/* Looping animation */}
          <div className="example-item">
            <h3>Looping Animation</h3>
            <TextAnimation type="write" bucle>
              This animation will loop when scrolling in and out of view.
            </TextAnimation>
          </div>
          
          {/* Using the hook directly */}
          <div className="example-item">
            <h3>Using Hook Directly</h3>
            <div ref={writeRef} className={writeClass}>
              This animation uses the hook directly instead of the component.
            </div>
          </div>
        </div>
      </section>
      
      <section className="section">
        <h2>Scroll Animation Examples</h2>
        
        <div className="example-grid">
          {/* Parallax effect */}
          <div className="example-item" data-scroll="parallax" data-speed="0.5">
            <h3>Parallax Effect</h3>
            <p>This element moves at a different speed than the scroll.</p>
          </div>
          
          {/* Reveal animation */}
          <div className="example-item" data-scroll="reveal" data-y="50" data-duration="1">
            <h3>Reveal Animation</h3>
            <p>This element fades in when scrolled into view.</p>
          </div>
          
          {/* Reveal with children */}
          <div className="example-item" data-scroll="reveal" data-children=".reveal-item" data-stagger="0.1">
            <h3>Staggered Children</h3>
            <p className="reveal-item">This is the first item.</p>
            <p className="reveal-item">This is the second item.</p>
            <p className="reveal-item">This is the third item.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
