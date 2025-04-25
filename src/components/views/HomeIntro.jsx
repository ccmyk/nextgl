"use client";
import { useEffect, useRef } from "react";
import initHomeIntro from "@/legacy/views/Home/intro";

export default function HomeIntro() {
  const el = useRef(null);
  useEffect(() => {
    const cleanup = initHomeIntro(el.current);
    return () => cleanup?.();
  }, []);
  return <section ref={el} className="home-intro" />;
}