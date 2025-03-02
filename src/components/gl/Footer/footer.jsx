// 🔥 src/components/gl/footer/Footer.jsx

"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { check, start, stop, updateX, updateY, updateAnim } from "./position";

const Footer = ({ obj }) => {
  const { el, pos, renderer, mesh, post, text, canvas, touch, cam, scene } = obj;

  // State & References
  const [active, setActive] = useState(-1);
  const isReady = useRef(false);
  const norm = useRef(0);
  const end = useRef(0);
  const lerp = useRef(0.6);
  const ttRef = useRef(null);
  const ctr = useRef({ actual: 0, stop: 0 });

  const animctr = useRef(
    gsap.timeline({ paused: true })
      .fromTo(post.passes[0].program.uniforms.uTime, { value: 0 }, { value: 2, duration: 0.3, ease: "power2.inOut" }, 0)
      .fromTo(post.passes[0].program.uniforms.uTime, { value: 2 }, { value: 0, duration: 0.3, ease: "power2.inOut" }, 0.7)
      .fromTo(post.passes[0].program.uniforms.uStart, { value: 0.39 }, { value: 0.8, duration: 1, ease: "power2.inOut" }, 0)
  );

  const animmouse = useRef(
    gsap.timeline({ paused: true })
      .fromTo(post.passes[0].program.uniforms.uMouseT, { value: 0.2 }, { value: 2, duration: 0.3, ease: "power2.inOut" }, 0.1)
      .fromTo(post.passes[0].program.uniforms.uMouseT, { value: 2 }, { value: 0, duration: 0.3, ease: "power2.inOut" }, 0.7)
      .fromTo(post.passes[0].program.uniforms.uMouse, { value: 0.39 }, { value: 0.8, duration: 0.9, ease: "none" }, 0.1)
  );

  useEffect(() => {
    initEvents();
    return () => removeEvents();
  }, []);

  // **Remove Events & Cleanup**
  const removeEvents = () => {
    setActive(-2);
    if (ttRef.current) ttRef.current.style.pointerEvents = "none";

    gsap.timeline({
      onUpdate: () => post.render({ scene: mesh }),
      onComplete: () => {
        renderer.gl.getExtension("WEBGL_lose_context").loseContext();
        canvas.remove();
      },
    })
      .to(post.passes[0].program.uniforms.uOut, { value: -0.2, duration: 1, ease: "power2.inOut" }, 0)
      .to(canvas, { opacity: 0, duration: 0.8, ease: "none" }, 0.2);
  };

  // **Update Function**
  const update = (time, speed, pos) => {
    if (!renderer || active !== 1) return false;

    end.current = lerpFunc(end.current, norm.current, lerp.current);
    animmouse.current.progress(end.current);

    if (ctr.current.actual !== pos) {
      ctr.current.actual = pos;
      updateY(pos);
    }

    if (ctr.current.stop !== 1) {
      updateAnim();
    }

    post.render({ scene: mesh });
  };

  // **Initialize Mouse & Touch Events**
  const initEvents = () => {
    ttRef.current = el.parentNode.querySelector(".Oiel");
    new window.SplitType(ttRef.current, { types: "chars,words" });

    const inFn = () => {
      ctr.current.stop = 0;
      lerp.current = 0.02;
    };

    const mvFn = (e) => {
      if (e.touches) {
        norm.current = (e.touches[0]?.pageX - el.getBoundingClientRect().x) / el.clientHeight;
      } else {
        norm.current = e.layerY / el.clientHeight;
      }
      norm.current = clamp(0, 1, parseFloat(norm.current).toFixed(3));
    };

    const lvFn = (e) => {
      lerp.current = 0.01;
      if (e.touches) {
        norm.current = (e.touches[0]?.pageX - el.getBoundingClientRect().x) / el.clientHeight;
      } else {
        norm.current = e.layerY / el.clientHeight;
      }
      norm.current = parseFloat(norm.current).toFixed(3);
    };

    if (touch === 0) {
      ttRef.current.onmouseenter = inFn;
      ttRef.current.onmousemove = mvFn;
      ttRef.current.onmouseleave = lvFn;
    }
  };

  // **Resize Handler**
  const onResize = (viewport, screen) => {
    const bound = el.getBoundingClientRect();
    ctr.current.start = parseInt(bound.y - screen.h + window.scrollY + screen.h * 0.5);
    ctr.current.limit = parseInt(el.clientHeight + screen.h * 0.5);

    renderer.setSize(bound.width, bound.height);
    cam.perspective({ aspect: renderer.gl.canvas.clientWidth / renderer.gl.canvas.clientHeight });
    cam.fov = 45;
    cam.position.set(0, 0, 7);

    const fov = (cam.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * cam.position.z;
    const width = height * cam.aspect;
    renderer.render({ scene });
  };

  // **Linear Interpolation Helper**
  const lerpFunc = (value1, value2, t) => value1 * (1 - t) + value2 * t;

  return null;
};

export default Footer;