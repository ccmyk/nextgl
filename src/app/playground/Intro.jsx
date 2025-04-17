// src/app/playground/Intro.jsx

'use client'

import { useEffect, forwardRef } from 'react'

const PlaygroundIntro = forwardRef(function Intro(_, ref) {
  useEffect(() => {
    // Placeholder for future animation or SplitType logic
  }, [])

  return <div ref={ref} className="playground_intro_inner" />
})

export default PlaygroundIntro