'use client'

import { useLoader } from '@/hooks/useLoader'
import '@/styles/loader.css'
import { useEffect } from 'react'

export default function Loader() {
  const { num, start } = useLoader()

  useEffect(() => { start() }, [])

  return (
    <div className="loader">
      <div className="loader_bg" />
      <div className="loader_cnt">
        <div className="loader_tp Awrite">0</div>
        <div className="loader_tp Awrite">0</div>
      </div>
      <div className="loader_n">{String(num).padStart(3, '0')}</div>
    </div>
  )
}