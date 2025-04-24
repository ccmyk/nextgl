"use client";
"use client"// src/app/playground/page.js

'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import Intro from './Intro'

export default function PlaygroundPage() {
  const mainRef = useRef(null)
  const [posEl, setPosEl] = useState(-1)
  const elsRef = useRef([])

  useEffect(() => {
    const el = mainRef.current
    const isMobile = window.innerWidth < 768
    const device = isMobile ? 1 : 0
    elsRef.current = Array.from(el.querySelectorAll('.el'))

    if (device > 0) {
      document.documentElement.classList.add('NOGL')
    }

    if (device === 1) {
      el.classList.add('noclick')
    }

    for (let [i, item] of elsRef.current.entries()) {
      item.classList.add(`el-${i % 12}`)

      const b = item.querySelector('.el_b .Awrite')
      const md = item.querySelector('.el_md')

      md.onclick = () => {
        if (posEl !== -1) {
          elsRef.current[posEl].classList.remove('wact')
          const h = elsRef.current[posEl].querySelector('.el_b .Awrite')

          const exitEvt = new CustomEvent('anim', {
            detail: { state: -1, el: h },
          })
          document.dispatchEvent(exitEvt)

          if (posEl === i) {
            setPosEl(-1)
            return
          }
        }

        setPosEl(i)

        const enterEvt = new CustomEvent('anim', {
          detail: { state: 1, el: b },
        })
        document.dispatchEvent(enterEvt)

        item.classList.add('wact')
      }
    }
  }, [])

  return (
    <main ref={mainRef} className="playground_main">
      <section className="playground_intro">
        <Intro />
      </section>

      {/* Content will be injected by WordPress or SSR at runtime */}
    </main>
  )
}