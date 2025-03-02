// 🖼 src/gl/base/Base.jsx

"use client";

import { useEffect, useRef, useState } from "react";
import { Vec2 } from "ogl";
import gsap from "gsap";
import { check, start, stop, updateX, updateY, updateScale, updateAnim } from "./position";

const Base = ({ obj }) => {
  const { el, pos, renderer, mesh, canvas } = obj;
  const program = mesh.program;

  // State
  const [active, setActive] = useState(-1);
  const [isReady, setIsReady] = useState(false);
  const ctr = useRef({
    actual: 0,
    current: 0,
    limit: 0,
    start: 0,
    prog: 0,
    progt: 0,
    stop: 0,
  });

  const coords = useRef([0, 0]);
  const norm = useRef([0, 0]);
  const end = useRef([0, 0]);
  const ease = useRef(0.06);
  const animstart = useRef(null);

  useEffect(() => {
    initEvents();
    return () => removeEvents();
  }, []);

  // **Initialization of GSAP Animation**
  const initEvents = () => {
    animstart.current = gsap.timeline({ paused: true, onComplete: () => setActive(0) })
      .fromTo(program.uniforms.uStart0, { value: 0 }, { value: 1, duration: 0.6, ease: "power2.inOut" }, 0)
      .fromTo(program.uniforms.uStartX, { value: 0 }, { value: -0.1, duration: 2, ease: "power2.inOut" }, 0)
      .fromTo(program.uniforms.uMultiX, { value: -0.4 }, { value: 0.1, duration: 2, ease: "power2.inOut" }, 0)
      .fromTo(program.uniforms.uStartY, { value: 0.1 }, { value: 0.95, duration: 2, ease: "power2.inOut" }, 0)
      .fromTo(program.uniforms.uMultiY, { value: 0.45 }, { value: 0.3, duration: 2, ease: "power2.inOut" }, 0)
      .fromTo(program.uniforms.uStart2, { value: 1 }, { value: 0, duration: 1, ease: "power2.inOut" }, 0.6);

    animstart.current.timeScale(1.4);
  };

  // **Mouse Move & Touch Events**
  const mvFn = (e) => {
    ease.current = 0.03;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    norm.current[0] = (x - el.getBoundingClientRect().x) / el.clientWidth - 0.5;
  };

  const lvFn = () => {
    ease.current = 0.01;
    norm.current[0] = 0;
  };

  useEffect(() => {
    el.addEventListener("mousemove", mvFn);
    el.addEventListener("mouseleave", lvFn);

    return () => {
      el.removeEventListener("mousemove", mvFn);
      el.removeEventListener("mouseleave", lvFn);
    };
  }, []);

  // **Update Function**
  const update = (time, speed, pos) => {
    if (!renderer || isReady === 0 || active !== 1) return false;

    end.current[0] = lerp(end.current[0], norm.current[0], ease.current);
    program.uniforms.uMouse.value = end.current;

    if (ctr.current.actual !== pos) {
      ctr.current.actual = pos;
      updateY(pos);
    }

    if (ctr.current.stop !== 1) {
      updateAnim();
    }

    program.uniforms.uTime.value = time || 0;
    renderer.render({ scene: mesh });

    return true;
  };

  // **Cleanup Function**
  const removeEvents = () => {
    setActive(0);
    renderer.gl.getExtension("WEBGL_lose_context").loseContext();
    canvas.remove();
  };

  // **Resize Handler**
  const onResize = (viewport, screen) => {
    const bound = el.getBoundingClientRect();

    ctr.current.start = bound.y - screen.h + window.scrollY;
    ctr.current.limit = bound.height;

    renderer.setSize(screen.w, screen.h);
    program.uniforms.uResolution.value = [screen.w, screen.h];
  };

  // **Linear Interpolation Helper**
  const lerp = (value1, value2, t) => value1 * (1 - t) + value2 * t;

  return null; // WebGL handles rendering
};

export default Base;