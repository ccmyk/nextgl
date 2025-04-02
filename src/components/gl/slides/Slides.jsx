// 🎞 src/components/gl/slides/Slides.jsx
"use client";

import { useEffect, useRef } from "react";
import { useAppContext } from "@/components/AppInitializer";
import gsap from "gsap";

const Slides = ({ obj }) => {
  const { fontReady } = useAppContext(); // Use fontReady state
  const { renderer, post, canvas, textures } = obj;

  useEffect(() => {
    if (!fontReady) return; // Wait for fonts to load

    // Initialize animations (similar to Base logic)
    const timeline = gsap.timeline({ paused: true })
      .fromTo(
        post.passes[0].program.uniforms.uStart,
        { value: 1.5 },
        { value: 0.5, duration: 2, ease: "power4.inOut" }
      )
      .fromTo(
        canvas,
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: "power2.inOut" }
      );

    textures.forEach((texture) => {
      if (texture.image.tagName === "VIDEO") texture.image.play(); // Start videos
    });

    timeline.play();

    return () => {
      renderer?.gl.getExtension("WEBGL_lose_context")?.loseContext(); // Cleanup
      canvas?.remove();
    };
  }, [fontReady, renderer, post, canvas, textures]);

  return null;
};

export default Slides;