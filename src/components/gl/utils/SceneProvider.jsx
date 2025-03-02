// src/components/gl/utils/SceneProvider.jsx
"use client";

import { createContext, useRef, useContext } from "react";

const WebGLContext = createContext(null);

export const WebGLProvider = ({ children }) => {
  const canvasRef = useRef(null);

  return (
    <WebGLContext.Provider value={canvasRef}>
      <canvas ref={canvasRef} className="webgl-canvas" />
      {children}
    </WebGLContext.Provider>
  );
};

export const useWebGLCanvas = () => useContext(WebGLContext);