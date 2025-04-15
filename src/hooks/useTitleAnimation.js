// src/hooks/useTitleAnimation.js

import { useEffect, useRef } from 'react'
import { Vec2 } from 'ogl'
import gsap from 'gsap'

import {
  check,
  start,
  stop,
  updateX,
  updateY,
  updateScale
} from '@/components/webgl/Title/position.js'

/**
 * Hook to manage the animation lifecycle and interactivity
 * of an MSDF WebGL text mesh component (💬).
 */
export function useTitleAnimation({
  el,
  cnt,
  tt,
  mesh,
  text,
  canvas,
  scene,
  camera,
  renderer,
  touch = 0
}) {
  const animIn = useRef()
  const animOut = useRef()
  const actualChar = useRef(-2)
  const power = useRef([])
  const positioncur = useRef([])
  const positiontar = useRef([])
  const norm = useRef([0, 0])
  const end = useRef([0, 0])
  const charEls = useRef([])
  const lerp = useRef(0.6)
  const stopt = useRef(0)
  const lastX = useRef(0)
  const rafId = useRef()

  const coords = useRef([0, 0])
  const bound = useRef([])
  const screen = useRef([])
  const viewport = useRef([])

  // Character splitting and initialization
  useEffect(() => {
    if (!tt || !mesh?.program?.uniforms) return

    new window.SplitType(tt, { types: 'chars,words' })
    charEls.current = tt.querySelectorAll('.char')

    const charw = []
    const charsposw = []
    let totalw = 0
    let arrw = []
    let arrh = []

    charEls.current.forEach((char, i) => {
      positiontar.current.push(0.5)
      positioncur.current.push(0.5)

      const w = char.clientWidth
      const h = char.clientHeight
      charw.push(w)
      charsposw.push(totalw)
      totalw += w

      arrw.push(w, w)
      arrh.push(h)
    })

    mesh.program.uniforms.uWidth.value = arrw
    mesh.program.uniforms.uHeight.value = arrh
  }, [tt, mesh])

  // Resize logic and perspective
  const onResize = () => {
    if (!cnt || !renderer || !camera) return

    const bounds = cnt.getBoundingClientRect()
    bound.current = [bounds.x, bounds.y, bounds.width, bounds.height]
    screen.current = [bounds.width, bounds.height]

    renderer.setSize(bounds.width, bounds.height)
    camera.perspective({
      aspect: renderer.gl.canvas.clientWidth / renderer.gl.canvas.clientHeight
    })
    camera.fov = 45
    camera.position.set(0, 0, 7)

    const fov = (camera.fov * Math.PI) / 180
    const height = 2 * Math.tan(fov / 2) * camera.position.z
    const width = height * camera.aspect

    viewport.current = [width, height]
  }

  // Frame-by-frame animation logic
  const update = (time) => {
    end.current[0] = lerpArr(end.current[0], norm.current[0], lerp.current)
    mesh.program.uniforms.uMouse.value = [end.current[0], 0]
    mesh.program.uniforms.uTime.value = time

    positioncur.current = lerpArr(positioncur.current, positiontar.current, lerp.current)
    mesh.program.uniforms.uPowers.value = positioncur.current

    if (stopt.current === 0) {
      renderer.render({ scene, camera })
    }

    rafId.current = requestAnimationFrame(update)
  }

  // Mouse/touch event logic
  useEffect(() => {
    if (!tt) return

    const inFn = (e) => {
      stopt.current = 0
      lerp.current = 0.03

      let lX = e.touches?.[0]?.pageX - bound.current[0] || e.layerX
      lastX.current = lX

      const out = lX < 60 ? -0.5 : 0.5
      calcChars(lX, out)

      animOut.current?.pause()
      animIn.current?.play()
    }

    const mvFn = (e) => {
      let lX = e.touches?.[0]?.pageX - bound.current[0] || e.layerX
      lastX.current = lX
      calcChars(lX)
    }

    const lvFn = (e) => {
      let lX = e.touches?.[0]?.pageX - bound.current[0] || e.layerX
      const out = lX < 60 ? 0.5 : -0.5
      lerp.current = 0.03
      calcChars(lX, out)
      animIn.current?.pause()
    }

    if (touch === 0) {
      tt.onmouseenter = inFn
      tt.onmousemove = mvFn
      tt.onmouseleave = lvFn
    } else {
      tt.ontouchstart = inFn
      tt.ontouchmove = mvFn
      tt.ontouchend = lvFn
    }

    return () => cancelAnimationFrame(rafId.current)
  }, [tt])

  useEffect(() => {
    animIn.current = gsap.timeline({ paused: true })
      .to(mesh.program.uniforms.uPower, {
        value: 1,
        duration: 0.36,
        ease: 'power4.inOut'
      })

    animOut.current = gsap.timeline({ paused: true })
      .to(mesh.program.uniforms.uPower, {
        value: 0,
        duration: 0.6,
        ease: 'none',
        onComplete: () => {
          mesh.program.uniforms.uKey.value = -1
        }
      })
  }, [])

  // Char hover events
  useEffect(() => {
    if (!charEls.current?.length) return

    charEls.current.forEach((char, i) => {
      char.onmouseenter = () => {
        mesh.program.uniforms.uKey.value = i
        actualChar.current = i
      }
      char.ontouchstart = () => {
        mesh.program.uniforms.uKey.value = i
        actualChar.current = i
      }
    })
  }, [charEls.current])

  return { onResize, update }
}

function lerp(a, b, t) {
  return a + (b - a) * t
}

function lerpArr(a, b, t) {
  if (typeof a === 'number' && typeof b === 'number') return lerp(a, b, t)
  return a.map((v, i) => lerp(v, b[i], t))
}

function calcChars(x, out) {
  const arr = []
  if (out !== undefined) {
    charEls.current.forEach(() => arr.push(out))
  } else {
    charEls.current.forEach((char, i) => {
      let tot = x - char.offsetLeft
      tot = tot / char.clientWidth
      tot -= 0.5
      tot = Math.max(-0.5, Math.min(tot, 0.5))
      arr.push(tot)
    })
  }
  positiontar.current = arr
}