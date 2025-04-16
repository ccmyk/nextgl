// src/components/Interface/LoaderDOM.jsx

'use client'

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import gsap from 'gsap'

const LoaderDOM = forwardRef((props, ref) => {
  const elRef = useRef(null)
  const obj = useRef({ num: 0 })
  const anim = useRef(null)

  // Imperative API
  useImperativeHandle(ref, () => ({
    start,
    hideIntro,
  }))

  useEffect(() => {
    window.__loaderDom = {
      start,
      hideIntro,
    }
  }, [])

  useEffect(() => {
    createAnim()
  }, [])

  const createAnim = () => {
    anim.current = gsap.timeline({ paused: true })
      .fromTo(obj.current, { num: 0 }, {
        num: 42,
        ease: 'none',
        duration: 2,
        onUpdate: () => {
          calcNum(obj.current.num.toFixed(0))
        }
      }, 0)
      .to(obj.current, { num: 90, ease: 'power2.inOut', duration: 8,
        onUpdate: () => {
          calcNum(obj.current.num.toFixed(0))
        }
      }, 2.2)

    // Dispatch animation state events (equivalent to Awrite triggers)
    const aw = elRef.current.querySelectorAll('.Awrite')
    if (aw.length >= 2) {
      const event = new CustomEvent('anim', { detail: { state: 0, el: null } })
      event.detail.el = aw[0]
      document.dispatchEvent(event)
      event.detail.el = aw[1]
      document.dispatchEvent(event)
    }
  }

  const calcNum = (num) => {
    if (num < 10) num = '00' + num
    else if (num < 100) num = '0' + num
    elRef.current.querySelector('.loader_tp').innerHTML = num
  }

  const start = () => {
    const aw = elRef.current.querySelectorAll('.Awrite')
    if (aw.length >= 2) {
      const event = new CustomEvent('anim', { detail: { state: 1, el: null } })
      event.detail.el = aw[0]
      document.dispatchEvent(event)
      event.detail.el = aw[1]
      document.dispatchEvent(event)
    }
    anim.current.play()
  }

  const hideIntro = () => {
    anim.current.pause()
    gsap.to(obj.current, {
      num: 100,
      ease: 'power2.inOut',
      duration: 0.49,
      onUpdate: () => {
        calcNum(obj.current.num.toFixed(0))
      }
    })

    // === Commented legacy alternative ===
    // gsap.to(elRef.current.querySelector('.loader_cnt'), {
    //   opacity: 0,
    //   duration: 0.3,
    //   ease: 'power2.inOut',
    //   onComplete: () => {}
    // })

    gsap.to(elRef.current, {
      opacity: 0,
      duration: 0.5,
      delay: 0.2,
      ease: 'power2.inOut',
      onComplete: () => {
        elRef.current.remove()
      }
    })

    // === Commented legacy alternative ===
    // gsap.fromTo(document.querySelector('.mousebg_el'), {
    //   scale: 0.6,
    //   yoyo: true,
    //   duration: 0.6,
    //   ease: Power2.easeInOut
    // })

    // === Commented legacy alternative ===
    // await gsap.to(elRef.current, { opacity: 0, duration: 0.6, ease: Power2.easeInOut })
  }

  return (
    <div ref={elRef} className="loader">
      <div className="loader_bg"></div>
      <div className="loader_cnt">
        <div className="loader_tp">000</div>
        <div className="Awrite">Eva</div>
        <div className="Awrite">Sánchez</div>
      </div>
    </div>
  )
})

LoaderDOM.displayName = 'LoaderDOM'
export default LoaderDOM
