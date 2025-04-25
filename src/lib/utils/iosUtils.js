// src/utils/iosUtils.js
"use client";

import lazyVideo from "@/webgl/hooks/lazyVideo";
import lazyImg from "@/webgl/hooks/lazyImg";

/**
 * Port of legacy ios.js:
 *  - buildThresholdList
 *  - checkIo, callIos, createIos, newIos, iOpage, iO, inViewAddClass, showIos
 */

export function buildThresholdList(numSteps) {
  const thresholds = [];
  for (let i = 1; i <= numSteps; i++) {
    thresholds.push(i / numSteps);
  }
  thresholds.push(0);
  return thresholds;
}

export function checkIo(entry, page) {
  const key = entry.target.dataset.ioKey;
  if (!key) return;
  page.iosupdaters.push(key);
  page.ios[key].class.update(window.scrollY);
}

export function callIos(page) {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((ent) => checkIo(ent, page)),
    { threshold: buildThresholdList(10) }
  );
  Object.values(page.ios).forEach((el) => observer.observe(el));
}

export function createIos(key, element, page) {
  page.ios[key] = { el: element, class: lazyImg(element) };
}

export function newIos(page) {
  document
    .querySelectorAll("[data-io]")
    .forEach((el) => createIos(el.dataset.io, el, page));
}

export function iOpage(page) {
  newIos(page);
  callIos(page);
}

export function inViewAddClass(el, className) {
  if (window.scrollY > el.offsetTop) {
    el.classList.add(className);
  }
}

export function showIos(page) {
  inViewAddClass(page.DOM.el, "visible");
}