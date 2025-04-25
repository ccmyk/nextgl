"use client";
import { useEffect, useRef } from "react";
import initProjectIOIn from "@/legacy/views/Project/ioin";

export default function ProjectIOIn() {
  const el = useRef(null);
  useEffect(() => {
    const cleanup = initProjectIOIn(el.current);
    return () => cleanup?.();
  }, []);
  return <section ref={el} className="project-ioin" />;
}