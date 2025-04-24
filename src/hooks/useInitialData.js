import { useState, useEffect } from 'react'
import { browserCheck }   from '@/lib/startup/browserCheck'
import { loadOptions }    from '@/lib/api/loadOptions'

/**
 * usage:
 *   const { device, options, loading } = useInitialData({
 *     baseUrl: process.env.NEXT_PUBLIC_API_BASE,
 *     pageId:  contentId,
 *     template,
 *     webgl:   +hasWebGL
 *   })
 */
export function useInitialData({
  baseUrl,
  pageId,
  template,
  webgl = 1
}) {
  const [device, setDevice] = useState(null)
  const [options, setOptions] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const init = async () => {
      // 1) detect device & set classes:
      const info = browserCheck()
      if (cancelled) return
      setDevice(info)

      // 2) wait for your custom fonts to load
      await document.fonts.ready
      if (cancelled) return

      // 3) fetch the WP REST payload
      const data = await loadOptions({
        baseUrl,
        id:        pageId,
        template,
        device:    info.deviceNum,
        webp:      info.webp ? 1 : 0,
        webgl
      })
      if (cancelled) return
      setOptions(data)
      setLoading(false)
    }

    init()
    return () => { cancelled = true }
  }, [baseUrl, pageId, template, webgl])

  return { device, options, loading }
}