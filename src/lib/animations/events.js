'use client';

/**
 * Event management utilities for animations
 * These functions are being phased out in favor of React hooks and component lifecycle methods
 */

/**
 * Adds event listeners to the document
 */
export function addEvents() {
  // Don't execute on server-side
  if (typeof window === 'undefined') return;
  
  try {
    const main = this.main; // Ensure correct reference to `this.main`
    const lenis = this.lenis;
    const gl = this.gl;
    const page = this.page;

    if (!main) return;

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
      if (this.controlScroll) {
        this.controlScroll(1);
      }
    });

    document.addEventListener('stopscroll', () => {
      if (this.controlScroll) {
        this.controlScroll(0);
      }
    });

    document.addEventListener('newlinks', () => {
      if (this.addLinks) {
        this.addLinks();
      }
    });

    document.addEventListener('scrollto', (e) => {
      if (lenis && e.detail && e.detail.id) {
        lenis.scrollTo('#' + e.detail.id, { offset: -100 });
      }
    });

    document.addEventListener('openmenu', () => {
      if (this.controlScroll) {
        this.controlScroll(0);
      }
    });

    document.addEventListener('closemenu', () => {
      if (this.controlScroll) {
        this.controlScroll(1);
      }
    });

    document.addEventListener('nextprj', async (e) => {
      if (!lenis || !e.detail || !e.detail.url || !e.detail.el) return;
      
      try {
        lenis.stop();
        
        if (this.page && this.page.DOM && this.page.DOM.el) {
          const nextProject = this.page.DOM.el.querySelector('.project_nxt');
          if (nextProject) {
            lenis.scrollTo(nextProject, { duration: 0.3, force: true });
          }
        }
        
        if (window.waiter) {
          await window.waiter(300);
        } else {
          await new Promise(resolve => setTimeout(resolve, 300));
        }

        if (this.onChange) {
          this.onChange({
            url: e.detail.url,
            link: e.detail.el
          });
        }
      } catch (error) {
        console.error('Error in nextprj event handler:', error);
      }
    });

    document.addEventListener('anim', async (e) => {
      if (!e.detail) return;
      
      try {
        if (e.detail.style === 0) {
          if (e.detail.el && e.detail.el.classList && e.detail.el.classList.contains('nono')) {
            return false;
          }
          
          if (this.writeFn && e.detail.el) {
            this.writeFn(e.detail.el, e.detail.state);
          }
        } else if (e.detail.style === 1) {
          if (lenis) {
            lenis.scrollTo(0);
          }
          
          if (window.waiter) {
            await window.waiter(600);
          } else {
            await new Promise(resolve => setTimeout(resolve, 600));
          }
          
          if (this.controlScroll) {
            this.controlScroll(0);
          }
          
          if (this.gl && this.gl.changeSlides) {
            await this.gl.changeSlides(e.detail.state);
            
            if (this.controlScroll) {
              this.controlScroll(1);
            }
          }
        }
      } catch (error) {
        console.error('Error in anim event handler:', error);
      }
    });

    document.addEventListener('visibilitychange', (e) => {
      if (this.isload === 1) {
        return false;
      }
      
      if (document.visibilityState === 'hidden') {
        if (lenis) {
          lenis.stop();
        }
        
        if (this.upid) {
          window.cancelAnimationFrame(this.upid);
        }
      } else {
        if (lenis) {
          lenis.start();
        }
        
        if (this.update) {
          this.update(performance.now());
        }
      }
    });

    window.addEventListener('popstate', (e) => {
      if (this.onPopState) {
        this.onPopState(e);
      }
    }, { passive: true });

    window.onresize = () => {
      if (this.res) {
        clearTimeout(this.res);
      }
      
      this.res = setTimeout(() => {
        if (this.onResize) {
          this.onResize();
        }
      }, 400);
    };

    // Handle orientation change on touch devices
    if (this.main && this.main.isTouch) {
      window.addEventListener("orientationchange", function(event) {
        location.reload();
      });
    }
  } catch (error) {
    console.error('Error in addEvents:', error);
  }
}

/**
 * Handles resize events
 */
export function onResize() {
  // Don't execute on server-side
  if (typeof window === 'undefined') return;
  
  try {
    if (!this.main || !this.main.design) return;
    
    // Calculate responsive design values
    if (this.main.design.L) {
      this.main.design.L.total = ((this.main.design.L.w / window.innerWidth) * 10);
      this.main.design.L.total = 10 - ((10 - this.main.design.L.total) * this.main.design.L.multi);
      this.main.design.L.total = Math.min(10, this.main.design.L.total);
    }
    
    if (this.main.design.P) {
      this.main.design.P.total = ((this.main.design.P.w / window.innerWidth) * 10);
      this.main.design.P.total = 10 - ((10 - this.main.design.P.total) * this.main.design.P.multi);
      this.main.design.P.total = Math.min(10, this.main.design.P.total);
    }

    // Update CSS variables
    if (this.main.design.L) {
      document.documentElement.style.setProperty("--ck_multiL", this.main.design.L.total);
    }
    
    if (this.main.design.P) {
      document.documentElement.style.setProperty("--ck_multiP", this.main.design.P.total);
    }

    // Handle touch devices
    if (this.main.isTouch) {
      document.documentElement.style.setProperty("--ck_hscr", window.screen.height + 'px');
      document.documentElement.style.setProperty("--ck_hmin", document.documentElement.clientHeight + 'px');
      
      if (window.gsap) {
        window.gsap.to(document.documentElement, {"--ck_hvar": window.innerHeight + "px", duration: 0.4});
      }
      
      const isTouch = isTouchDevice();
      if (!isTouch) {
        location.reload();
      }
    } else {
      document.documentElement.style.setProperty("--ck_hscr", window.innerHeight + 'px');
      document.documentElement.style.setProperty("--ck_hvar", window.innerHeight + 'px');
      document.documentElement.style.setProperty("--ck_hmin", window.innerHeight + 'px');
      
      const isTouch = isTouchDevice();
      if (isTouch) {
        location.reload();
      }
    }

    // Update screen dimensions
    if (this.main) {
      this.main.screen = {
        w: window.innerWidth,
        h: window.innerHeight
      };
    }

    // Update components
    if (this.gl && this.gl.onResize) {
      if (this.gl.main) {
        this.gl.main.screen = {
          w: window.innerWidth,
          h: window.innerHeight
        };
      }
      this.gl.onResize();
    }
    
    if (this.page && this.page.onResize) {
      if (this.page.main) {
        this.page.main.screen = {
          w: window.innerWidth,
          h: window.innerHeight
        };
      }
      this.page.onResize();
    }
    
    if (this.mouse && this.mouse.main) {
      this.mouse.main.screen = {
        w: window.innerWidth,
        h: window.innerHeight
      };
    }
    
    if (this.nav && this.nav.onResize) {
      if (this.nav.main) {
        this.nav.main.screen = {
          w: window.innerWidth,
          h: window.innerHeight
        };
      }
      this.nav.onResize();
    }
  } catch (error) {
    console.error('Error in onResize:', error);
  }
}

/**
 * Helper function to check for touch devices
 * @returns {boolean} True if the device is a touch device
 */
export function isTouchDevice() {
  return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}
