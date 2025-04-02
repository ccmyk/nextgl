// src/lib/utils/pageLoads.js
"use client";

/**
 * Asset loading utilities for images and videos
 * These functions are being phased out in favor of Next.js Image and Video components
 * along with React hooks for loading states
 */

export function timeout(ms){
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Loads data from a REST API endpoint
 * @param {string} url - Base URL for the API endpoint
 * @param {string} id - Optional ID to append to the URL
 * @param {string} temp - Optional template parameter
 * @returns {Promise<Object>} - JSON response from the API
 */
export async function loadRestApi(url, id='', temp=''){
  // Don't execute if we're on the server
  if (typeof window === 'undefined') return;
  
  // Use environment variables for API URL if available
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || url;
  
  if (process.env.NODE_ENV === 'development'){
    console.log(`${apiUrl}${id}?device=${this.main?.device || ''}&webp=${this.main?.webp || ''}&template=${temp}`);
  }

  let formData = new FormData();
  let info = {
    device: this.main?.device || 'desktop',
    webp: this.main?.webp || false,
    webgl: this.main?.webgl || false
  };

  if (temp !== ''){
    info.template = temp;
  }

  formData.set("form", JSON.stringify(info));

  try {
    if (document.body.dataset.nonce){
      const response = await fetch(apiUrl + id, {
        method: "POST",
        body: formData,
        headers: {
          'X-WP-Nonce': document.body.dataset.nonce,
        }
      });

      return await response.json();
    }
    else {
      let queryUrl = `${apiUrl}${id}?device=${info.device}&webp=${info.webp}&webgl=${info.webgl}`;
      
      if (temp !== ''){
        queryUrl += `&template=${temp}`;
      }
      
      const response = await fetch(queryUrl, {
        method: "GET",
      });
      
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error('Error loading from REST API:', error);
    return { error: true, message: error.message };
  }
}

/**
 * Loads all images on the page
 */
export async function loadImages(){
  // Don't execute if we're on the server
  if (typeof window === 'undefined') return;
  
  if (!this.DOM) return;
  
  this.DOM.images = document.querySelectorAll('img');
  const imageswait = document.querySelectorAll('img.Wait');
  const imagesnowait = document.querySelectorAll('img:not(.Wait)');
  
  let promiseswait = [];
  for (let path of imageswait){
    if (typeof this.loadImage === 'function') {
      promiseswait.push(this.loadImage(path));
    }
  }

  await Promise.all(promiseswait);
  if (typeof this.scaleLoads === 'function') {
    this.scaleLoads(imagesnowait);
  }
}

/**
 * Loads non-lazy elements (images and videos)
 */
export async function scaleLoads(elswait){
  // Don't execute if we're on the server
  if (typeof window === 'undefined') return;

  for (let path of elswait){
    if (path.tagName === 'IMG'){
      if (!path.dataset.lazy && typeof this.loadImage === 'function'){
        await this.loadImage(path);
      }
    }
    else if (path.tagName === 'VIDEO'){
      if (!path.dataset.lazy && typeof this.loadVideo === 'function'){
        await this.loadVideo(path);
        path.classList.add('Ldd');
      }
    }
  }
}

/**
 * Loads new images that have been added to the DOM
 */
export async function newImages(){
  // Don't execute if we're on the server
  if (typeof window === 'undefined') return;
  
  if (!this.DOM) return;
  
  const newimages = document.querySelectorAll('img');
  let images1 = Array.prototype.slice.call(newimages);
  let images2 = Array.prototype.slice.call(this.DOM.images || []);
  
  let imagesfiltered = images1.filter(val => !images2.includes(val));
  let promises = [];
  
  for (let path of imagesfiltered){
    if (path.classList.contains('Wait') && typeof this.loadImage === 'function'){
      promises.push(this.loadImage(path));
    }
    else if (typeof this.loadImage === 'function'){
      this.loadImage(path, 1);
    }
  }

  await Promise.all(promises);
  if (this.DOM.el) {
    this.DOM.images = this.DOM.el.querySelectorAll('img');
  }
}

/**
 * Loads a single image
 * @param {HTMLImageElement} elem - The image element to load
 * @param {boolean} nowait - Whether to wait for the image to load
 * @returns {Promise<HTMLImageElement>} - Promise that resolves when the image is loaded
 */
export async function loadImage(elem, nowait = null) {
  // Don't execute if we're on the server
  if (typeof window === 'undefined') return;
  
  return new Promise((resolve, reject) => {
    if (!elem) {
      resolve(null);
      return;
    }
    
    if (elem.getAttribute('src')){
      resolve(elem);
      return false;
    }
    
    let img = new Image();
    let url = '';
    
    if (elem.dataset.src){
      url = elem.dataset.src;
    }
    
    let gif = 0;
    if (/\.(gif)$/.test(url)){
      gif = 1;
    }

    elem.onload = () => {
      elem.classList.add('Ldd');
      delete elem.dataset.src;
      resolve(elem);
    };

    elem.onerror = () => {
      resolve(elem);
    };

    img.onload = () => {
      elem.src = url;
    };

    img.onerror = () => {
      elem.src = url;
      resolve(elem);
    };

    img.src = url;
    if (gif === 1){
      elem.src = url;
      elem.classList.add('Ldd');
    }
  });
}

/**
 * Loads all videos on the page
 */
export async function loadVideos(){
  // Don't execute if we're on the server
  if (typeof window === 'undefined') return;
  
  if (!this.DOM || !this.DOM.el) return;
  
  this.DOM.videos = this.DOM.el.querySelectorAll('video');
  const videoswait = this.DOM.el.querySelectorAll('video.Wait');
  const videosnowait = this.DOM.el.querySelectorAll('video:not(.Wait)');
  
  let promiseswait = [];
  for (let path of videoswait){
    if (typeof this.loadVideo === 'function') {
      promiseswait.push(this.loadVideo(path));
    }
  }
  
  await Promise.all(promiseswait);
  if (typeof this.scaleLoads === 'function') {
    this.scaleLoads(videosnowait);
  }
}

/**
 * Loads new videos that have been added to the DOM
 */
export async function newVideos(){
  // Don't execute if we're on the server
  if (typeof window === 'undefined') return;
  
  if (!this.DOM || !this.DOM.el) return;
  
  const newvideos = this.DOM.el.querySelectorAll('video');
  let videos1 = Array.prototype.slice.call(newvideos);
  let videos2 = Array.prototype.slice.call(this.DOM.videos || []);
  
  let videosfiltered = videos1.filter(val => !videos2.includes(val));
  let promises = [];
  
  for (let path of videosfiltered){
    if (path.classList.contains('Wait') && typeof this.loadVideo === 'function'){
      promises.push(this.loadVideo(path));
    }
    else if (typeof this.loadVideo === 'function'){
      this.loadVideo(path, 1);
    }
  }

  await Promise.all(promises);
  if (this.DOM.el) {
    this.DOM.videos = this.DOM.el.querySelectorAll('video');
  }
}

/**
 * Cleans up a video element
 * @param {HTMLVideoElement} elem - The video element to clean
 */
export function cleanVid(elem){
  // Don't execute if we're on the server
  if (typeof window === 'undefined') return;
  
  if (!elem) return;
  
  elem.pause();
  elem.removeAttribute('src');
  elem.load();
}

/**
 * Loads a single video
 * @param {HTMLVideoElement} elem - The video element to load
 * @param {boolean} nowait - Whether to wait for the video to load
 * @returns {Promise<HTMLVideoElement>} - Promise that resolves when the video is loaded
 */
export async function loadVideo(elem, nowait = false) {
  // Don't execute if we're on the server
  if (typeof window === 'undefined') return;
  
  return new Promise((resolve, reject) => {
    if (!elem) {
      resolve(null);
      return;
    }
    
    if (elem.getAttribute('src')){
      resolve(elem);
      return false;
    }
    
    let url = '';
    if (elem.dataset.src){
      url = elem.dataset.src;
    }
    
    elem.oncanplay = () => {
      elem.classList.add('Ldd');
      delete elem.dataset.src;
      resolve(elem);
    };

    elem.onerror = () => {
      resolve(elem);
    };
    
    if (elem.dataset.auto){
      elem.loop = true;
      elem.muted = true;
      elem.setAttribute('webkit-playsinline', 'webkit-playsinline');
      elem.setAttribute('playsinline', 'playsinline');
      
      if (this.main && this.main.isTouch){
        elem.setAttribute('autoplay', 'true');
      }
      else{
        elem.autoplay = true;
      }
    }
    
    elem.src = url;
    elem.load();
    
    if (nowait){
      resolve(elem);
    }
  });
}