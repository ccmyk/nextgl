// src/lib/startup/useBrowser.js
import { useEffect, useState } from 'react';

export default function useBrowser() {
  const [browserInfo, setBrowserInfo] = useState({
    isTouch: false,
    webgl: false,
    deviceType: 'desktop',
    devNum: 0,
    supportsWebP: false,
    supportsWebM: false,
    autoplay: false,
  });

  useEffect(() => {
    function browserCheck() {
      if (window.history.scrollRestoration) {
        window.history.scrollRestoration = 'manual';
      }

      // Detect touch devices
      const isTouch =
        /Mobi|Android|Tablet|iPad|iPhone/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

      const w = window.innerWidth;
      const h = window.innerHeight;

      let deviceType = 'desktop';
      let devNum = 0;

      if (!isTouch) {
        document.documentElement.classList.add('D');
        if (w > 1780) devNum = -1;
      } else {
        deviceType = 'mobile';
        devNum = 3;

        if (w > 767) {
          if (w > h) {
            deviceType = 'tabletL';
            devNum = 1;
          } else {
            deviceType = 'tabletS';
            devNum = 2;
          }
        }
        document.documentElement.classList.add('T', deviceType);
      }

      // WebGL Check
      let webgl = (() => {
        try {
          let canvas = document.createElement('canvas');
          return (
            !!window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
          );
        } catch (e) {
          return false;
        }
      })();

      // WebP Support
      let supportsWebP = (() => {
        let elem = document.createElement('canvas');
        return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      })();

      // WebM Support
      let ua = navigator.userAgent.toLowerCase();
      let supportsWebM = ua.includes('chrome') || !ua.includes('safari');

      // Video Autoplay Check
      let video = document.createElement('video');
      video.autoplay = true;
      video.muted = true;
      let autoplay = false;

      video.onplay = () => (autoplay = true);
      video.oncanplay = () => {
        video.pause();
        video.remove();
      };

      if (!isTouch) video.play();

      setBrowserInfo({
        isTouch,
        webgl,
        deviceType,
        devNum,
        supportsWebP,
        supportsWebM,
        autoplay,
      });
    }

    browserCheck();
  }, []);

  return browserInfo;
}
