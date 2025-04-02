// src/app/page.js
"use client";

import { useEffect, useState, useRef } from "react";
import { useAppContext } from "@/components/AppInitializer";
import HomeIntro from "@/components/HomeIntro";  // ✅ Import the new component
import { loadImages, loadVideos } from "@/lib/utils/pageLoads";
import { createIos, callIos, showIos } from "@/lib/utils/pageIos";
import * as ScrollUtils from "@/lib/utils/pageScroll";

export default function HomePage() {
  const appContext = useAppContext();
  const [isLoaded, setIsLoaded] = useState(false);
  const domRef = useRef({
    el: null,
    images: null,
    videos: null,
    ios: null,
  });

  useEffect(() => {
    const initPage = async () => {
      try {
        const mainElement = document.querySelector("main");
        if (!mainElement) return;

        domRef.current.el = mainElement;

        const { browserInfo } = appContext || {};
        const device = browserInfo?.device || 0;

        // Load media if WebGL is disabled
        await loadImages.call({ DOM: domRef.current });
        await loadVideos.call({ DOM: domRef.current });

        // Initialize Intersection Observers
        await createIos.call({
          DOM: domRef.current,
          iOpage: (animobj) => {
            if (animobj.el.classList.contains("iO-scroll")) {
              animobj.class = new ScrollUtils.Scroll(animobj, device);
            }
            return animobj;
          },
        });

        callIos.call({ DOM: domRef.current, isVisible: 1 });
        showIos.call({ DOM: domRef.current });

        setIsLoaded(true);
      } catch (error) {
        console.error("Error initializing home page:", error);
      }
    };

    initPage();
  }, [appContext]);

  return (
    <div className="home-container">
      {!isLoaded && <div className="loading">Loading home page...</div>}
      <HomeIntro />  {/* ✅ Include HomeIntro here */}
    </div>
  );
}