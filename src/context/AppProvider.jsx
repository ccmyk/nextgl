// src/context/AppProvider.jsx

import React from 'react';
import { AppEventsProvider } from './AppEventsContext';
import { WebGLProvider }    from './WebGLContext';

export function AppProvider({ children }) {
  return (
    <AppEventsProvider>
      <WebGLProvider>
        {children}
      </WebGLProvider>
    </AppEventsProvider>
  );
}