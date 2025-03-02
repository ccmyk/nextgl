// 🏜 src/components/gl/bg/Bg.jsx
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

const Bg = ({ obj }) => {
  const elRef = useRef(null);
  const norm = useRef(0);
  const end = useRef(0);
  const lerp = useRef(0.6);
  const animMouse = useRef(null);
  const animCtr = useRef(null);

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
        norm.current =
          (e.touches[0]?.pageX - el.getBoundingClientRect().x) /
          el.clientHeight;
      } else {
        norm.current = e.layerY / el.clientHeight;
      }
      norm.current = clamp(0, 1, parseFloat(norm.current).toFixed(3));
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

  return <div ref={elRef} className="Bg" />;
};

Bg.prototype.check = check;
Bg.prototype.start = start;
Bg.prototype.stop = stop;
Bg.prototype.updateX = updateX;
Bg.prototype.updateY = updateY;
Bg.prototype.updateScale = updateScale;
Bg.prototype.updateAnim = updateAnim;

export default Bg;