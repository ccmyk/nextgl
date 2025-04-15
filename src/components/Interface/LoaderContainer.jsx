// src/components/Interface/LoaderContainer.jsx

'use client'

import { useEffect, useRef } from 'react'
import Loader from '@/components/webgl/Loader/Loader'
import LoaderDOM from '@/components/Interface/LoaderDOM'

export default function LoaderContainer() {
  const loaderDomRef = useRef(null)

  useEffect(() => {
    // Call start() on the DOM loader after mount
    if (loaderDomRef.current && loaderDomRef.current.start) {
      loaderDomRef.current.start()
    }
  }, [])

  return (
    <>
      {/* WebGL shader-based Loader */}
      <Loader />

      {/* DOM-based animated loader */}
      <LoaderDOM ref={loaderDomRef} />
    </>
  )
}
