"use client";
import { useEffect } from "react";
import gsap from "gsap";

export default function PageTransition({ children }) {
  useEffect(() => {
    gsap.fromTo(
      "body",
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: "power2.inOut" }
    );
  }, []);

  return <div>{children}</div>;
}