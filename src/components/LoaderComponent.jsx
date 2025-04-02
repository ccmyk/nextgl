// Path: src/components/LoaderComponent.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * A modern Loader Component integrated with main.events for handling animations and interactivity.
 */
const LoaderComponent = ({ template = "", onComplete, mainEvents }) => {
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const loaderRef = useRef(null); // Reference to the loader element for animations
  const objRef = useRef({ num: 0 }); // Reference for GSAP animation object

  /**
   * Updates the number displayed in the loader.
   * @param {number} num - The current number in the animation.
   */
  const updateDisplayedNumber = (num) => {
    const formattedNum = num < 10 ? `00${num}` : num < 100 ? `0${num}` : num;
    const numberElement = loaderRef.current?.querySelector(".loader_tp");
    if (numberElement) {
      numberElement.textContent = formattedNum;
    }
  };

  /**
   * Creates and returns the GSAP timeline for the loader.
   */
  const createAnimation = () => {
    return gsap.timeline({ paused: true })
      .fromTo(
        objRef.current,
        { num: 0 },
        {
          num: 42,
          duration: 2,
          ease: "none",
          onUpdate: () => updateDisplayedNumber(objRef.current.num),
        }
      )
      .to(
        objRef.current,
        {
          num: 100,
          duration: 8,
          ease: "power2.inOut",
          onUpdate: () => updateDisplayedNumber(objRef.current.num),
        },
        "+=0.5" // Delay before next animation
      );
  };

  useEffect(() => {
    if (!template) return;

    // Inject the loader template into the DOM
    const el = document.createElement("div");
    el.innerHTML = template.trim();
    document.body.prepend(el);
    loaderRef.current = el.querySelector(".loader");

    // Prepare the GSAP animation
    const loaderAnimation = createAnimation();

    // Integrate with main.events for additional animations
    if (mainEvents?.anim) {
      const animatedElements = loaderRef.current.querySelectorAll(".Awrite");
      const triggerAnimation = (el, state) => {
        mainEvents.anim.detail.state = state;
        mainEvents.anim.detail.el = el;
        document.dispatchEvent(mainEvents.anim);
      };

      // Trigger initial animations
      animatedElements.forEach((el) => triggerAnimation(el, 0));

      // Cleanup animations on unmount
      return () => {
        animatedElements.forEach((el) => triggerAnimation(el, -1)); // Reset state
        el.remove();
      };
    }

    // Play GSAP animation and mark loading complete
    loaderAnimation.play().then(() => {
      setIsLoading(false);
      if (typeof onComplete === "function") {
        onComplete(); // Notify parent when loading completes
      }
    });

    return () => {
      el.remove(); // Clean up loader template from the DOM
    };
  }, [template, mainEvents]);

  return isLoading ? <div className="loader-wrapper" /> : null; // Renderless component
};

export default LoaderComponent;