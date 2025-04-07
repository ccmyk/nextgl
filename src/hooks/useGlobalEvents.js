// src/hooks/useGlobalEvents.js
'use client';

import { useEffect } from 'react';

/**
 * Binds all legacy global event listeners in a React-safe, modular way.
 * Fully refactored from legacy `events.js` logic.
 *
 * @param {object} refs - Object containing { mainRef, glRef, pageRef }
 */
export function useGlobalEvents({ mainRef, glRef, pageRef }) {
  useEffect(() => {
    if (!mainRef?.current) return;

    // -- Handlers (must be hoisted to remove properly) --
    const controlScroll = (state) => {
      mainRef?.current?.controlScroll?.(state);
    };

    const onStartScroll = () => controlScroll(1);
    const onStopScroll = () => controlScroll(0);
    const onNewLinks = () => mainRef?.current?.addLinks?.();
    const onOpenMenu = () => controlScroll(0);
    const onCloseMenu = () => controlScroll(1);

    const onScrollTo = (e) => {
      const id = e.target?.dataset?.goto;
      if (id && mainRef?.current?.lenis) {
        mainRef.current.lenis.scrollTo(`#${id}`, { offset: -100 });
      }
    };

    const onNextPrj = async (e) => {
      if (!mainRef?.current?.lenis || !pageRef?.current) return;
      const el = pageRef.current.DOM?.el?.querySelector('.project_nxt');
      if (!el) return;
      mainRef.current.lenis.stop();
      mainRef.current.lenis.scrollTo(el, { duration: 0.3, force: true });
      await window.waiter(300);

      mainRef.current?.onChange?.({
        url: e.detail?.url,
        link: e.detail?.el,
      });
    };

    const onAnim = async (e) => {
      const detail = e.detail;
      if (!detail?.el) return;

      if (detail.style === 0) {
        if (detail.el.classList.contains('nono')) return;
        mainRef.current?.writeFn?.(detail.el, detail.state);
      } else if (detail.style === 1) {
        if (mainRef?.current?.lenis && glRef?.current?.changeSlides) {
          mainRef.current.lenis.scrollTo(0);
          await window.waiter(600);
          controlScroll(0);
          await Promise.all([glRef.current.changeSlides(detail.state)]);
          controlScroll(1);
        }
      }
    };

    const onVisibilityChange = () => {
      if (mainRef?.current?.isload === 1) return;

      if (document.visibilityState === 'hidden') {
        mainRef.current?.lenis?.stop();
        cancelAnimationFrame(mainRef.current?.upid);
      } else {
        mainRef.current?.lenis?.start();
        mainRef.current?.update?.(performance.now());
      }
    };

    const onPopState = (e) => {
      mainRef.current?.onPopState?.(e);
    };

    const onResize = () => {
      mainRef.current?.onResize?.();
    };

    const resizeHandler = () => {
      clearTimeout(mainRef.current?.res);
      mainRef.current.res = setTimeout(onResize, 400);
    };

    // -- Add listeners --
    document.addEventListener('startscroll', onStartScroll);
    document.addEventListener('stopscroll', onStopScroll);
    document.addEventListener('newlinks', onNewLinks);
    document.addEventListener('scrollto', onScrollTo);
    document.addEventListener('openmenu', onOpenMenu);
    document.addEventListener('closemenu', onCloseMenu);
    document.addEventListener('nextprj', onNextPrj);
    document.addEventListener('anim', onAnim);
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('popstate', onPopState, { passive: true });
    window.addEventListener('resize', resizeHandler);

    // -- Orientationchange for touch devices --
    let orientationHandler = null;
    if (mainRef?.current?.isTouch) {
      orientationHandler = () => location.reload();
      window.addEventListener('orientationchange', orientationHandler);
    }

    // -- Cleanup --
    return () => {
      document.removeEventListener('startscroll', onStartScroll);
      document.removeEventListener('stopscroll', onStopScroll);
      document.removeEventListener('newlinks', onNewLinks);
      document.removeEventListener('scrollto', onScrollTo);
      document.removeEventListener('openmenu', onOpenMenu);
      document.removeEventListener('closemenu', onCloseMenu);
      document.removeEventListener('nextprj', onNextPrj);
      document.removeEventListener('anim', onAnim);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('resize', resizeHandler);
      if (orientationHandler) {
        window.removeEventListener('orientationchange', orientationHandler);
      }
    };
  }, [mainRef, glRef, pageRef]);
}