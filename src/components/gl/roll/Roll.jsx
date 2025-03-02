// 🎢 src/components/gl/roll/Roll.jsx

"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { check, start, stop, updateY, updateScale, updateAnim } from "./position";

const Roll = ({ obj }) => {
  const { el, renderer, mesh, canvas, textures } = obj;

  // State & References
  const [active, setActive] = useState(-1);
  const isReady = useRef(false);
  const norm = useRef([0, 0]);
  const end = useRef([0, 0]);
  const ease = useRef(0.06);
  const ctr = useRef({ actual: 0, stop: 0 });

  useEffect(() => {
    initEvents();
    return () => removeEvents();
  }, []);

  // **Initialize Event Listeners**
  const initEvents = () => {
    searchTex(0, 1);
  };

  // **Set Texture Sizes**
  const searchTex = (i, u) => {
    if (textures[i].image.tagName === "VIDEO") {
      mesh.program.uniforms.uTextureSize.value = [textures[i].width, textures[i].height];
    }
  };

  // **Update Function**
  const update = (time, speed, pos) => {
    if (!renderer) return false;

    end.current[0] = lerp(end.current[0], norm.current[0], ease.current);
    mesh.program.uniforms.uMouse.value = end.current;

    if (ctr.current.actual !== pos) {
      ctr.current.actual = pos;
      updateY(pos);
    }

    if (ctr.current.stop !== 1) {
      updateAnim();
    }

    renderer.render({ scene: mesh });
    return true;
  };

  // **Cleanup Function**
  const removeEvents = () => {
    setActive(-2);
    gsap.timeline({
      onUpdate: () => renderer.render({ scene: mesh }),
      onComplete: () => {
        renderer.gl.getExtension("WEBGL_lose_context").loseContext();
        canvas.remove();
      },
    }).to(canvas, { opacity: 0, duration: 0.6, ease: "power2.inOut" });
  };

  // **Lerp Helper Function**
  const lerp = (value1, value2, t) => value1 * (1 - t) + value2 * t;

  return null; // WebGL handles rendering
};

export default Roll;