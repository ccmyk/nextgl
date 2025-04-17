// src/app/project/page.js

'use client'

import { useEffect, useRef } from 'react'
import { useAppContext } from '@/context/AppProvider'
import ProjectIntro from './Intro'
import IOIn from './IOIn'
import IONext from './IONext'
import gsap from 'gsap'

export default function ProjectPage() {
  const { device, events } = useAppContext()
  const mainRef = useRef(null)
  const introRef = useRef(null)
  const iosRef = useRef([])

  useEffect(() => {
    const el = mainRef.current

    if (device < 2) {
      document.documentElement.classList.add('NOGL')
    }

    // Optional animation logic if needed in the future
    // const anim = gsap.timeline({ paused: true })
    // anim.to(introRef.current, { opacity: 1, duration: 1 })
    // anim.play()
  }, [device])

  return (
    <main ref={mainRef} className="project_page">
      <section className="project_intro">
        <ProjectIntro ref={introRef} />
      </section>
    </main>
  )
}