// src/components/interface/AnimatedText.jsx

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useSplitText } from '@/hooks/useSplitText';
import { useAnimation } from '@/context/AnimationContext';

export default function AnimatedText({ 
  children, 
  className = '', 
  type = 'char', // 'char', 'word', 'line' 
  delay = 0,
  duration = 0.6,
  stagger = 0.03,
  once = true,
  darkColor = '#000',
  lightColor = '#F8F6F2'
}) {
  const { ref, inView } = useInView({
    triggerOnce: once,
    threshold: 0.2
  });
  const { registerAnimation } = useAnimation();
  const [isAnimated, setIsAnimated] = useState(false);
  
  // Split text hook
  const splitRef = useSplitText(ref, {
    types: type === 'line' ? 'lines' : 'chars,words',
    processChars: type === 'char',
    fakeCount: 3
  });
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay
      }
    }
  };
  
  const itemVariants = {
    hidden: { 
      opacity: 0,
      y: type === 'line' ? 20 : 0,
      scaleX: type === 'word' ? 1.2 : 1
    },
    visible: { 
      opacity: 1,
      y: 0,
      scaleX: 1,
      transition: {
        duration,
        ease: [0.55, 0, 0.1, 1]
      }
    }
  };
  
  // Register with animation context for external control
  useEffect(() => {
    if (!ref.current) return;
    
    // Allow external control via animation context
    return registerAnimation(ref.current.id || `anim-${Math.random()}`, (state) => {
      if (state === 1) setIsAnimated(true);
      else if (state === 0) setIsAnimated(false);
    });
  }, [ref, registerAnimation]);
  
  return (
    <motion.div 
      ref={ref}
      className={`animated-text ${type} ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={(inView || isAnimated) ? "visible" : "hidden"}
      aria-label={typeof children === 'string' ? children : undefined}
    >
      {typeof children === 'string' ? children : children}
    </motion.div>
  );
}