'use client';

import autoBind from "autobind";
// Lenis is now managed by LenisProvider

// Components
import Nav from "@/components/NavComponent";
import Loader from "@/components/LoaderComponent";

// WebGL
import gl from "@/lib/webgl/webgl_core.js";

// Mouse
import Mouse from "@/components/MouseComponent";

// Views & Events
import { createViews } from "@/lib/animations/views";
import { onPopState, onChange, onRequest, newView, resetLinks } from "@/lib/animations/pop";
import { addEvents, onResize } from "@/lib/animations/events";

// Animations
import { writeFn, writeCt } from "@/lib/animations/anims";
import { useLenis } from "@/components/LenisProvider";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

/**
 * App class for animation and interaction management
 * This is being phased out in favor of React components and hooks
 */
class App {
  constructor(info) {
    autoBind(this);

    // Don't execute on server-side
    if (typeof window === 'undefined') return;

    this.content = document.querySelector("#content");
    if (!this.content || !info || !info[0] || !info[1]) {
      console.error('Missing required elements for App initialization');
      return;
    }

    this.main = info[0];
    this.main.base = info[1].fields.base;
    this.main.template = info[1].fields.template;

    this.main.screen = { w: window.innerWidth, h: window.innerHeight };

    this.FR = 1000 / 60;
    this.speed = 0;
    this.wheeling = 0;
    this.isclick = 0;
    this.searching = 0;
    this.isload = 1;
    this.scry = 0;
    this.resizevar = "";
    this.url = window.location.pathname;

    // Try to get lenis from the global window object (set by LenisProvider)
    this.lenis = window.lenisInstance;

    this.initApp(info[1], info[1].texs);
  }

  async initApp(temps, texs) {
    try {
      this.addEvents();

      // Lenis is now managed by LenisProvider
      // We just need to reference it
      if (!this.lenis && window.lenisInstance) {
        this.lenis = window.lenisInstance;
      }

      if (!this.main.isTouch) this.createScrollBar();
      this.createScrollCheck();

      // Loader
      let time = process.env.NODE_ENV === 'development' ? 1400 : 1400;
      this.template = this.content.dataset.template;

      this.loader = new Loader(this.main, temps.loader, this.main.device);
      await this.loader.create();
      this.loader.start();

      let firsttemp = temps.main ?? undefined;

      // Preloading Elements
      this.pHide = document.createElement("div");
      this.pHide.className = "pHide";
      document.body.appendChild(this.pHide);

      // Pages & Navigation
      this.createViews();

      // Page Setup
      this.page = this.pages.get(this.template);
      await this.page.create(this.content, this.main, firsttemp);

      // Navigation
      this.nav = new Nav(this.main);
      this.nav.create(temps.nav);

      // Initialize Rendering
      this.update();

      await this.timeout(260);
      let funcgl = "";
      if (this.main.webgl) {
        this.gl = new gl(this.main);
        funcgl = this.gl.create(texs);
      }

      // Mouse Interaction
      if (!this.main.isTouch && typeof Mouse === "function") {
        this.mouse = new Mouse(this.main);
      }

      await Promise.all([funcgl, this.timeout(time)]);

      if (this.gl) {
        this.gl.createTemp(this.template);
      }

      this.firstView();
    } catch (error) {
      console.error('Error in initApp:', error);
    }
  }

  async firstView() {
    try {
      if (this.mouse) {
        this.mouse.create();
        this.mouse.start();
        this.mouse.reset();
      }

      await this.timeout(11);
      await this.loader.hideIntro(this.template);
      if (this.gl) {
        this.gl.loader.animstart.play();
      }
      await this.timeout(820);

      if (this.gl) {
        this.gl.show();
      }

      this.page.show();
      let state = await this.page.start(0);

      this.nav.show();

      // Start scrolling if lenis is available
      if (this.lenis) {
        this.lenis.start();
      }
      
      this.addControllers();
      this.isload = 0;
    } catch (error) {
      console.error('Error in firstView:', error);
    }
  }

  controlScroll(state) {
    if (!this.page) return false;

    try {
      if (state === 0) {
        if (this.lenis) this.lenis.stop();
        this.page.stopScroll();
        document.documentElement.classList.add('lenis-stopped');
      } else {
        if (this.lenis) this.lenis.start();
        this.page.startScroll();
        document.documentElement.classList.remove('lenis-stopped');
      }
    } catch (error) {
      console.error('Error in controlScroll:', error);
    }
  }

  update(time) {
    try {
      // Update lenis if available
      if (this.lenis) {
        this.lenis.raf(time);
      }

      // Get scroll position from lenis or default to 0
      const scrollPosition = this.lenis ? this.lenis.scroll : 0;

      // Update components
      if (this.page) this.page.update(this.speed, scrollPosition);
      if (this.nav) this.nav.update(time);
      if (this.mouse) this.mouse.update();
      if (this.gl) this.gl.update(time, this.speed, scrollPosition);

      // Update GSAP
      if (window.gsap) {
        window.gsap.updateRoot(time / 1000);
      }

      this.upid = window.requestAnimationFrame(this.update);
    } catch (error) {
      console.error('Error in update:', error);
      // Continue animation loop even if there's an error
      this.upid = window.requestAnimationFrame(this.update);
    }
  }

  timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  onPopState() {
    this.onChange({ url: window.location.pathname, push: false });
  }

  addControllers() {
    this.resetLinks();
  }
}

// Prototypes
App.prototype.createViews = createViews;
App.prototype.addEvents = addEvents;
App.prototype.onResize = onResize;
App.prototype.onPopState = onPopState;
App.prototype.onChange = onChange;
App.prototype.onRequest = onRequest;
App.prototype.newView = newView;
App.prototype.resetLinks = resetLinks;
App.prototype.writeFn = writeFn;
App.prototype.writeCt = writeCt;

export default App;