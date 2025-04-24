'use client'
import { useEffect } from 'react'
import { loadImages, loadVideos } from '@/lib/pageAssets'
export function usePageLifecycle() {
  useEffect(() => {
    // After splash, preload images/videos
    loadImages().then(() => console.log('images loaded'))
    loadVideos().then(() => console.log('videos loaded'))
    // then run page intro animations, e.g. via GSAP
  }, [])
}