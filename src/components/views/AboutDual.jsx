// src/components/views/AboutDual.jsx
"use client";
import { useEffect, useRef } from "react";
import initAboutDual from "@/legacy/views/About/dual";

export default function AboutDual() {
  const el = useRef(null);
  useEffect(() => {
    const cleanup = initAboutDual(el.current);
    return () => cleanup?.();
  }, []);
  return <section ref={el} className="about-dual" />;
}