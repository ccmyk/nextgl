'use client';

import gsap from "gsap";
import SplitType from "split-type";

/**
 * Get a random integer between 0 and max
 * @param {number} max - Maximum value (exclusive)
 * @returns {number} Random integer
 */
export function getRnd(max) {
  return Math.floor(Math.random() * max);
}

/**
 * Animation function for text writing effect
 * @param {HTMLElement} parent - Parent element to animate
 * @param {number} state - Animation state (0: prepare, 1: animate)
 * @returns {Promise<void>}
 */
export async function writeFn(parent, state = 0) {
  // Don't execute on server-side
  if (typeof window === 'undefined') return;
  
  if (!parent) return;
  
  try {
    if (state === 0) {
      writeCt(parent);
    } else if (state === 1) {
      let params = [0, 3];

      if (parent.dataset && parent.dataset.params) {
        params = parent.dataset.params.split(",").map((val) => parseFloat(val) || 0);
      }

      if (parent.dataset && parent.dataset.clean) {
        parent.dataset.params = parent.dataset.clean;
        delete parent.dataset.clean;
      }

      if (parent.classList.contains("Atext")) {
        const lines = parent.querySelectorAll(".line");
        if (lines && lines.length > 0) {
          for (let a of lines) {
            writeFn(a, 1);
          }
        }
      } else if (parent.classList.contains("Aline")) {
        const splits = parent.querySelectorAll(".line");
        if (splits && splits.length > 0) {
          let anim = gsap.timeline({ 
            paused: true, 
            onComplete: () => parent.classList.add("ivi") 
          });

          anim.set(parent, { opacity: 1 }, 0);

          for (let [i, a] of Array.from(splits).entries()) {
            anim.fromTo(
              a,
              { opacity: 0, yPercent: 50 },
              { opacity: 1, duration: 0.6, yPercent: 0, ease: "power4.inOut" },
              i * 0.1
            );
          }

          anim.play();
        }
      } else {
        const splits = parent.querySelectorAll(".char");
        if (!splits || splits.length === 0) return;
        
        let anim = gsap.timeline({ 
          paused: true, 
          onComplete: () => parent.classList.add("ivi") 
        });

        if (parent.dataset && parent.dataset.bucle) {
          if (parent.classList.contains("okF")) {
            params[0] = 2;
          }
          anim = gsap.timeline({
            paused: true,
            onComplete: () => {
              if (parent.classList.contains("inview")) {
                if (window.dispatchEvent && window.main && window.main.events && window.main.events.anim) {
                  window.main.events.anim.detail.state = 1;
                  window.main.events.anim.detail.el = parent;
                  document.dispatchEvent(window.main.events.anim);
                }
              }
            }
          });
        }
        
        if (parent.classList.contains("Awrite-inv")) {
          anim.to(parent, { opacity: 1, immediateRender: false, ease: "power4.inOut" }, params[0]);
        } else {
          anim.set(parent, { opacity: 1 }, 0);
        }

        let times = [.3, .05, .16, .05, .016];

        if (parent.classList.contains("line")) {
          times = [.3, .05, .16, .05, .016];
        } else if (parent.classList.contains("Ms")) {
          times = [.22, .05, .16, .05, .016];
        }
        
        anim.set(parent, { opacity: 1 }, 0);
        
        for (let [i, a] of Array.from(splits).entries()) {
          const n = a.querySelector(".n");
          if (n) {
            anim
              .set(a, { opacity: 1 }, 0)
              .to(n, { 
                opacity: 1, 
                duration: times[0], 
                immediateRender: false, 
                ease: "power4.inOut" 
              }, (i * times[1]) + params[0]);
          }

          const fElements = a.querySelectorAll(".f");
          if (fElements && fElements.length > 0) {
            for (let [u, f] of Array.from(fElements).entries()) {
              anim
                .set(f, { opacity: 0, display: "block" }, 0)
                .fromTo(
                  f,
                  { scaleX: 1, opacity: 1 },
                  { 
                    scaleX: 0, 
                    opacity: 0, 
                    immediateRender: false, 
                    duration: times[2], 
                    ease: "power4.inOut" 
                  },
                  params[0] + ((i * times[3]) + ((1 + u) * times[4]))
                )
                .set(f, { display: "none" }, ">");
            }
          }
        }

        if (params[1] === -1) {
          anim.progress(1);
        } else {
          anim.play();
        }
      }
    } else if (state === -1) {
      gsap.killTweensOf(parent);
      
      const anim = gsap.timeline({
        paused: true
      });
      
      if (parent.classList.contains("Awrite")) {
        parent.classList.remove("ivi");
        gsap.killTweensOf(parent);
        
        let splits = Array.from(parent.querySelectorAll(".char")).reverse();
        
        for (let [i, a] of splits.entries()) {
          const n = a.querySelector(".n");
          const f = a.querySelector(".f");
          
          if (f) {
            anim
              .to(f, { 
                opacity: 1, 
                scaleX: 1, 
                duration: 0.12, 
                immediateRender: false, 
                ease: "power4.inOut" 
              }, (i * 0.04));
          }
          
          anim.to(a, { 
            opacity: 0, 
            duration: 0.2, 
            immediateRender: false, 
            ease: "power4.inOut" 
          }, (i * 0.04));
        }
        
        anim.to(parent, { 
          opacity: 0, 
          duration: 0.4, 
          immediateRender: false, 
          ease: "power4.inOut" 
        }, 0.4);
      } else if (parent.classList.contains("Atext") || parent.classList.contains("Aline")) {
        parent.classList.remove("ivi");
        gsap.killTweensOf(parent);
        
        let splits = Array.from(parent.querySelectorAll(".line")).reverse();
        
        for (let [i, a] of splits.entries()) {
          anim.to(a, { 
            opacity: 0, 
            duration: 0.2, 
            immediateRender: false, 
            ease: "power4.inOut" 
          }, (i * 0.04));
        }
        
        anim.to(parent, { 
          opacity: 0, 
          duration: 0.4, 
          immediateRender: false, 
          ease: "power4.inOut" 
        }, 0.4);
      } else {
        parent.classList.remove("inview");
        parent.classList.remove("stview");
        return false;
      }
      
      anim.play();
    }
  } catch (error) {
    console.error("Error in writeFn:", error);
  }
}

