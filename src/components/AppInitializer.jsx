"use client";

import { useEffect } from "react";
import browser from "@/lib/startup/browser.js";
import { initWebGL } from "@/lib/webgl.js";

export default function AppInitializer() {
  useEffect(() => {
    const globalSettings = browser.browserCheck();
    console.log("📡 Browser settings:", globalSettings);

    if (globalSettings.webgl) {
      const canvas = document.querySelector("#webglCanvas");
      if (canvas) initWebGL(canvas);
    }
  }, []);

  return null; // This component is only for side-effects
}