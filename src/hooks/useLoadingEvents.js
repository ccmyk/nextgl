// src/hooks/useLoadingEvents.js

import { useContext, useEffect } from 'react';
import { AppEventsContext } from '@/context/AppEventsContext';

export function useLoadingEvents({ onDomReady, onGlReady } = {}) {
  const { on, emit } = useContext(AppEventsContext);

  useEffect(() => {
    // Fire domReady when window loads
    function handleLoad() { emit('domReady'); }
    if (document.readyState === 'complete') {
      emit('domReady');
    } else {
      window.addEventListener('load', handleLoad);
    }

    // Subscribe handlers
    const offDom = on('domReady', onDomReady);
    const offGl  = on('glReady',  onGlReady);

    return () => {
      window.removeEventListener('load', handleLoad);
      offDom(); offGl();
    };
  }, [onDomReady, onGlReady, on, emit]);
}