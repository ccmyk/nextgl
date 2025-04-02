import { useEffect, useRef } from 'react';

const useBaseComponent = (device) => {
  const elRef = useRef(null); // Replaces `this.DOM.el`
  const isActive = useRef(false); // Replaces `this.active`

  useEffect(() => {
    console.log('Base component initialized for device:', device);
    isActive.current = true;

    return () => {
      console.log('Base component cleanup');
      isActive.current = false;
    };
  }, [device]);

  return { elRef };
};

export default useBaseComponent;