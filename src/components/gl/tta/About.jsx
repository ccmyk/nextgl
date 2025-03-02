// 👩‍⚖️ src/components/gl/tta/About.jsx

"use client";

import { useEffect, useRef } from "react";
import {
  check,
  start,
  stop,
  updateX,
  updateY,
  updateAnim,
} from "./position.js";
import gsap from "gsap";
import SplitType from "split-type";

const About = ({ obj }) => {
  const elRef = useRef(null);
  const ttRef = useRef(null);
  const animMouse = useRef(null);
  const animCtr = useRef(null);
  const norm = useRef(0);
  const end = useRef(0);
  const lerp = useRef(0.6);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const cnt = el.parentNode.querySelector(".cCover");
    const tt = el.parentNode.querySelector(".Oiel");
    ttRef.current = tt;

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

    new SplitType(tt, { types: "chars,words" });

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
      tt.onmouseenter = inFn;
      tt.onmousemove = mvFn;
      tt.onmouseleave = lvFn;
    }

    return () => {
      if (tt) {
        tt.onmouseenter = null;
        tt.onmousemove = null;
        tt.onmouseleave = null;
      }
    };
  }, [obj]);

  return <div ref={elRef} className="About" />;
};

About.prototype.check = check;
About.prototype.start = start;
About.prototype.stop = stop;
About.prototype.updateX = updateX;
About.prototype.updateY = updateY;
About.prototype.updateAnim = updateAnim;

export default About;