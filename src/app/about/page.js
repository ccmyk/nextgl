// src/app/about/page.js

'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Intro from './Intro'
import DualIO from './DualIO'

export default function AboutPage() {
  const mainRef = useRef(null)

  useEffect(() => {
    const el = mainRef.current
    const device = window.innerWidth < 768 ? 1 : 2

    if (device > 1) {
      for (let node of el.querySelectorAll('.about_list .Awrite .iO')) {
        const parent = node.parentNode
        parent.classList.add('ivi', 'nono')
        node.remove()
      }
    }

    const eye = el.querySelector('.about_list .Awrite i')
    for (let link of el.querySelectorAll('.about_dual .cnt_t a')) {
      link.insertAdjacentElement('beforeend', eye.cloneNode(true))
    }

    const activeEl = el.querySelector('.iO.goout')
    if (activeEl) {
      gsap.to(
        document.querySelector(`[data-io="${activeEl.dataset.io}"] .anim`),
        { progress: 0, duration: 0.8, ease: 'power2.inOut' }
      )
    } else {
      gsap.to('.about_dual .cnt_t', {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut',
      })
    }
  }, [])

  return (
    <main ref={mainRef} className="about_main">
      <section className="about_intro">
        <Intro />
      </section>
      <section className="about_dual">
        <DualIO />
      </section>
    </main>
  )
}