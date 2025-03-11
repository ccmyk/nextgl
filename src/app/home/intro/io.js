"use client";

import gsap from "gsap";
import { waiter } from "@/lib/utils/animationUtils";

export default class HomeIntroIO {
  constructor(animobj, device) {
    this.DOM = {
      el: animobj.el,
    };
    this.device = device;
    this.animobj = animobj;
    this.active = 0;
    
    this.init();
  }
  
  init() {
    // Set initial state
    gsap.set(this.DOM.el, { opacity: 0, y: 20 });
  }
  
  async in() {
    if (this.active === 1) return;
    this.active = 1;
    
    // Animate in
    gsap.to(this.DOM.el, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
    });
    
    // Wait for animation to complete
    await waiter(800);
    
    // Update animation object state
    this.animobj.visible = 1;
  }
  
  async out() {
    if (this.active === 0) return;
    this.active = 0;
    
    // Animate out
    gsap.to(this.DOM.el, {
      opacity: 0,
      y: -20,
      duration: 0.6,
      ease: "power3.in",
    });
    
    // Wait for animation to complete
    await waiter(600);
    
    // Update animation object state
    this.animobj.visible = 0;
  }
}
