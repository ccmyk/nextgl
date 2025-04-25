"use client";
import { useEffect, useRef } from "react";
import initProjectIntro from "@/legacy/views/Project/intro";

export default function ProjectIntro() {
  const el = useRef(null);
  useEffect(() => {
    const cleanup = initProjectIntro(el.current);
    return () => cleanup?.();
  }, []);
  return <section ref={el} className="project-intro" />;
}