// src/components/gl/Canvas.jsx
"use client";

import { useEffect, useRef } from "react";
import Canvas from "./gl";
import { useWebGLCanvas } from "./utils/SceneProvider";

export default function CanvasComponent({ main }) {
  const canvasRef = useWebGLCanvas();
  const canvasInstanceRef = useRef(null);
  
  useEffect(() => {
    if (!canvasRef?.current || !main) return;
    
    // Initialize Canvas instance
    const canvasInstance = new Canvas(main);
    canvasInstanceRef.current = canvasInstance;
    
    // Create elements based on template
    const initCanvas = async () => {
      try {
        // Pass the canvasRef to the create method
        await canvasInstance.create([], canvasRef);
        
        // Expose canvas instance to main object
        main.canvas = canvasInstance;
      } catch (error) {
        console.error("Error initializing canvas:", error);
      }
    };
    
    initCanvas();
    
    // Cleanup
    return () => {
      if (canvasInstanceRef.current) {
        canvasInstanceRef.current.cleanTemp();
      }
      
      if (main.canvas === canvasInstanceRef.current) {
        delete main.canvas;
      }
    };
  }, [canvasRef, main]);
  
  return null;
}
