// src/hooks/page/useDynamicCreation.js

import { useContext, useEffect } from 'react';
import { PageComponentsContext } from '@/context/PageComponentsContext';

/**
 * Port of legacy comps.js startComps/removeComps.
 * Expects context value:
 * { components: Record<string, { load?:fn, initEvents?:fn, removeEvents?:fn }[]> }
 */
export function useDynamicCreation() {
  const { components } = useContext(PageComponentsContext);

  useEffect(() => {
    // startComps
    Object.values(components).forEach(arr => {
      arr.forEach(({ load, initEvents }) => {
        if (load) load();
        if (initEvents) initEvents();
      });
    });
    return () => {
      // stopComps
      Object.values(components).forEach(arr => {
        arr.forEach(({ removeEvents }) => {
          if (removeEvents) removeEvents();
        });
      });
    };
  }, [components]);
}