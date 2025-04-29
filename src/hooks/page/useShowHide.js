// src/hooks/page/useShowHide.js

import { useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * Mimics legacy showhide.js: toggles classes on links/pages on navigation.
 */
export function useShowHide() {
  const router = useRouter();

  useEffect(() => {
    function handleHide() {
      // legacy added .hide to main containers
      document.querySelectorAll('.page-section').forEach(el =>
        el.classList.add('hide')
      );
    }
    function handleShow() {
      document.querySelectorAll('.page-section').forEach(el =>
        el.classList.remove('hide')
      );
    }

    router.events.on('routeChangeStart', handleHide);
    router.events.on('routeChangeComplete', handleShow);

    return () => {
      router.events.off('routeChangeStart', handleHide);
      router.events.off('routeChangeComplete', handleShow);
    };
  }, [router]);
}