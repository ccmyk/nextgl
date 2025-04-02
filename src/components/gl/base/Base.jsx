// 🖼 src/components/gl/base/Base.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useAppContext } from "@/components/AppInitializer";
import gsap from "gsap";

const Base = ({ obj }) => {
  const { fontReady } = useAppContext(); // Use fontReady state
  const { renderer, mesh, canvas } = obj;
  const program = mesh.program;

  // State
  const [active, setActive] = useState(-1);
  const animstart = useRef(null);

  useEffect(() => {
    if (!fontReady) return; // Wait for fonts to load

    // Initialize GSAP animations when fonts are ready
    animstart.current = gsap.timeline({ paused: true, onComplete: () => setActive(0) })
      .fromTo(program.uniforms.uStart0, { value: 0 }, { value: 1, duration: 0.6, ease: "power2.inOut" }, 0)
      .fromTo(program.uniforms.uStartX, { value: 0 }, { value: -0.1, duration: 2, ease: "power2.inOut" }, 0)
      .fromTo(program.uniforms.uMultiX, { value: -0.4 }, { value: 0.1, duration: 2, ease: "power2.inOut" }, 0)
      .fromTo(program.uniforms.uStartY, { value: 0.1 }, { value: 0.95, duration: 2, ease: "power2.inOut" }, 0)
      .fromTo(program.uniforms.uMultiY, { value: 0.45 }, { value: 0.3, duration: 2, ease: "power2.inOut" }, 0)
      .fromTo(program.uniforms.uStart2, { value: 1 }, { value: 0, duration: 1, ease: "power2.inOut" }, 0.6);

    animstart.current.timeScale(1.4);

    return () => {
      renderer?.gl.getExtension("WEBGL_lose_context")?.loseContext(); // Cleanup WebGL resources
      canvas?.remove();
    };
  }, [fontReady, renderer, canvas, program]); // Depend on fontReady

  return null; // Renders WebGL to canvas
};

export default Base;