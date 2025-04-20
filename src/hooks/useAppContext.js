// src/context/useAppContext.js

import { useContext } from 'react'
import { AppContext } from './AppProvider'

export function useAppContext() {
  return useContext(AppContext)
}