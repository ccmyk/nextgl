// 💬 src/components/gl/title/Title.jsx

"use client";

import { useEffect, useRef } from "react";
import { useAppContext } from "@/components/AppInitializer";
import gsap from "gsap";

const Title = ({ obj }) => {
  const { fontReady } = useAppContext(); // Ensures app state readiness
  const ttRef = useRef(null);

  const { el, renderer, mesh, canvas, scene, cam } = obj;
  const norm = useRef([0, 0]);
  const end = useRef([0, 0]);

  useEffect(() => {
    if (!fontReady) return; // Ensure fonts are ready before starting

    const animationIn = gsap.timeline({ paused: true }).to(mesh.program.uniforms.uPower, {
      value: 1,
      duration: 0.36,
      ease: "power4.inOut",
    });

    const animationOut = gsap.timeline({ paused: true }).to(mesh.program.uniforms.uPower, {
      value: 0,
      duration: 0.6,
      ease: "power4.inOut",
    });

    const handleMouseMove = (event) => {
      const { offsetX } = event;
      const newNorm = offsetX / el.clientWidth;
      norm.current[0] = gsap.utils.clamp(0, 1, newNorm); // Normalize mouse position
    };

    const update = () => {
      end.current[0] = gsap.utils.interpolate(end.current[0], norm.current[0], 0.1); // Smooth animation
      mesh.program.uniforms.uMouse.value = end.current; // Inject uniforms for animation
      renderer.render({ scene, camera: cam }); // Render WebGL scene
      requestAnimationFrame(update); // Keep updating
    };

    // Initialize mouse events
    ttRef.current = el.parentNode.querySelector(".Oiel");
    ttRef.current.addEventListener("mousemove", handleMouseMove);

    // Begin updates
    update();

    return () => {
      // Cleanup: remove events and stop animations
      ttRef.current.removeEventListener("mousemove", handleMouseMove);
      renderer?.gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas?.remove();
      animationOut.pause();
    };
  }, [fontReady, scene, renderer, mesh, el, canvas, cam]);

  return <div ref={ttRef} className="title-container" />;
};

export default Title;