// src/app/project/Intro.jsx

'use client'

import { forwardRef, useEffect, useRef } from 'react'
import gsap from 'gsap'

const ProjectIntro = forwardRef((props, ref) => {
  const localRef = useRef()
  const mergedRef = ref || localRef

  useEffect(() => {
    // Optional entrance animation
    gsap.to(mergedRef.current, { opacity: 1, duration: 1 })
  }, [])

  return <div ref={mergedRef} className="project_intro_content">Project Intro</div>
})

export default ProjectIntro