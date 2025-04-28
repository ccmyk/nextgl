import { useEffect, useRef } from 'react';
import SplitType from 'split-type';

export const useSplitText = (elementRef, options = {}) => {
  const splitInstance = useRef(null);
  
  useEffect(() => {
    if (!elementRef.current) return;
    
    // Split text
    splitInstance.current = new SplitType(elementRef.current, {
      types: options.types || 'chars,words'
    });
    
    // Process for animation if requested
    if (options.processChars) {
      const chars = elementRef.current.querySelectorAll('.char');
      const fakes = '##·$%&/=€|()@+09*+]}{[';
      
      chars.forEach(char => {
        // Add character structure
        const text = char.innerHTML;
        char.innerHTML = `<span class="n">${text}</span>`;
        
        // Add fake characters for animation
        for (let i = 0; i < (options.fakeCount || 2); i++) {
          const randIndex = Math.floor(Math.random() * fakes.length);
          const fakeChar = fakes[randIndex];
          char.insertAdjacentHTML('afterbegin', 
            `<span class="f" aria-hidden="true">${fakeChar}</span>`);
        }
      });
      
      // Set initial opacity
      if (elementRef.current) elementRef.current.style.opacity = '0';
    }
    
    return () => {
      if (splitInstance.current?.revert) {
        splitInstance.current.revert();
      }
    };
  }, [elementRef, options]);
  
  return splitInstance;
};