// src/components/gl/ois/index.jsx
"use client";

import { useWebGLCanvas } from "@/components/gl/utils/SceneProvider";
import useWebGL from "@/components/gl/utils/useWebGL";
import Base from "./base";
import frag from "raw:./shaders/frag.main.glsl";
import vert from "raw:./shaders/vert.main.glsl";

const Background = () => {
  const canvasRef = useWebGLCanvas();
  useWebGL(canvasRef, Base, frag, vert);

  return null; // No duplicate <canvas>
};

export default Background;