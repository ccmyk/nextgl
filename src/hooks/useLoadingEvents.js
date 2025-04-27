// src/hooks/useLoadingEvents.js

import { useContext, useEffect } from 'react';
import { AppEventsContext } from '@/context/AppEventsContext';

export function useLoadingEvents({ onDomReady, onGlReady } = {}) {
  const { on, emit } = useContext(AppEventsContext);

  useEffect(() => {
    // Emit domReady when window load fires
    function handleDomLoad() {
      emit('domReady');
    }

    if (document.readyState === 'complete') {
      emit('domReady');
    } else {
      window.addEventListener('load', handleDomLoad);
    }

    // Subscribe to events
    const cleanupDom = on('domReady', onDomReady);
    const cleanupGl  = on('glReady', onGlReady);

    return () => {
      window.removeEventListener('load', handleDomLoad);
      cleanupDom();
      cleanupGl();
    };
  }, [onDomReady, onGlReady, on, emit]);
}
