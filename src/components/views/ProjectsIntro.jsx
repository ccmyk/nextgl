"use client";
import { useEffect, useRef } from "react";
import initProjectsIntro from "@/legacy/views/Projects/intro";

export default function ProjectsIntro() {
  const el = useRef(null);
  useEffect(() => {
    const cleanup = initProjectsIntro(el.current);
    return () => cleanup?.();
  }, []);
  return <section ref={el} className="projects-intro" />;
}