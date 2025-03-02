"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function LoaderComponent({ main, temp, device = 0, onComplete }) {
  const loaderRef = useRef(null);
  const counterRef = useRef(0);
  const indexRef = useRef(0);
  const tempRef = useRef({ init: temp, pop: temp });
  const deviceRef = useRef(device);
  const DOMRef = useRef({
    el: null,
    bg: null,
    cnt: null,
    n: null
  });
  const objRef = useRef({ num: 0 });
  const animRef = useRef(null);
  const mainRef = useRef(main);

  // Equivalent to constructor and create()
  useEffect(() => {
    if (!temp) return;
    
    // Insert HTML template
    document.querySelector('body').insertAdjacentHTML('afterbegin', tempRef.current.init);
    
    // Get DOM elements
    DOMRef.current.el = document.documentElement.querySelector('.loader');
    if (!DOMRef.current.el) return;
    
    DOMRef.current.bg = DOMRef.current.el.querySelector('.loader_bg');
    DOMRef.current.cnt = DOMRef.current.el.querySelector('.loader_cnt');
    DOMRef.current.n = DOMRef.current.el.querySelector('.loader_tp');
    
    // Create animations
    createAnim();
    
    // Cleanup on unmount
    return () => {
      if (DOMRef.current.el) {
        DOMRef.current.el.remove();
      }
    };
  }, [temp]);

  // Equivalent to createAnim()
  const createAnim = () => {
    objRef.current = { num: 0 };
    
    animRef.current = gsap.timeline({ paused: true })
      .fromTo(
        objRef.current,
        { num: 0 },
        {
          num: 42,
          ease: 'none',
          duration: 2,
          onUpdate: () => {
            let num = objRef.current.num.toFixed(0);
            calcNum(num);
          }
        },
        0
      )
      .to(
        objRef.current,
        {
          num: 90,
          ease: 'power2.inOut',
          duration: 8,
          onUpdate: () => {
            let num = objRef.current.num.toFixed(0);
            calcNum(num);
          }
        },
        2.2
      );

    // Handle text animations
    let aw = DOMRef.current.el.querySelectorAll('.Awrite');
    
    if (mainRef.current && mainRef.current.events && mainRef.current.events.anim) {
      // Initialize text animations using the main event system
      mainRef.current.events.anim.detail.state = 0;
      mainRef.current.events.anim.detail.el = aw[0];
      document.dispatchEvent(mainRef.current.events.anim);

      mainRef.current.events.anim.detail.state = 0;
      mainRef.current.events.anim.detail.el = aw[1];
      document.dispatchEvent(mainRef.current.events.anim);
    }
  };

  // Equivalent to calcNum()
  const calcNum = (num) => {
    if (!DOMRef.current.n) return;
    
    if (num < 10) {
      num = '00' + num;
    } else if (num < 100) {
      num = '0' + num;
    }
    
    DOMRef.current.n.innerHTML = num;
    counterRef.current = parseInt(num, 10);
  };

  // Equivalent to start()
  const start = () => {
    let aw = DOMRef.current.el.querySelectorAll('.Awrite');
    
    if (mainRef.current && mainRef.current.events && mainRef.current.events.anim) {
      // Trigger text animations using the main event system
      mainRef.current.events.anim.detail.state = 1;
      mainRef.current.events.anim.detail.el = aw[0];
      document.dispatchEvent(mainRef.current.events.anim);

      mainRef.current.events.anim.detail.state = 1;
      mainRef.current.events.anim.detail.el = aw[1];
      document.dispatchEvent(mainRef.current.events.anim);
    }
    
    if (animRef.current) {
      animRef.current.play();
    }
  };

  // Equivalent to showPop()
  const showPop = () => {
    if (deviceRef.current > 1) {
      // Implementation would go here
    }
  };

  // Equivalent to hidePop()
  const hidePop = () => {
    if (deviceRef.current > 1 && DOMRef.current.el) {
      DOMRef.current.el.remove();
    }
  };

  // Equivalent to hideIntro()
  const hideIntro = (template = '') => {
    if (!DOMRef.current.el || !animRef.current) return;
    
    animRef.current.pause();

    gsap.to(objRef.current, {
      num: 100,
      ease: 'power2.inOut',
      duration: 0.49,
      onUpdate: () => {
        let num = objRef.current.num.toFixed(0);
        calcNum(num);
      }
    });

    gsap.to(DOMRef.current.el, {
      opacity: 0,
      duration: 0.5,
      delay: 0.2,
      ease: 'power2.inOut',
      onComplete: () => {
        if (DOMRef.current.el) {
          DOMRef.current.el.remove();
        }
        if (onComplete) {
          onComplete();
        }
      }
    });
  };

  // Expose methods to parent component
  useEffect(() => {
    if (!mainRef.current) return;
    
    // Attach methods to the main object if needed
    if (mainRef.current.loader) {
      mainRef.current.loader = {
        start,
        hideIntro,
        showPop,
        hidePop
      };
    }
    
    // Auto-start for demo purposes (remove in production)
    const startTimer = setTimeout(() => {
      start();
    }, 500);
    
    const hideTimer = setTimeout(() => {
      hideIntro();
    }, 5000);
    
    return () => {
      clearTimeout(startTimer);
      clearTimeout(hideTimer);
    };
  }, [main]);

  // The component doesn't render anything itself since the HTML is injected directly
  return null;
}