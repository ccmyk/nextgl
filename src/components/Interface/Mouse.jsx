"use client";
"use client";
"use client""use client"'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useMouse } from '@/hooks/useMouse'
import { useAppEvents } from '@/context/AppEventsContext'

export default function Mouse() {
  const containerRef = useRef(null)
  const quickX = useRef(null)
  const quickY = useRef(null)
  const tooltipRef = useRef(null)
  const { x, y } = useMouse()
  const { dispatchAnim } = useAppEvents()

  // 1) on mount: create the mouse div and GSAP quickTo’s
  useEffect(() => {
    const el = document.createElement('div')
    el.className = 'mouse'
    document.body.appendChild(el)
    containerRef.current = el

    // quickTo for x/y
    quickX.current = gsap.quickTo(el, 'x', { duration: 0.05, ease: 'none' })
    quickY.current = gsap.quickTo(el, 'y', { duration: 0.05, ease: 'none' })

    // mousedown / mouseup toggle
    window.addEventListener('mousedown', () =>
      document.documentElement.classList.add('mouse-down')
    )
    window.addEventListener('mouseup', () =>
      document.documentElement.classList.remove('mouse-down')
    )

    // on unmount
    return () => {
      el.remove()
      window.removeEventListener('mousedown', () => {})
      window.removeEventListener('mouseup', () => {})
    }
  }, [])

  // 2) every frame: feed quickTo
  useEffect(() => {
    if (quickX.current && quickY.current) {
      quickX.current(x)
      quickY.current(y)
    }
  }, [x, y])

  // 3) reset & scan for “.MW” hover targets
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // followIn/out logic
    const onEnter = (ev) => {
      // create tooltip wrapper
      const wrapper = document.createElement('div')
      wrapper.className = 'mouse_el'
      const aw = document.createElement('div')
      aw.className = 'Awrite Awrite-inv Ms'
      aw.textContent = ev.currentTarget.dataset.tt
      // trigger Awrite-inv animation
      dispatchAnim(0, aw)
      wrapper.appendChild(aw)
      el.appendChild(wrapper)
      tooltipRef.current = wrapper
      dispatchAnim(1, aw)
    }

    const onLeave = () => {
      const w = tooltipRef.current
      if (!w) return
      gsap.to(w, {
        width: 0,
        duration: 0.2,
        onComplete: () => w.remove(),
      })
      tooltipRef.current = null
    }

    // attach to every .MW that isn’t already wired
    document.querySelectorAll('.MW').forEach((target) => {
      if (!target.hasAttribute('data-mw-bound')) {
        target.setAttribute('data-mw-bound', 'true')
        target.addEventListener('mouseenter', onEnter)
        target.addEventListener('mouseleave', onLeave)
      }
    })

    // no teardown (we want persistent binding)
  })

  return null
}