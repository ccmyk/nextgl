"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import SplitType from "split-type"; // Handles text splitting
import styles from "@/styles/pages/home.pcss"; // Hero section styles

const Intro = ({ element }) => {
  const introRef = useRef(null);

  useEffect(() => {
    if (introRef.current) {
      console.log("Intro animation initialized");

      // GSAP Animation for Hero Text
      const text = new SplitType(introRef.current, { types: "chars, words" });
      gsap.from(text.chars, {
        opacity: 0,
        y: 50,
        stagger: 0.05,
        duration: 1,
        ease: "power3.out",
      });
    }
  }, []);

  return (
    <div ref={introRef} className={styles.home_hero}>
      {element}
    </div>
  );
};

export default Intro;