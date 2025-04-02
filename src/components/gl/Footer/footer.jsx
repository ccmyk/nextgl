// 🔥 src/components/gl/footer/Footer.jsx

"use client";

import { useEffect, useRef } from "react";
import { useAppContext } from "@/components/AppInitializer";
import gsap from "gsap";

const Footer = ({ obj }) => {
  const { fontReady } = useAppContext(); // Use fontReady state for rendering readiness
  const { renderer, post, mesh, canvas } = obj;

  useEffect(() => {
    if (!fontReady) return; // Wait until fonts are ready

    // Initialize animations with GSAP
    const timeline = gsap.timeline({ paused: true })
      .fromTo(
        post.passes[0].program.uniforms.uStart,
        { value: 0.39 },
        { value: 0.8, duration: 1, ease: "power2.inOut" }
      )
      .fromTo(
        canvas,
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: "power2.inOut" }
      );

    timeline.play();

    return () => {
      // Cleanup WebGL renderer and canvas
      renderer?.gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas?.remove();
    };
  }, [fontReady, renderer, post, mesh, canvas]);

  return null; // Uniform WebGL rendering handle
};

export default Footer;