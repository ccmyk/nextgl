"use client";

import gsap from "gsap";
import SplitType from "split-type"; // Handles text splitting
import styles from "@/styles/pages/home.module.css"; // Hero section styles

export default class HomeIntro {
  constructor(el, device) {
    this.DOM = {
      el: el,
    };
    this.device = device;
    this.active = 0;

    this.create();
  }

  async create() {
    // Initialize any required setup
    console.log("Home intro component initialized");
  }
  
  async start() {
    if (this.active === 1) return;
    this.active = 1;
    
    // Create text splitting animation
    const text = new SplitType(this.DOM.el, { types: "chars, words" });
    
    // Animate the text
    gsap.from(text.chars, {
      opacity: 0,
      y: 50,
      stagger: 0.05,
      duration: 1,
      ease: "power3.out",
    });
  }
  
  initEvents() {
    // Initialize any event listeners
  }

  removeEvents() {
    // Clean up event listeners
  }

  onResize() {
    // Handle resize events
  }
}