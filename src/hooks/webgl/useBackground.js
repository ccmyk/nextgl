'use client';

import { useEffect } from 'react';
import { useWebGL } from '@/webgl/core/WebGLContext';
import Background from '@/webgl/components/Background';

export function useBackground() {
  const { webgl } = useWebGL();

  useEffect(() => {
    // create, start and auto-cleanup on unmount
    const instance = new Background({
      gl:       webgl.gl,
      renderer: webgl.renderer,
      scene:    webgl.scene,
      camera:   webgl.camera,
    });
    instance.start();
    return () => {
      instance.destroy();
    };
  }, [webgl]);
}

export default useBackground;