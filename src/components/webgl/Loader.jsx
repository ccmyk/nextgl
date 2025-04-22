'use client'

import { useEffect, useRef } from 'react'
import { useLoader } from '@/hooks/webgl/useLoader'
import gsap from 'gsap'

export default function Loader() {
  const { isReady, progress, effectRef } = useLoader()
  const containerRef = useRef(null)
  const numberRef = useRef(null)
  const textRef = useRef(null)

  // Handle number animation exactly like legacy
  useEffect(() => {
    if (!numberRef.current || !textRef.current) return

    const obj = { num: 0 }
    
    // Same animation timeline as legacy
    const timeline = gsap.timeline({ paused: true })
      .fromTo(obj, 
        { num: 0 },
        {
          num: 42,
          ease: 'none',
          duration: 2,
          onUpdate: () => {
            const num = obj.num.toFixed(0)
            numberRef.current.textContent = num.padStart(3, '0')
          }
        }, 0)
      .to(obj, {
        num: 90,
        ease: 'power2.inOut',
        duration: 8,
        onUpdate: () => {
          const num = obj.num.toFixed(0)
          numberRef.current.textContent = num.padStart(3, '0')
        }
      }, 2.2)

    // Text animation with same timing as legacy
    const aw = textRef.current.querySelectorAll('.Awrite')
    aw.forEach(el => {
      const event = new CustomEvent('anim', {
        detail: { state: 0, el }
      })
      document.dispatchEvent(event)

      event.detail.state = 1
      document.dispatchEvent(event)
    })

    timeline.play()

    return () => timeline.kill()
  }, [])

  // Handle hide animation exactly like legacy
  const hideLoader = async () => {
    if (!effectRef.current) return

    // Same animation sequence as legacy
    gsap.to({ num: progress }, {
      num: 100,
      ease: 'power2.inOut',
      duration: 0.49,
      onUpdate: function() {
        if (numberRef.current) {
          const num = this.targets()[0].num.toFixed(0)
          numberRef.current.textContent = num.padStart(3, '0')
        }
      }
    })

    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.5,
      delay: 0.2,
      ease: 'power2.inOut',
      onComplete: () => {
        if (containerRef.current) {
          containerRef.current.remove()
        }
      }
    })
  }

  // Start hide animation when ready
  useEffect(() => {
    if (isReady) {
      hideLoader()
    }
  }, [isReady])

  return (
    <div 
      ref={containerRef}
      className="loader fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="loader_cnt">
        <div ref={numberRef} className="loader_tp">000</div>
        <div ref={textRef} className="loader_text">
          <div className="Awrite">Loading</div>
          <div className="Awrite">Please Wait</div>
        </div>
      </div>
      <div className="loader_bg" />
    </div>
  )
}
