// 👩‍⚖️ src/components/gl/tta/About.jsx

"use client";

import { useEffect, useRef } from "react";
import { useAppContext } from "@/components/AppInitializer";
import gsap from "gsap";
import SplitType from "split-type";

const About = ({ obj }) => {
  // Get global font readiness state
  const { fontReady } = useAppContext();

  const elRef = useRef(null);
  const ttRef = useRef(null);
  const animMouse = useRef(null);
  const norm = useRef(0);
  const end = useRef(0);

  useEffect(() => {
    if (!fontReady || !elRef.current) return;

    const el = elRef.current;
    const tt = el.parentNode.querySelector(".Oiel");
    const { renderer, post, canvas } = obj;

    ttRef.current = tt;

    // GSAP animations
    animMouse.current = gsap.timeline({ paused: true })
      .to(post.passes[0].program.uniforms.uMouse, { value: 0.8, duration: 0.9, ease: "none" })
      .to(post.passes[0].program.uniforms.uMouseT, { value: 2, duration: 0.3, ease: "power2.inOut" }, 0.1);

    new SplitType(tt, { types: "chars,words" });

    const handleMouseEnter = () => (end.current = 2); // Trigger animation start
    const handleMouseMove = (e) => {
      norm.current = e.layerY / el.clientHeight; // Normalize mouse position
    };
    const handleMouseLeave = () => (end.current = 0); // Reset animation

    if (tt) {
      tt.addEventListener("mouseenter", handleMouseEnter);
      tt.addEventListener("mousemove", handleMouseMove);
      tt.addEventListener("mouseleave", handleMouseLeave);
    }

    const update = () => {
      // Apply smooth transitions to uniforms
      const uMouseValue = gsap.utils.interpolate(end.current, norm.current, 0.1);
      post.passes[0].program.uniforms.uMouse.value = uMouseValue;

      // Render WebGL scene
      renderer.render({ delta: 0 });
      requestAnimationFrame(update);
    };

    update(); // Start rendering loop

    return () => {
      if (tt) {
        tt.removeEventListener("mouseenter", handleMouseEnter);
        tt.removeEventListener("mousemove", handleMouseMove);
        tt.removeEventListener("mouseleave", handleMouseLeave);
      }

      renderer?.gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas?.remove();
    };
  }, [fontReady, obj]);

  return <div ref={elRef} className="About" />;
};

export default About;