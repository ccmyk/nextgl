// src/app/layout.js

import '@/styles/index.css'
import { AppProvider } from '@/context/AppProvider'
import { LenisProvider } from '@/context/LenisProvider'
import { WebGLProvider } from '@/context/WebGLContext'
import Nav from '@/components/Interface/Nav'
import { Inter } from 'next/font/google'
import ErrorBoundary from '@/components/ErrorBoundary'

// Font optimization
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

// Metadata configuration
export const metadata = {
  title: {
    template: '%s | NextGL',
    default: 'NextGL - Creative WebGL Experiences',
  },
  description: 'Explore creative WebGL experiences built with Next.js, Three.js, and GSAP.',
  keywords: ['WebGL', 'Next.js', 'Creative', '3D', 'Interactive', 'GSAP', 'Animation'],
  authors: [{ name: 'NextGL Team' }],
  creator: 'NextGL',
  publisher: 'NextGL',
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL('https://nextgl.example.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'NextGL - Creative WebGL Experiences',
    description: 'Explore creative WebGL experiences built with Next.js, Three.js, and GSAP.',
    url: 'https://nextgl.example.com',
    siteName: 'NextGL',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'NextGL - Creative WebGL Experiences',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NextGL - Creative WebGL Experiences',
    description: 'Explore creative WebGL experiences built with Next.js, Three.js, and GSAP.',
    creator: '@nextgl',
    images: ['/twitter-image.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#000000' },
    ],
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    title: 'NextGL',
    statusBarStyle: 'black-translucent',
    capable: true,
  },
  category: 'technology',
}

// Viewport configuration (moved from metadata)
export const viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* PWA specific meta tags */}
        <meta name="application-name" content="NextGL" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body>
        <ErrorBoundary fallback={<div>Something went wrong. Please refresh the page.</div>}>
          <AppProvider>
            <ErrorBoundary fallback={<div>Smooth scrolling unavailable.</div>}>
              <LenisProvider>
                <ErrorBoundary fallback={<div>WebGL content unavailable on your device.</div>}>
                  <WebGLProvider>
                    <Nav />
                    <main id="main-content">
                      {children}
                    </main>
                  </WebGLProvider>
                </ErrorBoundary>
              </LenisProvider>
            </ErrorBoundary>
          </AppProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
