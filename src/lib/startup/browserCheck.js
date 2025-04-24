export function browserCheck() {
  // disable scroll restoration
  if (window.history.scrollRestoration) {
    window.history.scrollRestoration = 'manual'
  }

  // touch vs. desktop
  const isTouch =
    /Mobi|Android|Tablet|iPad|iPhone/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

  const w = window.innerWidth
  const h = window.innerHeight
  let deviceClass = 'desktop'
  let deviceNum = 0

  if (!isTouch) {
    if (w > 1780) deviceNum = -1
    document.documentElement.classList.add('D')
  } else {
    document.documentElement.classList.add('T')
    if (w > 767) {
      if (w > h) {
        deviceClass = 'tabletL'; deviceNum = 1
      } else {
        deviceClass = 'tabletS'; deviceNum = 2
      }
    } else {
      deviceClass = 'mobile'; deviceNum = 3
    }
    document.documentElement.classList.add(deviceClass)
  }

  // WebP support?
  const canvas = document.createElement('canvas')
  const webp = !!(
    canvas.getContext &&
    canvas.getContext('2d')?.toDataURL('image/webp').startsWith('data:image/webp')
  )

  // WebM support?
  const ua = navigator.userAgent.toLowerCase()
  const webm = !(
    ua.includes('safari') && !ua.includes('chrome')
  )

  // video autoplay?
  let vidauto = true
  const video = document.createElement('video')
  video.muted = true
  video.autoplay = true
  video.playsInline = true
  video.oncanplay = () => {
    vidauto = video.currentTime > 0 && !video.paused && !video.ended
    video.remove()
  }
  video.src = 'data:video/mp4;base64,AAAAIGZ0…' // a 1-frame MP4 data URI
  video.play().catch(() => {
    vidauto = false
    video.remove()
  })

  return {
    deviceClass,
    deviceNum,
    isTouch,
    webp,
    webm,
    vidauto
  }
}