"use client";

import { useEffect, useRef, useState } from "react";
import { useAppContext } from "@/components/AppInitializer";
import { loadImages, loadVideos } from "@/lib/utils/pageLoads";
import gsap from "gsap";
import SplitType from "split-type";

export default function HomeIntro() {
  const appContext = useAppContext(); // Access shared app context
  const [isLoaded, setIsLoaded] = useState(false); // Track if the page is fully loaded
  const domRef = useRef({
    el: null,
    images: null,
    videos: null,
  });

  useEffect(() => {
    const initPage = async () => {
      try {
        const mainElement = document.querySelector("main");
        if (!mainElement) return;

        domRef.current.el = mainElement;

        // Load media (images and videos)
        await loadImages.call({ DOM: domRef.current });
        await loadVideos.call({ DOM: domRef.current });

        // Text animation
        const text = new SplitType(".home-intro", { types: "chars, words" });
        gsap.from(text.chars, {
          opacity: 0,
          y: 50,
          stagger: 0.05,
          duration: 1,
          ease: "power3.out",
        });

        setIsLoaded(true); // Mark as loaded after initialization
      } catch (error) {
        console.error("Error initializing home page:", error);
      }
    };

    initPage();
  }, []);

  return (
    <div className="home-intro">
      {!isLoaded && <div className="loading">Loading...</div>}
      <header>
        <h1 className="home-intro-title">Welcome to the Home Page</h1>
      </header>
    </div>
  );
}