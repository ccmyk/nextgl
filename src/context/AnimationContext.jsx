import { createContext, useContext, useRef, useCallback } from 'react';

const AnimationContext = createContext({
  registerAnimation: () => {},
  triggerAnimation: () => {},
});

export const AnimationProvider = ({ children }) => {
  const animations = useRef(new Map());
  
  const registerAnimation = useCallback((id, animationFn) => {
    animations.current.set(id, animationFn);
    return () => animations.current.delete(id);
  }, []);
  
  const triggerAnimation = useCallback((id, state = 1) => {
    const animFn = animations.current.get(id);
    if (animFn) animFn(state);
  }, []);
  
  return (
    <AnimationContext.Provider value={{ registerAnimation, triggerAnimation }}>
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = () => useContext(AnimationContext);