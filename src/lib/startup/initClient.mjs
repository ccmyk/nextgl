// src/lib/startup/initClient.mjs

import { browserCheck, glCheck } from './browser.js';
import { loadRestApi } from './loadRestApi.mjs';
import App from '@/lib/animations/index.js'; // or wherever App class is

import gsap from 'gsap';
import SplitType from 'split-type';

// Provide these globally as legacy code depends on them
window.gsap = gsap;
gsap.ticker.remove(gsap.updateRoot);
window.SplitType = SplitType;

// Lerp & Clamp helpers used globally
window.lerp = (p1, p2, t) => p1 + (p2 - p1) * t;
window.clamp = (min, max, num) => Math.min(Math.max(num, min), max);
window.waiter = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function initClient() {
  const main = browserCheck();
  main.webgl = glCheck() ? 1 : 0;
  if (main.webgl === 0) document.documentElement.classList.add('AND');

  // CSS vars setup
  const { L, P } = {
    L: { w: 1440, h: 800, multi: 0.4, total: 0, ratio: 5.56 },
    P: { w: 390, h: 640, multi: 0.4, total: 0 },
  };

  L.total = Math.min(10, 10 - ((10 - ((L.w / window.innerWidth) * 10)) * L.multi));
  P.total = Math.min(10, 10 - ((10 - ((P.w / window.innerWidth) * 10)) * P.multi));

  main.design = { L, P };

  document.documentElement.style.setProperty('--ck_multiL', L.total);
  document.documentElement.style.setProperty('--ck_multiP', P.total);
  document.documentElement.style.setProperty('--ck_accent', '#fff');
  document.documentElement.style.setProperty('--ck_other', '#050505');

  if (main.isTouch) {
    document.documentElement.style.setProperty('--ck_hscr', `${window.screen.height}px`);
    document.documentElement.style.setProperty('--ck_hvar', `${window.innerHeight}px`);
    document.documentElement.style.setProperty('--ck_hmin', `${document.documentElement.clientHeight}px`);
  } else {
    const h = `${window.innerHeight}px`;
    document.documentElement.style.setProperty('--ck_hscr', h);
    document.documentElement.style.setProperty('--ck_hvar', h);
    document.documentElement.style.setProperty('--ck_hmin', h);
  }

  const content = document.querySelector('#content');
  const temps = await loadRestApi({
    url: `${document.body.dataset.js}/wp-json/csskiller/v1/options`,
    device: main.device,
    webp: main.webp,
    id: content.dataset.id,
    template: content.dataset.template,
    webgl: main.webgl,
  });

  // Font loading – replace FontFaceObserver
  document.fonts.load('1em montrealbook');
  document.fonts.load('1em montreal');

  const app = new App([main, temps]);
}