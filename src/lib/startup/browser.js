// src/lib/startup/browser.js

export function browserCheck() {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }

  const isTouch = /Mobi|Android|Tablet|iPad|iPhone/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  const w = window.innerWidth;
  const h = window.innerHeight;

  let devnum = 0;
  let devicec = '';

  if (!isTouch) {
    devicec = 'desktop';
    devnum = 0;
    document.documentElement.classList.add('D');
    if (w > 1780) devnum = -1;
  } else {
    devicec = 'mobile';
    devnum = 3;
    if (w > 767) {
      devicec = w > h ? 'tabletL' : 'tabletS';
      devnum = w > h ? 1 : 2;
    }
    document.documentElement.classList.add('T', devicec);
  }

  const canvas = document.createElement('canvas');
  const isWebPCheck = canvas.getContext && canvas.getContext('2d')
    ? canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
    : false;

  const ua = navigator.userAgent.toLowerCase();
  const isWebMCheck = ua.includes('safari') && !ua.includes('chrome') ? false : true;

  let autoplay = true;
  const video = document.createElement('video');
  video.muted = true;
  video.autoplay = true;
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');
  video.style.display = 'none';
  video.src = 'data:video/mp4;placeholder';
  video.load();

  document.body.appendChild(video);
  video.onplay = () => (video.isPlaying = true);
  video.oncanplay = () => {
    autoplay = !!video.isPlaying;
    video.pause();
    video.remove();
  };

  if (!isTouch) video.play();
  else video.setAttribute('autoplay', 'true');

  if (ua.includes('firefox')) {
    document.documentElement.classList.add('CBff');
  }

  return {
    deviceclass: devicec,
    device: devnum,
    isTouch,
    webp: +isWebPCheck,
    webm: +isWebMCheck,
    vidauto: +autoplay,
  };
}

export function revCheck() {
  const checkfix = document.createElement('div');
  checkfix.className = 'checkfix';
  checkfix.innerHTML = '<div class="checkfix_t"></div>';
  document.body.appendChild(checkfix);
  const updateText = () => {
    const zoom = window.innerWidth !== window.outerWidth;
    const ratio = ((window.innerWidth * 9) / window.innerHeight).toFixed(2);
    checkfix.querySelector('.checkfix_t').innerHTML =
      `Width: ${window.innerWidth}<br>Height: ${window.innerHeight}<br>` +
      `Ratio: ${ratio}/9<br>${(16 / ratio).toFixed(3)}<br>Zoom: ${zoom}`;
  };
  updateText();
  window.addEventListener('resize', updateText);
}

export function glCheck() {
  try {
    const canvas = document.createElement('canvas');
    if (
      !!window.WebGL2RenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('experimental-webgl2'))
    ) {
      return 'webgl2';
    }
    if (
      !!window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    ) {
      return 'webgl';
    }
  } catch (e) {
    return false;
  }
  return false;
}