// src/hooks/usePageTransition.js

'use client';

import { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { useLenis } from '@/context/LenisContext';
import { useWebGL } from '@/context/WebGLContext';
import { AppEventsContext } from '@/context/AppEventsContext';

/**
 * Replaces legacy pop.js. 
 * • Listens for back/forward (popstate) and routeChangeStart/Complete 
 * • Stops/starts Lenis
 * • Calls gl.cleanTemp() / gl.show()
 * • Disables pointer-events during transitions
 * • Emits “pageHide” / “pageShow” via AppEventsContext
 */
export function usePageTransition() {
  const router = useRouter();
  const lenis  = useLenis();
  const gl     = useWebGL();
  const { emit } = useContext(AppEventsContext);

  useEffect(() => {
    // 1. Handle browser back/forward
    function onPopState(e) {
      // Mirror legacy onPopState guard if needed:
      // if (loading) { e.preventDefault(); return; }
      router.back();
    }
    window.addEventListener('popstate', onPopState);

    // 2. Before Next.js starts changing route
    function onRouteStart(url) {
      // Prevent new interactions
      document.body.style.pointerEvents = 'none';
      // Stop smooth-scroll
      lenis.stop();
      // Clean any temp WebGL scene
      gl.cleanTemp?.();
      // Signal legacy code
      emit('pageHide');
    }

    // 3. After Next.js finishes changing route
    async function onRouteComplete(url) {
      // Scroll to top exactly as legacy did
      await lenis.scrollTo(0, { immediate: true, lock: true, force: true });
      // Re-enable interactions
      document.body.style.pointerEvents = '';
      // Restore WebGL scene
      gl.show?.();
      // Signal legacy code
      emit('pageShow');
      // Resume smooth-scroll
      lenis.start();
    }

    router.events.on('routeChangeStart', onRouteStart);
    router.events.on('routeChangeComplete', onRouteComplete);

    return () => {
      window.removeEventListener('popstate', onPopState);
      router.events.off('routeChangeStart', onRouteStart);
      router.events.off('routeChangeComplete', onRouteComplete);
    };
  }, [router, lenis, gl, emit]);
}