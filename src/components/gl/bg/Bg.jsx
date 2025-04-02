// 🏜 src/components/gl/bg/Bg.jsx
"use client";

import { useEffect, useRef } from "react";
import { useAppContext } from "@/components/AppInitializer";
import gsap from "gsap";

const Bg = ({ obj }) => {
  const { fontReady } = useAppContext(); // Use fontReady state
  const elRef = useRef(null);

  useEffect(() => {
    if (!fontReady) return; // Wait for fonts to load
    const el = elRef.current;
    const { renderer, post, canvas } = obj;

    // Initialize GSAP animations
    const timeline = gsap.timeline({ paused: true })
      .fromTo(
        post.passes[0].program.uniforms.uTime,
        { value: 0 },
        { value: 2, duration: 1.4, ease: "power2.inOut" }
      )
      .fromTo(
        post.passes[0].program.uniforms.uStart,
        { value: 0.39 },
        { value: 0.8, duration: 1, ease: "power2.inOut" },
        0
      );

    timeline.play();

    return () => {
      renderer?.gl.getExtension("WEBGL_lose_context")?.loseContext(); // Cleanup
      canvas?.remove();
    };
  }, [fontReady, obj]);

  return <div ref={elRef} className="Bg" />;
};

export default Bg;