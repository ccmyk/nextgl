'use client'

import { createContext, useContext } from 'react'

const AppEventsContext = createContext({
  dispatchAnim: (state, el) => {},
})

export function AppEventsProvider({ children }) {
  const dispatchAnim = (state, el) => {
    const ev = new CustomEvent('anim', { detail: { el, state, style: 0, params: [0] } })
    document.dispatchEvent(ev)
  }

  return (
    <AppEventsContext.Provider value={{ dispatchAnim }}>
      {children}
    </AppEventsContext.Provider>
  )
}

export function useAppEvents() {
  return useContext(AppEventsContext)
}