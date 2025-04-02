// 🧮 src/components/gl/pg/Pg.jsx

"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAppContext } from "@/components/AppInitializer";
import { Mesh, Program, Vec2, Texture } from "ogl";
import gsap from "gsap";

const Pg = ({ obj }) => {
  const { fontReady } = useAppContext(); // Dependency on font readiness
  const sizerRef = useRef(null);
  const elRef = useRef(null);

  useEffect(() => {
    if (!fontReady || !obj) return; // Ensure fonts and obj are ready

    const {
      el,
      scene,
      renderer,
      geometry,
      texture,
    } = obj;

    const sizer = el.parentNode.querySelector(".Sizer");
    const els = el.parentNode.querySelectorAll(".el");
    sizerRef.current = sizer;
    elRef.current = el;

    els.forEach((element) => {
      // Define the WebGL program
      const program = new Program(renderer.gl, {
        vertex: PGv, // Ensure PGv shader is imported/defined
        fragment: PGs, // Ensure PGs shader is imported/defined
        uniforms: {
          uTime: { value: 0 },
          uStart: { value: 0 },
          tMap: { value: texture },
          uCover: { value: new Vec2(sizer.clientWidth, sizer.clientHeight) },
        },
      });

      const mesh = new Mesh(renderer.gl, { geometry, program });
      mesh.setParent(scene);
    });

    // Cleanup logic for WebGL resources
    return () => {
      renderer?.gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [fontReady, obj]);

  return <div ref={elRef} className="pg-container" />;
};

export default Pg;