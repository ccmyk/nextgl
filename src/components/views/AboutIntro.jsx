"use client";
import { useEffect, useRef } from "react";
import initAboutIntro from "@/legacy/views/About/intro";

export default function AboutIntro() {
  const el = useRef(null);
  useEffect(() => {
    const cleanup = initAboutIntro(el.current);
    return () => cleanup?.();
  }, []);
  return <section ref={el} className="about-intro" />;
}