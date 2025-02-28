"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

export default function PageTransition({ children }) {
  const pathname = usePathname();
  const pageRef = useRef(null);
  const prevPathRef = useRef(pathname);

  // Handle page transitions
  useEffect(() => {
    // Skip initial render
    if (prevPathRef.current === pathname) {
      // Initial page load animation
      gsap.fromTo(
        pageRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
      return;
    }

    // Create transition timeline
    const tl = gsap.timeline({
      onComplete: () => {
        // Update previous path
        prevPathRef.current = pathname;
      }
    });

    // Exit animation
    tl.to(pageRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.4,
      ease: "power2.in"
    });

    // Enter animation
    tl.fromTo(
      pageRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      0.5
    );

  }, [pathname]);

  return (
    <div className="page-transition" ref={pageRef}>
      {children}
    </div>
  );
}