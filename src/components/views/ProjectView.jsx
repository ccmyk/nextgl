"use client";
import { useEffect, useRef } from "react";
import initProject from "@/legacy/views/Project";

export default function ProjectView() {
  const el = useRef(null);
  useEffect(() => {
    const cleanup = initProject(el.current);
    return () => cleanup?.();
  }, []);
  return <canvas ref={el} className="project-canvas" />;
}