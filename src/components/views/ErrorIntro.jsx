"use client";
import { useEffect, useRef } from "react";
import initErrorIntro from "@/legacy/views/Error/intro";

export default function ErrorIntro() {
  const el = useRef(null);
  useEffect(() => {
    const cleanup = initErrorIntro(el.current);
    return () => cleanup?.();
  }, []);
  return <section ref={el} className="error-intro" />;
}