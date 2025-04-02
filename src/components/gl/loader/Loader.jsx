// ⌛️ src/components/gl/loader/Loader.jsx
"use client";

import { useEffect, useRef } from "react";
import { useAppContext } from "@/components/AppInitializer";
import gsap from "gsap";

const Loader = ({ WebGLSetup }) => {
  const { fontReady } = useAppContext();
  const { renderer, post, scene, canvas } = WebGLSetup;

  useEffect(() => {
    if (!fontReady) return;

    // GSAP animation timeline for WebGL loader
    const timeline = gsap.timeline({ paused: false })
      .fromTo(
        post.passes[0].program.uniforms.uStart,
        { value: 1 },
        { value: 0.4, duration: 1.2, ease: "power2.inOut" }
      )
      .fromTo(
        canvas,
        { opacity: 0 },
        { opacity: 1, duration: 1.5, ease: "power2.inOut" }
      );

    return () => {
      // Clean WebGL resources on unmount
      renderer?.gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas?.remove();
    };
  }, [fontReady, renderer, post, scene, canvas]);

  return <div className="Loader" aria-label="WebGL Loader" />;
};

export default Loader;