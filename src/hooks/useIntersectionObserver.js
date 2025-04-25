import { useState, useEffect, useRef } from 'react';

const useIntersectionObserver = (
  ref,
  { threshold = 0, root = null, rootMargin = '0%' }
) => {
  const [entry, setEntry] = useState(undefined);
  const observer = useRef(null);

  useEffect(() => {
    const current = ref.current; // Store current ref

    if (current) {
      const handleIntersect = (entries) => {
        setEntry(entries[0]);
      };

      observer.current = new IntersectionObserver(handleIntersect, {
        threshold,
        root,
        rootMargin,
      });

      observer.current.observe(current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [ref, threshold, root, rootMargin]);

  return entry;
};

export default useIntersectionObserver;