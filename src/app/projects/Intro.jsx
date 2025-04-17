// src/app/projects/Intro.jsx

'use client'

import { useEffect, forwardRef } from 'react'

const ProjectsIntro = forwardRef(function Intro(_, ref) {
  useEffect(() => {
    // Optional animation logic if needed in the future
    // const anim = gsap.timeline({ paused: true })
    // anim.to(introRef.current, { opacity: 1, duration: 1 })
    // anim.play()
  }, [])

  return <div ref={ref} className="projects_intro_inner" />
})

export default ProjectsIntro