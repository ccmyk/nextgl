// ⌛️ src/components/gl/loader/Loader.jsx
"use client";

import { useEffect, useRef } from "react";
import {
  check,
  start,
  stop,
  updateX,
  updateY,
  updateScale,
  updateAnim,
} from "./position.js";
import { Vec2 } from "ogl";
import gsap from "gsap";

const Loader = ({ obj }) => {
  const elRef = useRef(null);
  const norm = useRef([0, 0]);
  const end = useRef([0, 0]);
  const lerp = useRef(0.6);
  const animCtr = useRef(null);
  const animMouse = useRef(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const { renderer, mesh, post, scene, cam: camera, touch, canvas } = obj;

    let active = -1;
    let isReady = 0;
    let ctr = { actual: 0, stop: 0 };

    animCtr.current = gsap.timeline({ paused: true })
      .fromTo(
        post.passes[0].program.uniforms.uTime,
        { value: 0 },
        { value: 2, duration: 0.3, ease: "power2.inOut" },
        0
      )
      .fromTo(
        post.passes[0].program.uniforms.uTime,
        { value: 2 },
        { value: 0, duration: 0.3, ease: "power2.inOut" },
        0.7
      )
      .fromTo(
        post.passes[0].program.uniforms.uStart,
        { value: 0.39 },
        { value: 0.8, duration: 1, ease: "power2.inOut" },
        0
      );

    animMouse.current = gsap.timeline({ paused: true })
      .fromTo(
        post.passes[0].program.uniforms.uMouseT,
        { value: 0.2 },
        { value: 2, duration: 0.3, ease: "power2.inOut" },
        0.1
      )
      .fromTo(
        post.passes[0].program.uniforms.uMouseT,
        { value: 2 },
        { value: 0, duration: 0.3, ease: "power2.inOut" },
        0.7
      )
      .fromTo(
        post.passes[0].program.uniforms.uMouse,
        { value: 0.39 },
        { value: 0.8, duration: 0.9, ease: "none" },
        0.1
      );

    const inFn = () => {
      ctr.stop = 0;
      lerp.current = 0.02;
    };

    const mvFn = (e) => {
      if (e.touches) {
        norm.current = [
          (e.touches[0]?.pageX - el.getBoundingClientRect().x) /
          el.clientWidth,
          (e.touches[0]?.pageY - el.getBoundingClientRect().y) /
          el.clientHeight,
        ];
      } else {
        norm.current = [
          e.layerX / el.clientWidth,
          e.layerY / el.clientHeight,
        ];
      }
      norm.current = norm.current.map((n) =>
        clamp(0, 1, parseFloat(n).toFixed(3))
      );
    };

    const lvFn = () => {
      lerp.current = 0.01;
    };

    if (touch === 0) {
      el.onmouseenter = inFn;
      el.onmousemove = mvFn;
      el.onmouseleave = lvFn;
    }

    return () => {
      el.onmouseenter = null;
      el.onmousemove = null;
      el.onmouseleave = null;
    };
  }, [obj]);

  return <div ref={elRef} className="Loader" />;
};

Loader.prototype.check = check;
Loader.prototype.start = start;
Loader.prototype.stop = stop;
Loader.prototype.updateX = updateX;
Loader.prototype.updateY = updateY;
Loader.prototype.updateScale = updateScale;
Loader.prototype.updateAnim = updateAnim;

export default Loader;