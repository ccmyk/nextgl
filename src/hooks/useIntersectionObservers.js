"use client";

export default function useIntersectionObservers() {
  const setupObservers = (container) => {
    // Example of applying observers to elements
    const elements = container.querySelectorAll(".iO-scroll, .iO-home");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;

          if (target.classList.contains("iO-scroll")) {
            // Example scroll animation logic
            console.log("Scroll animation triggered:", target);
          }
          if (target.classList.contains("iO-home")) {
            // Example Home animation
            console.log("Home animation triggered:", target);
          }
        }
      });
    });

    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect(); // Cleanup
    };
  };

  return { setupObservers };
}