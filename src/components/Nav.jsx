"use client";

import { useEffect, useRef } from "react";

export default function Nav({ main, temp }) {
  const isOpenRef = useRef(0);
  const DOMRef = useRef({
    el: null,
    burger: null,
    els: null,
    city: null,
    c: null,
    h: null,
    m: null,
    a: null
  });
  const timeRef = useRef(0);
  const clockactRef = useRef(0);
  const mainRef = useRef(main);
  const elsRef = useRef([]);

  // Equivalent to constructor and create()
  useEffect(() => {
    if (!temp || !mainRef.current) return;

    // Insert HTML template
    document.querySelector('body').insertAdjacentHTML('afterbegin', temp);

    // Get DOM elements
    const el = document.querySelector('.nav');
    if (!el) return;

    DOMRef.current = {
      el: el,
      burger: el.querySelector('.nav_burger'),
      els: el.querySelectorAll('.nav_right a'),
      city: el.querySelector('.nav_clock_p'),
      c: el.querySelector('.nav_logo'),
      h: el.querySelector('.nav_clock_h'),
      m: el.querySelector('.nav_clock_m'),
      a: el.querySelector('.nav_clock_a')
    };

    DOMRef.current.el.style.opacity = 0;
    
    const date = new Date();
    timeRef.current = performance.now();
    
    const h = date.getHours();
    const m = date.getMinutes();
    
    clockactRef.current = 0;

    // Initialize animations
    // LOGO
    mainRef.current.events.anim.detail.state = 0;
    mainRef.current.events.anim.detail.el = DOMRef.current.c;
    document.dispatchEvent(mainRef.current.events.anim);

    // CITY
    mainRef.current.events.anim.detail.state = 0;
    mainRef.current.events.anim.detail.el = DOMRef.current.city;
    document.dispatchEvent(mainRef.current.events.anim);

    // HOUR
    mainRef.current.events.anim.detail.state = 0;
    mainRef.current.events.anim.detail.el = DOMRef.current.h;
    document.dispatchEvent(mainRef.current.events.anim);
    
    // MINUTE
    mainRef.current.events.anim.detail.state = 0;
    mainRef.current.events.anim.detail.el = DOMRef.current.m;
    document.dispatchEvent(mainRef.current.events.anim);
    
    // AMPM
    mainRef.current.events.anim.detail.state = 0;
    mainRef.current.events.anim.detail.el = DOMRef.current.a;
    document.dispatchEvent(mainRef.current.events.anim);

    // Set initial time
    searchAMPM();
    setTime(h, m);
    initEvents();

    // Cleanup on unmount
    return () => {
      if (DOMRef.current.el) {
        DOMRef.current.el.remove();
      }
    };
  }, [temp, main]);

  // Update time on interval
  useEffect(() => {
    const intervalId = setInterval(() => {
      update(performance.now());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const setTime = (hour = null, minute = null) => {
    if (!DOMRef.current.m || !DOMRef.current.m.querySelectorAll) return;

    let m = minute;
    if (minute == null) {
      const chars = DOMRef.current.m.querySelectorAll('.char');
      if (!chars || chars.length < 2) return;
      
      m = parseInt(
        chars[0].querySelector('.n').innerHTML + 
        chars[1].querySelector('.n').innerHTML
      );
      m++;
      
      const mi = new Date().getMinutes();
      if (mi != m) {
        m = mi;
      }
    }

    let h = hour;
    
    if (hour == null || m == 60) {
      searchAMPM();
      
      if (m == 60 && minute == null) {
        m = 0;
      }
    }

    if (m < 10) {
      m = '0' + m;
    }
    
    m = m.toString();

    const mChars = DOMRef.current.m.querySelectorAll('.char');
    if (mChars && mChars.length >= 2) {
      mChars[0].querySelector('.n').classList.add('eee1');
      mChars[0].querySelector('.n').innerHTML = m[0];
      mChars[1].querySelector('.n').innerHTML = m[1];

      if (clockactRef.current == 1) {
        mainRef.current.events.anim.detail.state = 1;
        mainRef.current.events.anim.detail.el = DOMRef.current.m;
        document.dispatchEvent(mainRef.current.events.anim);
      }
    }
  };

  const searchAMPM = (h = null) => {
    if (!DOMRef.current.a || !DOMRef.current.h) return;

    if (h == null) {
      const date = new Date();
      h = date.getHours();
    }
    
    const aChars = DOMRef.current.a.querySelectorAll('.char');
    if (!aChars || aChars.length < 2) return;
    
    if (h >= 12) {
      aChars[1].querySelector('.n').innerHTML = 'M';
      if (h > 12) {
        h = h - 12;
        aChars[0].querySelector('.n').innerHTML = 'P';
      }
    } else {
      aChars[0].querySelector('.n').innerHTML = 'A';
    }

    if (h < 10) {
      h = '0' + h;
    }

    const hChars = DOMRef.current.h.querySelectorAll('.char');
    if (!hChars || hChars.length < 2) return;

    const actualh = parseInt(
      hChars[0].querySelector('.n').innerHTML + 
      hChars[1].querySelector('.n').innerHTML
    );

    hChars[0].querySelector('.n').innerHTML = h.toString()[0];
    hChars[1].querySelector('.n').innerHTML = h.toString()[1];

    if (h == actualh) {
      return h;
    }

    if (clockactRef.current == 1) {
      mainRef.current.events.anim.detail.state = 1;
      mainRef.current.events.anim.detail.el = DOMRef.current.h;
      document.dispatchEvent(mainRef.current.events.anim);
    }

    return h;
  };

  const openMenu = () => {
    document.documentElement.classList.add('act-menu');
    document.dispatchEvent(mainRef.current.events.openmenu);
  };

  const closeMenu = () => {
    document.documentElement.classList.remove('act-menu');
    document.dispatchEvent(mainRef.current.events.closemenu);
  };

  const show = () => {
    if (!DOMRef.current.el) return;

    DOMRef.current.el.style.opacity = 1;

    mainRef.current.events.anim.detail.state = 1;
    mainRef.current.events.anim.detail.el = DOMRef.current.c;
    document.dispatchEvent(mainRef.current.events.anim);

    DOMRef.current.c.onmouseenter = () => {
      mainRef.current.events.anim.detail.state = 1;
      mainRef.current.events.anim.detail.el = DOMRef.current.c;
      document.dispatchEvent(mainRef.current.events.anim);
    };

    const clockS = DOMRef.current.el.querySelector('.nav_clock_s');
    if (clockS) {
      clockS.style.opacity = 1;
    }

    mainRef.current.events.anim.detail.state = 1;
    mainRef.current.events.anim.detail.el = DOMRef.current.city;
    document.dispatchEvent(mainRef.current.events.anim);

    mainRef.current.events.anim.detail.state = 1;
    mainRef.current.events.anim.detail.el = DOMRef.current.h;
    document.dispatchEvent(mainRef.current.events.anim);

    mainRef.current.events.anim.detail.state = 1;
    mainRef.current.events.anim.detail.el = DOMRef.current.m;
    document.dispatchEvent(mainRef.current.events.anim);

    mainRef.current.events.anim.detail.state = 1;
    mainRef.current.events.anim.detail.el = DOMRef.current.a;
    document.dispatchEvent(mainRef.current.events.anim);

    for (let i = 0; i < DOMRef.current.els.length; i++) {
      const a = DOMRef.current.els[i];

      mainRef.current.events.anim.detail.el = a;
      mainRef.current.events.anim.detail.state = 0;
      document.dispatchEvent(mainRef.current.events.anim);
      mainRef.current.events.anim.detail.state = 1;
      document.dispatchEvent(mainRef.current.events.anim);

      a.onmouseenter = () => {
        mainRef.current.events.anim.detail.el = a;
        mainRef.current.events.anim.detail.state = 1;
        document.dispatchEvent(mainRef.current.events.anim);
      };
    }

    clockactRef.current = 1;
  };

  const hide = () => {
    if (DOMRef.current.el) {
      DOMRef.current.el.style.opacity = 0;
    }
  };

  const initEvents = () => {
    if (DOMRef.current.burger) {
      DOMRef.current.burger.onclick = () => {
        if (isOpenRef.current == 1) {
          closeMenu();
          isOpenRef.current = 0;
        } else {
          openMenu();
          isOpenRef.current = 1;
        }
      };
    }
    
    if (DOMRef.current.els) {
      elsRef.current = [];
      // Original code had WriteHover initialization here
      // for(let [i,a] of this.DOM.els.entries()){
      //   this.els.push(new WriteHover(a))
      // }
    }
  };

  const update = (time) => {
    if (timeRef.current + 60010 <= time) {
      timeRef.current = time;
      setTime();
    }
  };

  // Expose methods to parent component
  useEffect(() => {
    if (!mainRef.current) return;
    
    // Attach methods to the main object if needed
    if (mainRef.current.nav) {
      mainRef.current.nav = {
        show,
        hide,
        openMenu,
        closeMenu,
        setTime,
        searchAMPM,
        update
      };
    }
    
    // Auto-show for demo purposes (remove in production)
    const showTimer = setTimeout(() => {
      show();
    }, 500);
    
    return () => {
      clearTimeout(showTimer);
    };
  }, [main]);

  // The component doesn't render anything itself since the HTML is injected directly
  return null;
}
