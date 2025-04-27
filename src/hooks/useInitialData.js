'use client'

import { useState, useEffect } from 'react'
import { browserCheck } from '@/lib/startup/browserCheck'
import { loadOptions } from '@/lib/api/loadOptions'
import { useAppState } from '@/context/AppProvider'

/**
 * useInitialData:
 * - Runs on app mount
 * - Performs device detection (browserCheck)
 * - Waits for custom fonts to load (document.fonts.ready)
 * - Loads WP options payload
 *
 * Usage:
 *   const { device, options, loading } = useInitialData({
 *     baseUrl: process.env.NEXT_PUBLIC_API_BASE,
 *     pageId: slug,
 *     template,
 *     webgl: +hasWebGL
 *   })
 */
export function useInitialData({ baseUrl, pageId, template, webgl = 1 }) {
  const [device, setDevice] = useState(null)
  const [options, setOptions] = useState(null)
  const [loading, setLoading] = useState(true)
  const { setIsLoaded } = useAppState()

  useEffect(() => {
    let cancelled = false

    async function init() {
      // 1) Device detection (adds classes to document)
      const info = browserCheck()
      if (cancelled) return
      setDevice(info)

      // 2) Font loading
      await document.fonts.ready
      if (cancelled) return

      // 3) Load initial API options (if needed)
      try {
        const data = await loadOptions({
          baseUrl,
          id: pageId,
          template,
          device: info.deviceNum,
          webp: info.webp ? 1 : 0,
          webgl,
        })
        if (cancelled) return
        setOptions(data)
      } catch (err) {
        console.error('useInitialData → loadOptions error:', err)
      } finally {
        if (!cancelled) {
          setLoading(false)
          setIsLoaded(true) // Signal app is ready to display
        }
      }
    }

    init()

    return () => {
      cancelled = true
    }
  }, [baseUrl, pageId, template, webgl, setIsLoaded])

  return { device, options, loading }
}