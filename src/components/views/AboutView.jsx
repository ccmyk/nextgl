"use client";
import { useEffect, useRef } from "react";
import initAbout from "@/legacy/views/About";

export default function AboutView() {
  const el = useRef(null);
  useEffect(() => {
    const cleanup = initAbout(el.current);
    return () => cleanup?.();
  }, []);
  return <canvas ref={el} className="about-canvas" />;
}