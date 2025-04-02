// src/lib/events.js

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export const EventsContext = createContext();

export const EventsProvider = ({ children }) => {
  const [state, setState] = useState({
    isTouch: false,
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
  });

  const onResize = useCallback(() => {
    const newScreenWidth = window.innerWidth;
    const newScreenHeight = window.innerHeight;

    setState((prevState) => ({
      ...prevState,
      screenWidth: newScreenWidth,
      screenHeight: newScreenHeight,
      isTouch: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ),
    }));

    document.documentElement.style.setProperty("--ck_hscr", `${newScreenHeight}px`);
    document.documentElement.style.setProperty("--ck_hvar", `${newScreenHeight}px`);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", onResize);

    if (/Android|iPhone/i.test(navigator.userAgent)) {
      window.addEventListener("orientationchange", () => {
        window.location.reload();
      });
    }

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [onResize]);

  return (
    <EventsContext.Provider value={{ state, onResize }}>
      {children}
    </EventsContext.Provider>
  );
};