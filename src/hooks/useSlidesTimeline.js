// src/hooks/useSlidesTimeline.js

import { useRef } from 'react'

export default function useSlidesTimeline({ canvasRef, post, slideanim, objpos, textures, dev, index }) {
  const animctr = useRef(null)
  const animin = useRef(null)
  const animsinglectr = useRef(null)

  if (index !== 0) {
    animctr.current = gsap.timeline({ paused: true })
      .fromTo(objpos, { timer: 0 }, {
        timer: 1,
        duration: 0.1,
        ease: 'power2.inOut',
        onUpdate: () => slideanim?.timeScale(objpos.timer)
      }, 0)
      .fromTo(post.passes[0].program.uniforms.uStart, { value: 1.5 }, { value: 0, duration: 0.45 }, 0)
  } else {
    animin.current = gsap.timeline({
      paused: true,
      delay: 0.1,
      onStart: () => {
        textures.forEach(t => t.image.tagName === 'VIDEO' && t.image.play())
        slideanim?.play()
      },
      onComplete: () => delete animin.current
    })
      .fromTo(canvasRef.current, { webkitFilter: 'blur(6px)', filter: 'blur(6px)' }, {
        webkitFilter: 'blur(0px)',
        filter: 'blur(0px)',
        duration: 0.8,
        ease: 'power2.inOut'
      }, 0)
      .fromTo(canvasRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power2.inOut' }, 0)
      .fromTo(objpos, { timer: 0 }, {
        timer: 1,
        duration: 0.9,
        ease: 'none',
        onUpdate: () => slideanim?.timeScale(objpos.timer)
      }, 0.8)
      .fromTo(post.passes[0].program.uniforms.uStart, { value: 1.5 }, { value: 0, duration: 2, ease: 'power4.inOut' }, 0.6)
  }

  animsinglectr.current = gsap.timeline({ paused: true })

  return {
    animctr: animctr.current,
    animin: animin.current,
    animsinglectr: animsinglectr.current,
  }
}
