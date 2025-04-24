'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

export function useNavClock(dispatchAnim) {
  // store each two-digit part as strings so we can split into chars
  const [hour, setHour] = useState('12')
  const [minute, setMinute] = useState('00')
  const [ampm, setAmpm] = useState('AM')
  const lastTimeRef = useRef(performance.now())

  // helper: format and pad
  const pad = (n) => (n < 10 ? '0' + n : String(n))

  const update = useCallback((now) => {
    // only update once per minute
    if (now - lastTimeRef.current < 60_000) return
    lastTimeRef.current = now

    const d = new Date()
    let h = d.getHours()
    const m = d.getMinutes()
    const newAmpm = h >= 12 ? 'PM' : 'AM'
    if (h > 12) h -= 12
    if (h === 0) h = 12

    const hh = pad(h)
    const mm = pad(m)

    // if any part changed, set state & trigger GSAP write
    if (hh !== hour) {
      setHour(hh)
      dispatchAnim(0, `.nav_clock_h`)   // reset
      dispatchAnim(1, `.nav_clock_h`)   // animate in
    }
    if (mm !== minute) {
      setMinute(mm)
      dispatchAnim(0, `.nav_clock_m`)
      dispatchAnim(1, `.nav_clock_m`)
    }
    if (newAmpm !== ampm) {
      setAmpm(newAmpm)
      dispatchAnim(0, `.nav_clock_a`)
      dispatchAnim(1, `.nav_clock_a`)
    }
  }, [hour, minute, ampm, dispatchAnim])

  useEffect(() => {
    let rafId = requestAnimationFrame(function loop(t) {
      update(t)
      rafId = requestAnimationFrame(loop)
    })
    return () => cancelAnimationFrame(rafId)
  }, [update])

  return { hour, minute, ampm }
}