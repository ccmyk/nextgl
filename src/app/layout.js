// src/app/layout.js

import '@/styles/index.css'
import { AppProvider } from '@/context/useAppContext'
import { LenisProvider } from '@/context/LenisProvider'
import { WebGLProvider } from '@/context/WebGLContext'
import Nav from '@/components/Interface/Nav'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <LenisProvider>
            <WebGLProvider>
              <Nav />
              {children}
            </WebGLProvider>
          </LenisProvider>
        </AppProvider>
      </body>
    </html>
  )
}