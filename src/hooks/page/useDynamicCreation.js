"use client";
import { useRef } from "react";

/**
 * Replace create.js:
 *  - initializes page state objects in React refs
 */
export function useDynamicCreation() {
  const ios = useRef({});
  const iosUpdaters = useRef([]);
  const updaters = useRef([]);
  const components = useRef({});

  return { ios, iosUpdaters, updaters, components };
}