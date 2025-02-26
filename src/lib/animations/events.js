export function addEvents() {
  const main = this.main; // Ensure correct reference to `this.main`
  const lenis = this.lenis;
  const gl = this.gl;
  const page = this.page;

  // Define custom events
  main.events = {
    startscroll: new Event('startscroll'),
    stopscroll: new Event('stopscroll'),
    scrollto: new CustomEvent('scrollto', {
      bubbles: true,
      detail: { id: '' },
    }),
    anim: new CustomEvent('anim', {
      detail: {
        el: '',
        state: 0,
        style: 0,
        params: [0],
      },
    }),
    nextprj: new CustomEvent('nextprj', {
      detail: {
        el: '',
        url: '',
      },
    }),
    newlinks: new Event('newlinks'),
    openmenu: new Event('openmenu'),
    closemenu: new Event('closemenu'),
  };

  // Event listeners
  document.addEventListener('startscroll', () => {
    this.controlScroll(1);
  });

  document.addEventListener('stopscroll', () => {
    this.controlScroll(0);
  });

  document.addEventListener('newlinks', () => {
    this.addLinks();
  });

  document.addEventListener('scrollto', (e) => {
    if (lenis) {
      lenis.scrollTo('#' + e.detail.id, { offset: -100 });
    }
  });

  document.addEventListener('openmenu', () => {
    this.controlScroll(0);
  });

  document.addEventListener('closemenu', () => {
    this.controlScroll(1);
  });

  document.addEventListener('nextprj', async (e) => {
    if (!lenis || !page) return;

    lenis.stop();
    lenis.scrollTo(page.DOM.el.querySelector('.project_nxt'), { duration: 0.3, force: true });

    await this.timeout(300);

    this.onChange({
      url: e.detail.url,
      link: e.detail.el,
    });
  });

  document.addEventListener('anim', async (e) => {
    if (e.detail.style === 0) {
      if (e.detail.el.classList.contains('nono')) return;
      this.writeFn(e.detail.el, e.detail.state);
    } else if (e.detail.style === 1) {
      lenis.scrollTo(0);
      await this.timeout(600);
      this.controlScroll(0);

      Promise.all([gl?.changeSlides(e.detail.state)]).then(() => {
        this.controlScroll(1);
      });
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (this.isload === 1) return;

    if (document.visibilityState === 'hidden') {
      lenis.stop();
      window.cancelAnimationFrame(this.upid);
    } else {
      lenis.start();
      this.update(performance.now());
    }
  });

  window.addEventListener('popstate', (e) => this.onPopState(e), { passive: true });

  window.onresize = () => {
    clearTimeout(this.res);
    this.res = setTimeout(() => this.onResize(), 400);
  };

  if (main.isTouch) {
    window.addEventListener('orientationchange', () => {
      location.reload();
    });
  }
}

// Resize Event
export function onResize() {
  const main = this.main;

  main.design.L.total = (main.design.L.w / window.innerWidth) * 10;
  main.design.L.total = 10 - (10 - main.design.L.total) * main.design.L.multi;
  main.design.L.total = Math.min(10, main.design.L.total);

  main.design.P.total = (main.design.P.w / window.innerWidth) * 10;
  main.design.P.total = 10 - (10 - main.design.P.total) * main.design.P.multi;
  main.design.P.total = Math.min(10, main.design.P.total);

  document.documentElement.style.setProperty('--ck_multiL', main.design.L.total);
  document.documentElement.style.setProperty('--ck_multiP', main.design.P.total);

  if (main.isTouch) {
    document.documentElement.style.setProperty('--ck_hscr', `${window.screen.height}px`);
    document.documentElement.style.setProperty('--ck_hmin', `${document.documentElement.clientHeight}px`);

    gsap.to(document.documentElement, { '--ck_hvar': `${window.innerHeight}px`, duration: 0.4 });

    if (!isTouchDevice()) {
      location.reload();
    }
  } else {
    document.documentElement.style.setProperty('--ck_hscr', `${window.innerHeight}px`);
    document.documentElement.style.setProperty('--ck_hvar', `${window.innerHeight}px`);
    document.documentElement.style.setProperty('--ck_hmin', `${window.innerHeight}px`);

    if (isTouchDevice()) {
      location.reload();
    }
  }

  // Update screen sizes across main components
  main.screen.w = window.innerWidth;
  main.screen.h = window.innerHeight;

  if (this.gl && this.gl.onResize) {
    this.gl.main.screen.w = window.innerWidth;
    this.gl.main.screen.h = window.innerHeight;
    this.gl.onResize();
  }

  if (this.page) {
    this.page.main.screen.w = window.innerWidth;
    this.page.main.screen.h = window.innerHeight;
    this.page.onResize();
  }

  if (this.mouse) {
    this.mouse.main.screen.w = window.innerWidth;
    this.mouse.main.screen.h = window.innerHeight;
  }

  if (this.nav) {
    this.nav.main.screen.w = window.innerWidth;
    this.nav.main.screen.h = window.innerHeight;
    this.nav.onResize();
  }
}

// Helper function to check for touch devices
function isTouchDevice() {
  return (
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}
