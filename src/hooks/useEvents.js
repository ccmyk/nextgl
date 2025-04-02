// src/hooks/useEvents.js
import { useEffect } from "react";

// Hook for attaching and detaching custom DOM events
export const useCustomEvent = (eventName, eventHandler) => {
  useEffect(() => {
    const handleEvent = (e) => eventHandler(e);

    document.addEventListener(eventName, handleEvent, false);

    return () => {
      document.removeEventListener(eventName, handleEvent, false);
    };
  }, [eventName, eventHandler]);
};

// Hook for attaching and detaching window (global) events
export const useWindowEvent = (eventType, callback) => {
  useEffect(() => {
    window.addEventListener(eventType, callback, false);

    return () => {
      window.removeEventListener(eventType, callback, false);
    };
  }, [eventType, callback]);
};