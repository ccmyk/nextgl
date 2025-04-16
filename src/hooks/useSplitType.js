// src/hooks/useSplitType.js

import { useEffect } from 'react'
import SplitType from 'split-type'

export default function useSplitType(ref, options = { types: 'lines, words, chars' }) {
  useEffect(() => {
    if (!ref.current) return

    const instance = new SplitType(ref.current, options)

    return () => {
      instance.revert()
    }
  }, [ref, options])
}