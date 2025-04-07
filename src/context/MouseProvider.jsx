// src/context/MouseProvider.jsx

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const MouseContext = createContext();

export const MouseProvider = ({ children }) => {
  const mouseRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = mouseRef.current;
    if (!el) return;

    const setX = gsap.quickTo(el, "x", { duration: 0.1, ease: "power2.out" });
    const setY = gsap.quickTo(el, "y", { duration: 0.1, ease: "power2.out" });

    const moveMouse = (e) => {
      setCoords({ x: e.clientX, y: e.clientY });
      setX(e.clientX);
      setY(e.clientY);
    };

    document.addEventListener("mousemove", moveMouse);
    return () => document.removeEventListener("mousemove", moveMouse);
  }, []);

  return (
    <MouseContext.Provider value={{ mouseRef, coords }}>
      {children}
    </MouseContext.Provider>
  );
};

export const useMouse = () => useContext(MouseContext);
