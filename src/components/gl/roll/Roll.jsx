// 🎢 src/components/gl/roll/Roll.jsx

"use client";

import { useEffect, useRef } from "react";
import { useAppContext } from "@/components/AppInitializer";
import gsap from "gsap";

const Roll = ({ obj }) => {
  const { fontReady } = useAppContext(); // Check rendering readiness

  const { renderer, mesh, canvas } = obj;
  const norm = useRef([0, 0]);
  const end = useRef([0, 0]);

  useEffect(() => {
    if (!fontReady) return; // Only initialize when fonts are ready

    const timeline = gsap.timeline({ paused: true })
      .fromTo(
        canvas,
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: "power1.inOut" }
      );

    timeline.play();

    const update = () => {
      // Perform any render updates
      end.current[0] = gsap.utils.interpolate(end.current[0], norm.current[0], 0.1); // Smooth interpolation
      mesh.program.uniforms.uMouse.value = end.current;
      renderer.render({ scene: mesh });
    };

    const animationFrameId = requestAnimationFrame(update); // Animation frame loop
    return () => {
      cancelAnimationFrame(animationFrameId);
      renderer?.gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas?.remove();
    };
  }, [fontReady, renderer, mesh, canvas]);

  return null; // WebGL handles rendering
};

export default Roll;