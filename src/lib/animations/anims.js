import gsap from "gsap";
import SplitType from "split-type";

export function getRnd(max) {
  return Math.floor(Math.random() * max);
}

export async function writeFn(parent, state = 0) {
  if (state === 0) {
    writeCt(parent);
  } else if (state === 1) {
    let params = [0, 3];

    if (parent.dataset.params) {
      params = parent.dataset.params.split(",").map((val) => parseFloat(val) || 0);
    }

    if (parent.dataset.clean) {
      parent.dataset.params = parent.dataset.clean;
      delete parent.dataset.clean;
    }

    if (parent.classList.contains("Atext")) {
      for (let a of parent.querySelectorAll(".line")) {
        writeFn(a, 1);
      }
    } else if (parent.classList.contains("Aline")) {
      let splits = parent.querySelectorAll(".line");
      let anim = gsap.timeline({ paused: true, onComplete: () => parent.classList.add("ivi") });

      anim.set(parent, { opacity: 1 }, 0);

      for (let [i, a] of splits.entries()) {
        anim.fromTo(
          a,
          { opacity: 0, yPercent: 50 },
          { opacity: 1, duration: 0.6, yPercent: 0, ease: "power4.inOut" },
          i * 0.1
        );
      }

      anim.play();
    } else {
      let splits = parent.querySelectorAll(".char");
      let anim = gsap.timeline({ paused: true, onComplete: () => parent.classList.add("ivi") });

      if (parent.dataset.bucle) {
        if (parent.classList.contains("okF")) {
          params[0] = 2;
        }
        anim = gsap.timeline({
          paused: true,
          onComplete: () => {
            if (parent.classList.contains("inview")) {
              document.dispatchEvent(new CustomEvent("animComplete", { detail: { el: parent, state: 1 } }));
            }
          },
        });
      }

      if (parent.classList.contains("Awrite-inv")) {
        anim.to(parent, { opacity: 1, ease: "power4.inOut" }, params[0]);
      } else {
        anim.set(parent, { opacity: 1 }, 0);
      }

      // .6 first is the appearance of the word
      // .1 delay of the appearance of the first
      // .2 speed of disappearance of the letter
      // .1 delay of the appearance of the first?
      // .03 separation between letters

      let times = [0.3, 0.05, 0.16, 0.05, 0.016];

      if (parent.classList.contains("line")) {
        times = [0.3, 0.05, 0.16, 0.05, 0.016];
      } else if (parent.classList.contains("Ms")) {
        times = [0.22, 0.05, 0.16, 0.05, 0.016];
      }

      anim.set(parent, { opacity: 1 }, 0);

      for (let [i, a] of splits.entries()) {
        let n = a.querySelector(".n");
        anim.set(a, { opacity: 1 }, 0);
        anim.to(n, { opacity: 1, duration: times[0], ease: "power4.inOut" }, i * times[1] + params[0]);

        for (let [u, f] of a.querySelectorAll(".f").entries()) {
          anim
            .set(f, { opacity: 0, display: "block" }, 0)
            .fromTo(f, { scaleX: 1, opacity: 1 }, { scaleX: 0, opacity: 0, duration: times[2], ease: "power4.inOut" }, params[0] + (i * times[3] + (1 + u) * times[4]))
            .set(f, { display: "none" }, ">");
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
    const anim = gsap.timeline({ paused: true });

    if (parent.classList.contains("Awrite")) {
      parent.classList.remove("ivi");
      gsap.killTweensOf(parent);

      let splits = [...parent.querySelectorAll(".char")].reverse();

      for (let [i, a] of splits.entries()) {
        let n = a.querySelector(".n");
        let f = a.querySelector(".f");

        anim
          .to(f, { opacity: 1, scaleX: 1, duration: 0.12, ease: "power4.inOut" }, i * 0.04)
          .to(a, { opacity: 0, duration: 0.2, ease: "power4.inOut" }, i * 0.04);
      }

      anim.to(parent, { opacity: 0, duration: 0.4, ease: "power4.inOut" }, 0.4);
    } else if (parent.classList.contains("Atext") || parent.classList.contains("Aline")) {
      parent.classList.remove("ivi");
      gsap.killTweensOf(parent);

      let splits = [...parent.querySelectorAll(".line")].reverse();

      for (let [i, a] of splits.entries()) {
        anim.to(a, { opacity: 0, duration: 0.2, ease: "power4.inOut" }, i * 0.04);
      }

      anim.to(parent, { opacity: 0, duration: 0.4, ease: "power4.inOut" }, 0.4);
    } else {
      parent.classList.remove("inview");
      parent.classList.remove("stview");
      return false;
    }

    anim.play();
  }
}

export async function writeCt(el, l = 2) {
  let fakes = "##·$%&/=€|()@+09*+]}{[";
  let fakeslength = fakes.length - 1;

  if (el.classList.contains("Atext")) {
    new SplitType(el.querySelectorAll(".Atext_el, p"), { types: "lines" });

    let splits = el.querySelectorAll(".line");
    for (let [i, a] of splits.entries()) {
      a.dataset.params = i * 0.15;
      writeCt(a, 0);
    }
  } else if (el.classList.contains("Aline")) {
    new SplitType(el.querySelectorAll(".Aline_el, p"), { types: "lines" });
  } else {
    new SplitType(el, { types: "chars,words" });

    let splits = el.querySelectorAll(".char");
    for (let [i, a] of splits.entries()) {
      a.innerHTML = `<span class="n">${a.innerHTML}</span>`;
      let rnd = 0;
      for (let u = 0; u < l; u++) {
        rnd = getRnd(fakeslength);
        a.insertAdjacentHTML("afterbegin", `<span class="f" aria-hidden="true">${fakes[rnd]}</span>`);
      }
    }
  }

  el.style.opacity = 0;
}