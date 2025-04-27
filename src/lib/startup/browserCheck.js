export function browserCheck() {
  if (typeof window === 'undefined') return {}

  // disable scroll restoration
  if (window.history.scrollRestoration) {
    window.history.scrollRestoration = 'manual'
  }

  // touch vs desktop
  const ua = navigator.userAgent
  const isTouch = /Mobi|Android|Tablet|iPad|iPhone/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

  let deviceClass = 'desktop'
  let deviceNum = 0
  const w = window.innerWidth
  const h = window.innerHeight

  if (!isTouch) {
    if (w > 1780) deviceNum = -1
    document.documentElement.classList.add('D')
  } else {
    document.documentElement.classList.add('T')
    if (w > 767) {
      deviceClass = w > h ? 'tabletL' : 'tabletS'
      deviceNum = w > h ? 1 : 2
    } else {
      deviceClass = 'mobile'
      deviceNum = 3
    }
    document.documentElement.classList.add(deviceClass)
  }

  // webp support
  const canvas = document.createElement('canvas')
  const webp = !!(canvas.getContext && canvas.getContext('2d')?.toDataURL('image/webp').startsWith('data:image/webp'))

  // webm support
  const isSafari = ua.toLowerCase().includes('safari') && !ua.toLowerCase().includes('chrome')
  const webm = !isSafari

  // video autoplay
  let vidauto = true
  const video = document.createElement('video')
  video.muted = true
  video.autoplay = true
  video.playsInline = true
  video.src = 'data:video/mp4;base64,AAAAIGZ0...'

  video.oncanplay = () => {
    vidauto = video.currentTime > 0 && !video.paused && !video.ended
    video.remove()
  }
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
    vidauto,
    width: w,
    height: h,
  }
}
