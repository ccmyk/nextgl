// src/lib/animations/useAnimations.js
"use client";
import { useEffect } from "react";
import gsap from "gsap";

export default function useAnimations() {
  useEffect(() => {
    const timeline = gsap.timeline({ paused: true });

    timeline
      .fromTo(".some-class", { opacity: 0 }, { opacity: 1, duration: 1 })
      .play();

    return () => timeline.kill();
  }, []);
}