// hooks/useIntersectionObservers.js

import { useEffect } from 'react'

export default function useIntersectionObservers(targets, callback, options = {}) {
  useEffect(() => {
    if (!targets || !targets.length) return

    const observer = new IntersectionObserver(callback, options)
    targets.forEach((el) => el && observer.observe(el))

    return () => {
      targets.forEach((el) => el && observer.unobserve(el))
      observer.disconnect()
    }
  }, [targets, callback, options])
}