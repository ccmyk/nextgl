"use client";
"use client"import localFont from 'next/font/local'

export const montreal = localFont({
  src: '../assets/fonts/PPNeueMontreal-Medium.woff2',
  variable: '--font-montreal',
  display: 'swap',
  weight: '400',
  style: 'normal'
})

export const montrealbook = localFont({
  src: '../assets/fonts/PPNeueMontrealMono-Book.woff2',
  variable: '--font-montrealbook',
  display: 'swap',
  weight: '400',
  style: 'normal'
})

export const ppAir = localFont({
  src: '../assets/fonts/PPAir-Medium.woff2',
  variable: '--font-ppair',
  display: 'swap',
  weight: '500',
  style: 'normal'
}) 