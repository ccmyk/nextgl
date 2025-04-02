// src/app/fonts.js

import localFont from 'next/font/local'

// For local fonts (equivalent to your montreal and montrealbook)
export const montreal = localFont({
  src: [
    {
      path: '../../public/fonts/PPNeueMontreal-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-montreal',
  display: 'swap',
})

export const montrealBook = localFont({
  src: [
    {
      path: '../../public/fonts/PPNeueMontrealMono-Book.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-montreal-book',
  display: 'swap',
})

export const air = localFont({
  src: [
    {
      path: '../../public/fonts/PPAir-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-air',
  display: 'swap',
})
