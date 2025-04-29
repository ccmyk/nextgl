// src/hooks/page/usePageController.js

import { useContext, useEffect } from 'react';
import { WebGLContext } from '@/context/WebGLContext';
import { AppEventsContext } from '@/context/AppEventsContext';

/**
 * Port of legacy pagemain.js: camera setup, view flags, pop logic.
 */
export function usePageController() {
  const { camera, scene } = useContext(WebGLContext);
  const { on, emit } = useContext(AppEventsContext);

  useEffect(() => {
    // legacy pagemain initial setup
    camera.position.set(0, 0, 5);
    scene.add(camera);

    // pop on pageShow
    const offShow = on('pageShow', () => {
      // replicate view pop animation
      camera.position.set(0, 0, 5); // or call manager.viewPop()
    });

    // cleanup
    return () => {
      offShow();
      // any other tear-down if necessary
    };
  }, [camera, scene, on]);
}