// 💬 src/components/gl/title/Title.jsx

"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { check, start, stop, updateX, updateY, updateScale } from "./position";

const Title = ({ obj }) => {
  const { el, pos, renderer, mesh, text, canvas, touch, cam, scene } = obj;

  // State & References
  const [active, setActive] = useState(-1);
  const isReady = useRef(false);
  const coords = useRef([0, 0]);
  const norm = useRef([0, 0]);
  const end = useRef([0, 0]);
  const lerp = useRef(0.6);
  const actualChar = useRef(-2);
  const ttRef = useRef(null);
  const positionCur = useRef([]);
  const positionTar = useRef([]);
  const ctr = useRef({ actual: 0, stop: 0 });

  const animin = useRef(
    gsap.timeline({ paused: true })
      .to(mesh.program.uniforms.uPower, { value: 1, duration: 0.36, ease: "power4.inOut" })
  );

  const animout = useRef(
    gsap.timeline({ paused: true })
      .to(mesh.program.uniforms.uPower, { value: 0, duration: 0.6, ease: "none" })
  );

  useEffect(() => {
    initEvents();
    return () => removeEvents();
  }, []);

  // **Remove Events & Cleanup**
  const removeEvents = () => {
    if (ttRef.current) ttRef.current.classList.remove("act");
    lerp.current = 0.03;
    animout.current.pause();
    animin.current.pause();
    setActive(2);

    gsap.timeline({
      onUpdate: () => {
        calcChars(0, -0.5);
        end.current[0] = lerpFunc(end.current[0], norm.current[0], lerp.current);
        mesh.program.uniforms.uMouse.value = [end.current[0], 0];
        positionCur.current = lerpArr(positionCur.current, positionTar.current, lerp.current);
        mesh.program.uniforms.uPowers.value = positionCur.current;
        renderer.render({ scene, camera: cam });
      },
      onComplete: () => {
        renderer.gl.getExtension("WEBGL_lose_context").loseContext();
        canvas.remove();
      },
    })
      .to(mesh.program.uniforms.uPower, { value: 1, duration: 0.8, ease: "power4.inOut" })
      .to(el.parentNode.querySelector(".cCover"), { opacity: 0, duration: 0.6, ease: "power2.inOut" });
  };

  // **Update Function**
  const update = (time, speed, pos) => {
    if (!renderer || active === 2) return false;

    end.current[0] = lerpFunc(end.current[0], norm.current[0], lerp.current);
    mesh.program.uniforms.uMouse.value = [end.current[0], 0];
    mesh.program.uniforms.uTime.value = time;

    positionCur.current = lerpArr(positionCur.current, positionTar.current, lerp.current);
    mesh.program.uniforms.uPowers.value = positionCur.current;

    if (ctr.current.stop === 0) {
      renderer.render({ scene, camera: cam });
    }
  };

  // **Initialize Mouse & Touch Events**
  const initEvents = () => {
    ttRef.current = el.parentNode.querySelector(".Oiel");
    new window.SplitType(ttRef.current, { types: "chars,words" });

    getChars();
    if (el.dataset.nome) return;

    const inFn = (e) => {
      ctr.current.stop = 0;
      lerp.current = 0.03;
      let lX = e.touches ? e.touches[0]?.pageX - el.getBoundingClientRect().x : e.layerX;
      let out = lX < 60 ? -0.5 : 0.5;
      calcChars(lX, out);
      animout.current.pause();
      animin.current.play();
      lerp.current = 0.06;
    };

    const mvFn = (e) => {
      let lX = e.touches ? e.touches[0]?.pageX - el.getBoundingClientRect().x : e.layerX;
      calcChars(lX);
    };

    const lvFn = (e) => {
      let lX = e.touches ? e.touches[0]?.pageX - el.getBoundingClientRect().x : e.layerX;
      lerp.current = 0.03;
      let out = lX < 60 ? 0.5 : -0.5;
      calcChars(lX, out);
      animin.current.pause();
    };

    if (touch === 0) {
      ttRef.current.onmouseenter = (e) => inFn(e);
      ttRef.current.onmousemove = (e) => mvFn(e);
      ttRef.current.onmouseleave = (e) => lvFn(e);
    }
  };

  // **Resize Handler**
  const onResize = (viewport, screen) => {
    const bound = el.getBoundingClientRect();
    renderer.setSize(bound.width, bound.height);
    cam.perspective({ aspect: renderer.gl.canvas.clientWidth / renderer.gl.canvas.clientHeight });
    cam.fov = 45;
    cam.position.set(0, 0, 7);

    const fov = (cam.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * cam.position.z;
    const width = height * cam.aspect;
    getChars();
  };

  // **Character Handling Functions**
  const getChars = () => {
    const chars = ttRef.current.querySelectorAll(".char");
    let arrw = [];
    let arrh = [];

    chars.forEach((a, i) => {
      positionTar.current.push(0.5);
      positionCur.current.push(0.5);
      arrw.push(a.clientWidth);
      arrh.push(a.clientHeight);
    });

    mesh.program.uniforms.uWidth.value = arrw;
    mesh.program.uniforms.uHeight.value = arrh;
  };

  const calcChars = (x, out = undefined) => {
    let arr = [];
    if (out !== undefined) {
      arr = new Array(positionCur.current.length).fill(out);
    } else {
      positionCur.current.forEach((_, i) => {
        let tot = x - i * 10;
        tot = tot / 10 - 0.5;
        arr.push(Math.min(Math.max(tot, -0.5), 0.5));
      });
    }
    positionTar.current = arr;
  };

  // **Linear Interpolation Helper**
  const lerpFunc = (value1, value2, t) => value1 * (1 - t) + value2 * t;

  // **Array Lerp Function**
  const lerpArr = (arr1, arr2, t) => arr1.map((v, i) => lerpFunc(v, arr2[i], t));

  return null;
};

export default Title;