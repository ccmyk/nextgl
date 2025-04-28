// src/context/AppEventsContext.js

import React, { createContext } from 'react';
import mitt from 'mitt';

const emitter = mitt();

export const AppEventsContext = createContext({
  on: () => () => {},
  emit: () => {},
});

export function AppEventsProvider({ children }) {
  const value = {
    on: (type, handler) => {
      emitter.on(type, handler);
      return () => emitter.off(type, handler);
    },
    emit: (type, payload) => emitter.emit(type, payload),
  };

  return (
    <AppEventsContext.Provider value={value}>
      {children}
    </AppEventsContext.Provider>
  );
}