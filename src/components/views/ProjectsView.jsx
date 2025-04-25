"use client";
import { useEffect, useRef } from "react";
import initProjects from "@/legacy/views/Projects";

export default function ProjectsView() {
  const el = useRef(null);
  useEffect(() => {
    const cleanup = initProjects(el.current);
    return () => cleanup?.();
  }, []);
  return <canvas ref={el} className="projects-canvas" />;
}