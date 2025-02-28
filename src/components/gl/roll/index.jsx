// src/components/gl/roll/index.jsx
// 🎢

"use client";

import { useWebGLCanvas } from "@/components/gl/utils/SceneProvider";
import useWebGL from "@/components/gl/utils/useWebGL";
import Base from "./base";
import frag from "raw:./shaders/frag.single.glsl";
import vert from "raw:./shaders/vert.single.glsl";

const Background = () => {
  const canvasRef = useWebGLCanvas();
  useWebGL(canvasRef, Base, frag, vert);

  return null; // No duplicate <canvas>
};

export default Background;