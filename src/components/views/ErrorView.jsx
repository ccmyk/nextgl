"use client";
import { useEffect, useRef } from "react";
import initErrorView from "@/legacy/views/Error";

export default function ErrorView() {
  const el = useRef(null);
  useEffect(() => {
    const cleanup = initErrorView(el.current);
    return () => cleanup?.();
  }, []);
  return <div ref={el} className="error-view" />;
}