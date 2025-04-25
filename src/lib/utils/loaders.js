// src/utils/loaders.js
"use client"

/**
 * Port of legacy loads.js utilities:
 *  - timeout
 *  - loadRestApi, loadImage, loadImages, newImages
 *  - loadVideo, loadVideos, newVideos
 *  - scaleLoads
 *
 * All functions accept necessary parameters instead of `this`.
 */

export function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function loadRestApi(main, url, id = "", temp = "") {
  if (process.env.NODE_ENV === "development") {
    console.log(
      url + id + `?device=${main.device}&webp=${main.webp}&webgl=${main.webgl}&template=${temp}`
    );
  }
  const params = `?device=${main.device}&webp=${main.webp}&webgl=${main.webgl}${
    temp ? `&template=${temp}` : ""
  }`;
  const response = await fetch(`${url}${id}${params}`);
  return await response.json();
}

export async function loadImages() {
  const imagesWait = document.querySelectorAll("img.Wait");
  const imagePromises = Array.from(imagesWait).map((img) => loadImage(img));
  await Promise.all(imagePromises);
  const imagesNoWait = document.querySelectorAll("img:not(.Wait)");
  scaleLoads(imagesNoWait);
}

export async function newImages() {
  return document.querySelectorAll("img");
}

export async function loadImage(elem, nowait = false) {
  if (elem.tagName === "IMG") {
    return new Promise((resolve) => {
      if (elem.dataset.src) {
        elem.src = elem.dataset.src;
      }
      elem.onload = () => resolve(elem);
      elem.onerror = () => resolve(elem);
    });
  } else if (elem.tagName === "VIDEO") {
    return new Promise((resolve) => {
      if (!elem.dataset.lazy) {
        elem.play().then(() => resolve(elem));
      } else {
        elem.oncanplay = () => resolve(elem);
      }
    });
  }
  return elem;
}

export async function loadVideos() {
  const vids = document.querySelectorAll("video");
  const promises = Array.from(vids).map((v) => loadVideo(v));
  await Promise.all(promises);
}

export async function newVideos() {
  return document.querySelectorAll("video");
}

export async function loadVideo(elem, nowait = false) {
  return loadImage(elem, nowait);
}

export function scaleLoads(elements) {
  elements.forEach((el) => {
    const naturalW = el.naturalWidth;
    const naturalH = el.naturalHeight;
    const wrapper = el.closest(".Sc");
    if (wrapper) {
      wrapper.style.width = `${naturalW}px`;
      wrapper.style.height = `${naturalH}px`;
    }
  });
}