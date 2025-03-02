// 🧮 src/components/gl/pg/Pg.jsx
"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Triangle, Program, Mesh, Vec2, Texture } from 'ogl';
import gsap from 'gsap';
import { check, checkEl, start, stop, updateX, updateY, updateScale, updateAnim } from './position.js';

const Pg = ({ obj }) => {
  const [meshes, setMeshes] = useState([]);
  const [isReady, setIsReady] = useState(0);
  const animCtr = useRef(gsap.timeline({ paused: true }));
  const sizerRef = useRef(null);
  const elRef = useRef(null);

  useEffect(() => {
    if (!obj) return;
    const { el, pos, scene, cam, texture, renderer, touch, device, canvas, geometry, rev } = obj;
    const els = el.parentNode.querySelectorAll('.el');
    const sizer = el.parentNode.querySelector('.Sizer');
    sizerRef.current = sizer;
    elRef.current = el;

    const newMeshes = [];
    let cont = 0;
    let row = 0;
    const w = sizer.clientWidth;
    const h = sizer.clientHeight;

    els.forEach((a, i) => {
      const program = new Program(renderer.gl, {
        vertex: PGv,
        fragment: PGs,
        uniforms: {
          uTime: { value: 0 },
          uStart: { value: 0 },
          uZoom: { value: 1 },
          uMove: { value: 1 },
          tMap: { value: texture },
          uCover: { value: new Vec2(w, h) },
          uTextureSize: { value: new Vec2(0, 0) },
          uMouse: { value: 0 },
          uLoad: { value: 0 }
        },
      });

      const textureInstance = new Texture(renderer.gl, {
        generateMipmaps: false,
      });

      const mesh = new Mesh(renderer.gl, { geometry: geometry, program: program });
      mesh.setParent(scene);

      const qck =
        gsap.utils.pipe(
          gsap.utils.clamp(-2, 2),
          gsap.quickTo(mesh.program.uniforms.uMouse, 'value', { duration: 0.8, ease: 'power1' })
        );

      newMeshes.push({
        mesh,
        texture: textureInstance,
        el: a,
        id: cont,
        pos: i,
        row: row,
        multx: 1,
        multy: 1,
        mult: 1,
        qck,
        loaded: 0
      });

      if (device < 2) {
        if (cont === 3 || cont === 6 || cont === 9 || cont === 11) {
          row++;
        }
        cont++;
        if (cont === 12) {
          cont = 0;
        }
      } else {
        cont++;
        row++;
      }
    });

    setMeshes(newMeshes);
    setIsReady(1);
  }, [obj]);

  return (
    <div ref={elRef} className="pg-container">
      {/* Additional JSX and elements can be added here */}
    </div>
  );
};

export default Pg;