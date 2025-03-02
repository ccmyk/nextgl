// 🎞 src/components/gl/slides/Slides.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { check, start, stop, updateX, updateY, updateScale, updateAnim } from "./position";

const Slides = ({ obj }) => {
  const { el, renderer, scene, camera, post, textures, canvas } = obj;

  // State & References
  const [active, setActive] = useState(-1);
  const isReady = useRef(false);
  const objPos = useRef({ x: 0, target: 0, timer: 0 });
  const ctr = useRef({ actual: 0, current: 0, limit: 0, start: 0, prog: 0, progt: 0, stop: 0 });

  useEffect(() => {
    gsap.set(canvas, { display: "none" });
    initEvents();
    return () => removeEvents();
  }, []);


const Slides = ({ el, pos, renderer, scene, camera, post, textures, meshes }) => {
  // Refs to replace class properties
  const canvasRef = useRef(null);
  const singleRef = useRef(null);
  const objposRef = useRef({ x: 0, target: 0, timer: 0 });
  const activeRef = useRef(-1);
  const animctrRef = useRef(null);
  const animinRef = useRef(null);
  const animhoverRef = useRef(null);
  const animsinglectrRef = useRef(null);
  const stateRef = useRef(0);
  const deviceRef = useRef(3);
  const isReadyRef = useRef(0);
  const posmeshesRef = useRef([]);
  const slideanimRef = useRef(null);

  // State variables
  const [h, setH] = useState(window.innerHeight);
  const [oldpos, setOldpos] = useState(0);

  useEffect(() => {
    if (!el || !canvasRef.current) return;

    singleRef.current = document.querySelector(
      `.single[data-ids="${el.dataset.ids}"]`
    );

    if (singleRef.current) {
      singleRef.current.style.opacity = 0;
    }

    if (el.dataset.ids == 0) {
      canvasRef.current.classList.add("fCanvas");
    }

    gsap.set(canvasRef.current, { display: "none" });

    // GSAP Animation Timeline
    const animctr = gsap.timeline({ paused: true });
    animctrRef.current = animctr;

    if (el.dataset.ids != 0) {
      animctr
        .fromTo(
          objposRef.current,
          { timer: 0 },
          {
            timer: 1,
            duration: 0.1,
            ease: "power2.inOut",
            onUpdate: () => {
              if (slideanimRef.current) {
                slideanimRef.current.timeScale(objposRef.current.timer);
              }
            },
          }
        )
        .fromTo(
          post.passes[0].program.uniforms.uStart,
          { value: 1.5 },
          { value: 0, duration: 0.45 }
        );
    } else {
      const animin = gsap.timeline({
        paused: true,
        delay: 0.1,
        onStart: () => {
          activeRef.current = 1;

          textures.forEach((texture) => {
            if (texture.image.tagName === "VIDEO") {
              texture.image.play();
            }
          });

          slideanimRef.current.play();
        },
        onComplete: () => {
          animinRef.current = null;
        },
      })
        .fromTo(
          canvasRef.current,
          { webkitFilter: "blur(6px)", filter: "blur(6px)" },
          {
            webkitFilter: "blur(0px)",
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power2.inOut",
          }
        )
        .fromTo(
          canvasRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6, ease: "power2.inOut" }
        )
        .fromTo(
          objposRef.current,
          { timer: 0 },
          {
            timer: 1,
            duration: 0.9,
            ease: "none",
            onUpdate: () => {
              if (slideanimRef.current) {
                slideanimRef.current.timeScale(objposRef.current.timer);
              }
            },
          },
          0.8
        )
        .fromTo(
          post.passes[0].program.uniforms.uStart,
          { value: 1.5 },
          { value: 0, duration: 2, ease: "power4.inOut" },
          0.6
        );

      animinRef.current = animin;
    }

    animctr
      .fromTo(
        objposRef.current,
        { timer: 1 },
        {
          timer: 0,
          duration: 0.05,
          ease: "power2.inOut",
          onUpdate: () => {
            if (slideanimRef.current) {
              slideanimRef.current.timeScale(objposRef.current.timer);
            }
          },
        },
        0.95
      );

    animsinglectrRef.current = gsap.timeline({ paused: true });

    // Mouse hover animation
    const animhover = gsap.timeline({ paused: true });
    animhoverRef.current = animhover;

    if (deviceRef.current < 3) {
      animhover.to(post.passes[0].program.uniforms.uHover, {
        value: 1,
        duration: 1,
        ease: "power2.inOut",
      });
    }

    initEvents();
  }, []);

  const initEvents = () => {
    if (deviceRef.current < 2) {
      el.parentNode.onmouseenter = () => {
        animhoverRef.current.timeScale(1);
        animhoverRef.current.play();
      };

      el.parentNode.onmouseleave = () => {
        animhoverRef.current.pause();
        animhoverRef.current.timeScale(0.7);
        animhoverRef.current.reverse();
      };
    }
  };

