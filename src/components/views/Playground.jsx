"use client";
import { useEffect, useRef } from "react";
import initPlayground from "@/legacy/views/Playground";

export default function Playground() {
  const el = useRef(null);
  useEffect(() => {
    const cleanup = initPlayground(el.current);
    return () => cleanup?.();
  }, []);
  return <div ref={el} className="playground-view" />;
}