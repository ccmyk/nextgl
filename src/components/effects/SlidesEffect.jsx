'use client';

import React, { useEffect, useRef } from 'react';
import { useWebGLEffects } from '@/components/WebGLEffectsManager';

// Import shaders
import SlF from '@/components/gl/\uD83C\uDF9E\uFE0F/\uD83E\uDDEAmain.glsl?raw';
import SlV from '@/components/gl/\uD83C\uDF9E\uFE0F/\uD83E\uDE7Bmain.glsl?raw';
import SlPF from '@/components/gl/\uD83C\uDF9E\uFE0F/\uD83E\uDDEAparent.glsl?raw';

export default function SlidesEffect({ 
  children, 
  className = '',
  index = 0,
  onInit = () => {} 
}) {
  const { effects, isLoaded } = useWebGLEffects();
  const containerRef = useRef(null);
  
  // If effects are not loaded yet, render just the children
  if (!isLoaded || !effects.Slides) {
    return (
      <div className={`slides-container ${className}`}>
        {children}
      </div>
    );
  }
  
  // Handle initialization
  const handleInit = (effect) => {
    // Set data attributes needed by the effect
    if (containerRef.current) {
      containerRef.current.dataset.ids = index;
    }
    
    // Call user's onInit callback
    onInit(effect);
  };
  
  return (
    <OGLEffect
      effectClass={effects.Slides.base}
      effectName="Slides"
      className={`slides-container ${className}`}
      shaders={{
        fragment: SlF,
        vertex: SlV,
        parentFragment: SlPF
      }}
      onInit={handleInit}
      ref={containerRef}
    >
      {children}
      <div className="single" data-ids={index} style={{ opacity: 0 }}></div>
    </OGLEffect>
  );
}
