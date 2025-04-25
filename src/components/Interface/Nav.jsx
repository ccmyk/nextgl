"use client";

import { useEffect, useRef, useState } from 'react'
import { useAppEvents }      from '@/context/AppEventsContext'
import { useSplitText }      from '@/hooks/useSplitText'
import { useNavClock }       from '@/hooks/useNavClock'
import styles                from '@/styles/components/nav.pcss'

export default function Nav({ html }) {
  const containerRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const { dispatchAnim } = useAppEvents()

  // split-text any target
  useSplitText('.nav_logo, .nav_right a, .nav_clock_p, .nav_clock_h, .nav_clock_m, .nav_clock_a')

  // onMount: insert legacy HTML
  useEffect(() => {
    containerRef.current.innerHTML = html
    // animate logo, city, H, M, A in
    ['.nav_logo', '.nav_clock_p', '.nav_clock_h', '.nav_clock_m', '.nav_clock_a'].forEach(sel => {
      dispatchAnim(0, sel)
      dispatchAnim(1, sel)
    })
  }, [html, dispatchAnim])

  // live clock
  const { hour, minute, ampm } = useNavClock(dispatchAnim)
  // whenever hour/minute/ampm changes, splice into DOM
  useEffect(() => {
    const hEls = containerRef.current.querySelectorAll('.nav_clock_h .char .n')
    hEls[0].textContent = hour[0]
    hEls[1].textContent = hour[1]
    const mEls = containerRef.current.querySelectorAll('.nav_clock_m .char .n')
    mEls[0].textContent = minute[0]
    mEls[1].textContent = minute[1]
    const aEls = containerRef.current.querySelectorAll('.nav_clock_a .char .n')
    aEls[0].textContent = ampm[0]
    aEls[1].textContent = ampm[1]
  }, [hour, minute, ampm])

  // burger click toggles
  const toggleMenu = () => {
    if (isOpen) {
      document.documentElement.classList.remove('act-menu')
      dispatchAnim(null, 'closemenu')
    } else {
      document.documentElement.classList.add('act-menu')
      dispatchAnim(null, 'openmenu')
    }
    setIsOpen(!isOpen)
  }

  // link-hover: re-play write animation on links
  useEffect(() => {
    containerRef.current.querySelectorAll('.nav_right a').forEach(a => {
      a.addEventListener('mouseenter', () => dispatchAnim(1, a))
    })
  }, [dispatchAnim])

  return (
    <nav className={styles.nav} ref={containerRef}>
      {/* legacy HTML will drop in here */}
      <button className={styles.nav_burger} onClick={toggleMenu}>
        <span/>
        <span/>
        <span/>
      </button>
      <div className={styles.nav_right}>
        {/* links go here via HTML */}
      </div>
      <div className={styles.nav_clock_s}>
        <span className="nav_clock_p"/><span className="nav_clock_h"/><span className="nav_clock_m"/><span className="nav_clock_a"/>
      </div>
    </nav>
  )
}