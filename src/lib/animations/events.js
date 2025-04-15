// src/lib/animations/events.js

const events = {
  startscroll: new Event('startscroll'),
  stopscroll: new Event('stopscroll'),
  newlinks: new Event('newlinks'),
  scrollto: new CustomEvent('scrollto', { detail: {} }),
  openmenu: new Event('openmenu'),
  closemenu: new Event('closemenu'),
  nextprj: new CustomEvent('nextprj', { detail: {} }),
  anim: new CustomEvent('anim', { detail: { el: null, state: 0, style: 0 } }),
  orientationchange: new Event('orientationchange')
}

export default events
