// src/context/EventsContext.js
import React, { createContext, useCallback, useEffect, useState } from "react";
import { useCustomEvent } from "../hooks/useEvents";

// Define all reusable event instances
export const eventDefinitions = {
  startScroll: new Event("startscroll"),
  stopScroll: new Event("stopscroll"),
  scrollTo: new Event("scrollto", { bubbles: true, detail: { id: "" } }),
  anim: new CustomEvent("anim", {
    detail: { el: "", state: 0, style: 0, params: [0] },
  }),
  nextPrj: new CustomEvent("nextprj", { detail: { el: "", url: "" } }),
  newLinks: new Event("newlinks"),
  openMenu: new Event("openmenu"),
  closeMenu: new Event("closemenu"),
};

// React Context for managing shared state (e.g., screen size, isTouch)
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
    // Attach "resize" and "orientationchange" logic
    window.addEventListener("resize", onResize);

    if (/Android|iPhone/i.test(navigator.userAgent)) {
      window.addEventListener("orientationchange", () => {
        location.reload();
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

// Hook for managing and attaching custom event handlers dynamically
export const useGlobalEventHandlers = (scrollToFn, customHandlers) => {
  const handleEvent = (eventName, eventDetail) => {
    if (customHandlers[eventName]) {
      customHandlers[eventName](eventDetail);
    }
  };

  // Example of handling defined events
  useCustomEvent("startscroll", () => handleEvent("startScroll"));
  useCustomEvent("stopscroll", () => handleEvent("stopScroll"));
  useCustomEvent("scrollto", ({ target }) =>
    scrollToFn(target.dataset.goto, -100)
  );

  useCustomEvent("nextprj", async (e) => {
    document.body.scrollTo(0);
    await window.waiter(300);

    handleEvent("nextPrj", { url: e.detail.url, link: e.detail.el });
  });

  useCustomEvent("anim", async (e) => {
    const { el, state, style, params } = e.detail;

    if (style === 0) {
      if (!el.classList.contains("nono")) {
        handleEvent("anim", { el, state, params });
      }
    } else if (style === 1) {
      handleEvent("animScroll", { el, state, params });
    }
  });
};