"use client";

export function callIos() {
  this.obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (this.iosmap.has(entry.target.dataset.oi)) {
        this.checkIo(entry.target.dataset.oi, entry);
      }
    });
  });

  this.ios.forEach((element) => {
    this.obs.observe(element);
  });
}

export async function loadIos() {
  await Promise.all(
    Array.from(this.iosmap.values()).map((element) => element.load())
  );
}

export function showIos() {
  this.iosmap.forEach((element) => {
    element.el.style.visibility = "visible";
  });
}

export default {
  callIos,
  loadIos,
  showIos,
};