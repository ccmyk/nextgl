// src/context/AppEventsContext.js

import { createContext } from 'react';
import mitt from 'mitt';

const emitter = mitt();

export const AppEventsContext = createContext({
  on: () => () => {},
  emit: () => {},
});

export function AppEventsProvider({ children }) {
  // Wrap mitt emitter into context value
  const value = {
    on: (type, handler) => {
      emitter.on(type, handler);
      return () => emitter.off(type, handler);
    },
    emit: (type, event) => emitter.emit(type, event),
  };

  return (
    <AppEventsContext.Provider value={value}>
      {children}
    </AppEventsContext.Provider>
  );
}