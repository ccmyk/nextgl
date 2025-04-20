// src/components/Interface/Nav.jsx

'use client'

import { useEffect, useRef } from 'react'
import { useAppContext } from '@/context/useAppContext'
import gsap from 'gsap'

export default function Nav() {
  const { main } = useAppContext()
  const navRef = useRef()
  const state = useRef({ isOpen: 0, clockact: 0, time: performance.now() })

  useEffect(() => {
    if (!main || !main.current || !main.current.events) {
      console.error("Nav: main or main.current.events is undefined!", { main })
      return
    }
    const el = navRef.current
    const DOM = {
      el,
      burger: el.querySelector('.nav_burger'),
      els: el.querySelectorAll('.nav_right a'),
      city: el.querySelector('.nav_clock_p'),
      c: el.querySelector('.nav_logo'),
      h: el.querySelector('.nav_clock_h'),
      m: el.querySelector('.nav_clock_m'),
      a: el.querySelector('.nav_clock_a'),
    }

    DOM.el.style.opacity = 0
    const date = new Date()
    const h = date.getHours()
    const m = date.getMinutes()

    // Dispatch initial animation events
    ;['c', 'city', 'h', 'm', 'a'].forEach((k) => {
      main.current.events.anim.detail.state = 0
      main.current.events.anim.detail.el = DOM[k]
      document.dispatchEvent(main.current.events.anim)
    })

    // DOM.m.innerHTML = m
    setTime(h, m)
    initEvents()

    function setTime(hour = null, minute = null) {
      let m = minute
      if (minute === null) {
        m = parseInt(
          DOM.m.querySelectorAll('.char')[0].querySelector('.n').innerHTML +
            DOM.m.querySelectorAll('.char')[1].querySelector('.n').innerHTML
        )
        m++
        const mi = new Date().getMinutes()
        if (mi !== m) m = mi
      }

      let h = hour
      if (hour === null || m === 60) {
        searchAMPM()
        if (m === 60 && minute === null) m = 0
      }

      if (m < 10) m = '0' + m
      m = m.toString()

      DOM.m.querySelectorAll('.char')[0].querySelector('.n').classList.add('eee1')
      DOM.m.querySelectorAll('.char')[0].querySelector('.n').innerHTML = m[0]
      DOM.m.querySelectorAll('.char')[1].querySelector('.n').innerHTML = m[1]

      if (state.current.clockact === 1) {
        main.current.events.anim.detail.state = 1
        main.current.events.anim.detail.el = DOM.m
        document.dispatchEvent(main.current.events.anim)
      }
    }

    function searchAMPM(h = null) {
      if (h === null) h = new Date().getHours()

      if (h >= 12) {
        DOM.a.querySelectorAll('.char')[1].querySelector('.n').innerHTML = 'M'
        if (h > 12) {
          h -= 12
          DOM.a.querySelectorAll('.char')[0].querySelector('.n').innerHTML = 'P'
        }
      } else {
        DOM.a.querySelectorAll('.char')[0].querySelector('.n').innerHTML = 'A'
      }

      if (h < 10) h = '0' + h
      const actualh = parseInt(
        DOM.h.querySelectorAll('.char')[0].querySelector('.n').innerHTML +
          DOM.h.querySelectorAll('.char')[1].querySelector('.n').innerHTML
      )

      DOM.h.querySelectorAll('.char')[0].querySelector('.n').innerHTML = h.toString()[0]
      DOM.h.querySelectorAll('.char')[1].querySelector('.n').innerHTML = h.toString()[1]

      if (h === actualh) return h

      if (state.current.clockact === 1) {
        main.current.events.anim.detail.state = 1
        main.current.events.anim.detail.el = DOM.h
        document.dispatchEvent(main.current.events.anim)
      }

      return h
    }

    async function openMenu() {
      document.documentElement.classList.add('act-menu')
      document.dispatchEvent(main.current.events.openmenu)
    }

    async function closeMenu() {
      document.documentElement.classList.remove('act-menu')
      document.dispatchEvent(main.current.events.closemenu)
    }

    async function show() {
      DOM.el.style.opacity = 1
      main.current.events.anim.detail.state = 1
      main.current.events.anim.detail.el = DOM.c
      document.dispatchEvent(main.current.events.anim)

      DOM.c.onmouseenter = () => {
        main.current.events.anim.detail.state = 1
        main.current.events.anim.detail.el = DOM.c
        document.dispatchEvent(main.current.events.anim)
      }

      DOM.el.querySelector('.nav_clock_s').style.opacity = 1
      ;['city', 'h', 'm', 'a'].forEach((k) => {
        main.current.events.anim.detail.state = 1
        main.current.events.anim.detail.el = DOM[k]
        document.dispatchEvent(main.current.events.anim)
      })

      for (let [i, a] of DOM.els.entries()) {
        main.current.events.anim.detail.el = a
        main.current.events.anim.detail.state = 0
        document.dispatchEvent(main.current.events.anim)
        main.current.events.anim.detail.state = 1
        document.dispatchEvent(main.current.events.anim)

        a.onmouseenter = () => {
          main.current.events.anim.detail.el = a
          main.current.events.anim.detail.state = 1
          document.dispatchEvent(main.current.events.anim)
        }
      }

      state.current.clockact = 1
    }

    function initEvents() {
      if (DOM.burger) {
        DOM.burger.onclick = () => {
          if (state.current.isOpen === 1) {
            closeMenu()
            state.current.isOpen = 0
          } else {
            openMenu()
            state.current.isOpen = 1
          }
        }
      }
    }

    const clockTimer = setInterval(() => {
      const now = performance.now()
      if (state.current.time + 60010 <= now) {
        state.current.time = now
        setTime()
      }
    }, 10000)

    return () => clearInterval(clockTimer)
  }, [main])

  return <nav ref={navRef} className="nav" />
}
