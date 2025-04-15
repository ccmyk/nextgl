// src/components/Interface/Mouse.jsx

'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Mouse({ main }) {
  const elRef = useRef(null)
  const chdRef = useRef(null)
  const animev = main?.events?.anim
  const posRef = useRef([window.innerWidth / 2, window.innerHeight / 2])

  useEffect(() => {
    const el = document.createElement('div')
    el.className = 'mouse'
    elRef.current = el
    document.body.appendChild(el)

    const pH = document.querySelector('.pHide')
    if (pH) {
      pH.onmouseenter = () => {
        if (chdRef.current) {
          gsap.to(chdRef.current, {
            width: 0,
            duration: 0.2,
            onComplete: () => {
              chdRef.current?.remove()
              chdRef.current = null
            },
          })
        }
      }
    }

    window.addEventListener('mousedown', () => {
      document.documentElement.classList.add('mouse-down')
    })
    window.addEventListener('mouseup', () => {
      document.documentElement.classList.remove('mouse-down')
    })

    const lightX = gsap.quickTo(el, 'x', { duration: 0.05, ease: 'none' })
    const lightY = gsap.quickTo(el, 'y', { duration: 0.05, ease: 'none' })

    document.body.onmousemove = (e) => {
      posRef.current = [e.clientX, e.clientY]
      lightX(posRef.current[0])
      lightY(posRef.current[1])
    }

    const followIn = async (el) => {
      // if(this.chd){ await window.waiter(300) } else { await window.waiter(6) }
      if (chdRef.current) {
        await window.waiter(300)
      } else {
        await window.waiter(6)
      }

      // if(this.chd){ this.chd.remove(); delete this.chd }
      chdRef.current?.remove()
      chdRef.current = null

      const chd = document.createElement('div')
      const aW = document.createElement('div')
      chd.classList.add('mouse_el')
      aW.classList.add('Awrite', 'Awrite-inv', 'Ms')
      if (el.dataset.w) aW.classList.add('Awrite-w')
      aW.innerHTML = el.dataset.tt

      // this.animev.detail.state = 0; dispatchEvent()
      if (animev) {
        animev.detail.state = 0
        animev.detail.el = aW
        document.dispatchEvent(animev)
      }

      chd.appendChild(aW)
      elRef.current.appendChild(chd)
      chdRef.current = chd

      // this.animev.detail.state = 1; dispatchEvent()
      if (animev) {
        animev.detail.state = 1
        document.dispatchEvent(animev)
      }
    }

    const followOut = () => {
      if (!chdRef.current) return
      gsap.to(chdRef.current, {
        width: 0,
        duration: 0.2,
        onComplete: () => {
          chdRef.current?.remove()
          chdRef.current = null
        },
      })
    }

    // Refactored from: this.reset()
    const mWrite = document.querySelectorAll('.MW')
    for (let el of mWrite) {
      if (!el.classList.contains('evt')) {
        el.addEventListener('mouseenter', (e) => followIn(el, e))
        el.addEventListener('mouseleave', (e) => followOut(el, e))
        el.classList.add('evt')
      }
    }

    return () => {
      el.remove()
      document.body.onmousemove = null
    }
  }, [main])

  return null
}
