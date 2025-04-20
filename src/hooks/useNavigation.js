// src/hooks/useNavigation.js

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppContext } from '@/context/AppProvider'

export function useNavigation() {
  const {
    page,
    isReady,
    content,
    template,
    pHide,
    isload,
  } = useAppContext()

  const router = useRouter()

  useEffect(() => {
    const resetLinks = () => {
    }

    const onRequest = async (e) => {
      if (!isReady) return
      if (!page.current) return

      const { url, btn } = e.detail
      pHide.current?.classList.add('is-loading')

      await page.current.animOut?.(btn)

      router.push(url)
    }

    const onChange = async () => {
      if (!isReady) return
      if (!page.current) return

      const el = document.querySelector('#content')
      const temp = document.querySelector('#template')

      await page.current.destroy?.()

      await page.current.create(el, null, temp?.innerHTML)
      await page.current.start?.()
    }

    const onPopState = (e) => {
      onRequest({ detail: { url: document.location.href, btn: null } })
    }

    document.addEventListener('request', onRequest)
    window.addEventListener('popstate', onPopState)
    window.addEventListener('appchange', onChange)

    return () => {
      document.removeEventListener('request', onRequest)
      window.removeEventListener('popstate', onPopState)
      window.removeEventListener('appchange', onChange)
    }
  }, [isReady, page, content, template, pHide, isload])
}
