// src/hooks/useMouseEvents.js
import { useEffect } from 'react';

export function useMouseEvents({
  onMouseMove,
  onMouseDown,
  onMouseUp,
  onMouseEnter,
  onMouseLeave,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}) {
  useEffect(() => {
    // Attach desktop mouse events
    if (onMouseMove) window.addEventListener('mousemove', onMouseMove);
    if (onMouseDown) window.addEventListener('mousedown', onMouseDown);
    if (onMouseUp) window.addEventListener('mouseup', onMouseUp);

    // Attach element hover events (delegated)
    if (onMouseEnter)
      document.addEventListener('mouseenter', onMouseEnter, true);
    if (onMouseLeave)
      document.addEventListener('mouseleave', onMouseLeave, true);

    // Attach mobile touch events
    if (onTouchStart) window.addEventListener('touchstart', onTouchStart);
    if (onTouchMove) window.addEventListener('touchmove', onTouchMove);
    if (onTouchEnd) window.addEventListener('touchend', onTouchEnd);

    return () => {
      if (onMouseMove) window.removeEventListener('mousemove', onMouseMove);
      if (onMouseDown) window.removeEventListener('mousedown', onMouseDown);
      if (onMouseUp) window.removeEventListener('mouseup', onMouseUp);
      if (onMouseEnter)
        document.removeEventListener('mouseenter', onMouseEnter, true);
      if (onMouseLeave)
        document.removeEventListener('mouseleave', onMouseLeave, true);
      if (onTouchStart)
        window.removeEventListener('touchstart', onTouchStart);
      if (onTouchMove)
        window.removeEventListener('touchmove', onTouchMove);
      if (onTouchEnd) window.removeEventListener('touchend', onTouchEnd);
    };
  }, [
    onMouseMove,
    onMouseDown,
    onMouseUp,
    onMouseEnter,
    onMouseLeave,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  ]);
}
