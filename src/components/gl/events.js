"use client";

export function onResize() {
  for (let [, element] of this.iosmap.entries()) {
    if (element.onResize) element.onResize(this.viewport, this.main.screen);
  }

  if (this.loader) {
    this.loader.onResize(this.viewport, this.main.screen);
  }
}

export function update(time, wheel, pos) {
  if (this.loader) {
    if (this.loader.active !== 0) {
      this.loader.update(time, wheel, pos);
    } else {
      this.loader.removeEvents();
      delete this.loader;
    }
  }

  if (!this.isVisible) return false;

  this.iosmap.forEach((element) => {
    if (element.active === 1) {
      element.update(time, wheel, pos);
    }
  });
}

export function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function loadImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "";

    img.onload = () => resolve(img);
    img.onerror = () => resolve(img);

    img.src = url;
  });
}

function cleanVideoElement(element) {
  element.oncanplay = null;
  element.onplay = null;
  element.currentTime = 0;
  element.pause();
}

export async function loadVideo(element, url) {
  return new Promise((resolve) => {
    element.loop = !element.dataset.loop;
    element.muted = true;
    element.autoplay = true;

    element.onplay = () => (element.isPlaying = true);
    element.oncanplay = () => {
      if (element.isPlaying) {
        element.classList.add("Ldd");
        cleanVideoElement(element);
        resolve(element);
      }
    };

    element.onerror = () => resolve(element);
    element.src = url;
    element.play();
  });
}

export default {
  onResize,
  update,
  timeout,
  loadImage,
  loadVideo,
};