/**
 * Prepares text for animation by splitting it into characters and adding fake characters
 * @param {HTMLElement} el - Element to prepare
 * @param {number} l - Number of fake characters to add
 */
export function writeCt(el, l = 2) {
  // Don't execute on server-side
  if (typeof window === 'undefined') return;
  
  if (!el) return;
  
  try {
    const fakes = '##·$%&/=€|()@+09*+]}{[';
    const fakeslength = fakes.length - 1;

    if (el.classList.contains("Atext")) {
      if (window.SplitType) {
        const spty = new window.SplitType(el.querySelectorAll(".Atext_el,p"), { types: "lines" });
      }

      const splits = el.querySelectorAll(".line");
      if (splits && splits.length > 0) {
        for (let [i, a] of Array.from(splits).entries()) {
          if (a.dataset) {
            a.dataset.params = i * 0.15;
          }
          writeCt(a, 0);
        }
      }
    } else if (el.classList.contains("Aline")) {
      if (window.SplitType) {
        const spty = new window.SplitType(el.querySelectorAll(".Aline_el,p"), { types: "lines" });
      }
    } else {
      if (window.SplitType) {
        new window.SplitType(el, { types: "chars,words" });
      }

      const splits = el.querySelectorAll(".char");
      if (splits && splits.length > 0) {
        for (let [i, a] of Array.from(splits).entries()) {
          a.innerHTML = '<span class="n">' + a.innerHTML + '</span>';

          for (let u = 0; u < l; u++) {
            const rnd = getRnd(fakeslength);
            a.insertAdjacentHTML(
              "afterbegin",
              '<span class="f" aria-hidden="true">' + fakes[rnd] + "</span>"
            );
          }
        }
      }

      el.style.opacity = 0;
    }
  } catch (error) {
    console.error("Error in writeCt:", error);
  }
}