import autoBind from "autobind";
import Lenis from "lenis";

// Components
import Nav from "@/components/NavComponent";
import Loader from "@/components/LoaderComponent";

// WebGL
import gl from "@/lib/webgl/webgl_core.js";

// Mouse
import Mouse from "@/components/MouseComponent";

// Views & Events
import { createViews } from "@/animations/views";
import { onPopState, onChange, onRequest, newView, resetLinks } from "@/animations/pop";
import { addEvents, onResize } from "@/animations/events";

// Animations
import { writeFn, writeCt } from "@/animations/anims";

class App {
  constructor(info) {
    autoBind(this);

    this.content = document.querySelector("#content");
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

    this.initApp(info[1], info[1].texs);
  }

  async initApp(temps, texs) {
    this.addEvents();

    // Initialize Lenis
    this.lenis = new Lenis({
      wheelEventsTarget: document.documentElement,
      lerp: 0.04,
      duration: 0.8,
      smoothWheel: !this.main.isTouch,
      smoothTouch: false,
      normalizeWheel: true,
    });

    this.lenis.stop();
    if (!this.main.isTouch) this.createScrollBar();

    this.createScrollCheck();

    // Loader
    let time = import.meta.env.DEV ? 1400 : 1400;
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
  }

  async firstView() {
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

    this.lenis.start();
    this.addControllers();

    this.isload = 0;
  }

  controlScroll(state) {
    if (!this.page) return false;

    if (state === 0) {
      this.lenis.stop();
      this.page.stopScroll();
    } else {
      this.lenis.start();
      this.page.startScroll();
    }
  }

  update(time) {
    if (this.lenis) this.lenis.raf(time);

    this.page?.update(this.speed, this.lenis.scroll);
    this.nav?.update(time);
    this.mouse?.update();
    this.gl?.update(time, this.speed, this.lenis.scroll);

    gsap.updateRoot(time / 1000);

    this.upid = window.requestAnimationFrame(this.update);
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