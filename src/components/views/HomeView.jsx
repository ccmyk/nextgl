"use client";
import { useEffect, useRef } from "react";
import initHome from "@/legacy/views/Home";

export default function HomeView() {
  const el = useRef(null);
  useEffect(() => {
    const cleanup = initHome(el.current);
    return () => cleanup?.();
  }, []);
  return <canvas ref={el} className="home-canvas" />;
}