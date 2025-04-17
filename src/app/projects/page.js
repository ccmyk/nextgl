// src/app/projects/page.js

'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Intro from './Intro'

export default function ProjectsPage() {
  const mainRef = useRef(null)
  const introRef = useRef(null)
  const accordionRef = useRef(null)
  const listRef = useRef(null)

  useEffect(() => {
    const el = mainRef.current
    const accordion = accordionRef.current
    const list = listRef.current

    accordion.classList.remove('act')
    list.classList.add('act')

    const handleListClick = () => {
      accordion.classList.remove('act')
      list.classList.add('act')
      document.querySelector('.nav_blur')?.classList.add('up')

      const evt = new CustomEvent('anim', {
        detail: { state: 1, style: 1 },
      })
      document.dispatchEvent(evt)
    }

    const handleAccordionClick = () => {
      list.classList.remove('act')
      accordion.classList.add('act')
      document.querySelector('.nav_blur')?.classList.add('up')

      const evt = new CustomEvent('anim', {
        detail: { state: 0, style: 1 },
      })
      document.dispatchEvent(evt)
    }

    list.addEventListener('click', handleListClick)
    accordion.addEventListener('click', handleAccordionClick)

    return () => {
      list.removeEventListener('click', handleListClick)
      accordion.removeEventListener('click', handleAccordionClick)
    }
  }, [])

  return (
    <main ref={mainRef} className="projects_main">
      <section className="projects_intro">
        <Intro ref={introRef} />
      </section>
      <div className="toLs" ref={listRef}>List</div>
      <div className="toAc" ref={accordionRef}>Accordion</div>
    </main>
  )
}