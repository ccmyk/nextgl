'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useResize } from '../../hooks/page/useResize'; // Assuming this is correct path

const LazyImage = ({ src, alt = '', className = '', ...props }) => {
  const imgRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { h, max, checkObj } = useResize(imgRef);

  useEffect(() => {
    const imgEl = imgRef.current;
    if (!imgEl || !src) return;

    let observer;

    const loadImage = () => {
      const tempImg = new Image();
      tempImg.src = src;
      tempImg.onload = () => {
        if (imgEl) {
          imgEl.src = src;
          setLoaded(true);
        }
      };
    };

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        // Mimic legacy behavior with undefined check
        if (entry.isIntersecting == undefined) {
          return;
        }

        if (entry.isIntersecting) {
          setIsVisible(true);
          if (!loaded && !imgEl.getAttribute('src')) {
            loadImage();
          }
          observer.disconnect();
        } else {
          setIsVisible(false);
        }
      });
    };

    observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.1, // Adjust as needed to match legacy
    });

    observer.observe(imgEl);

    return () => {
      if (observer) {
        if (observer) {
          observer.disconnect();
        }
      }
    };
  }, [src, loaded, h, max, checkObj]);

  useEffect(() => {
    const imgEl = imgRef.current;
    if (!imgEl) return;

    imgEl.classList.toggle('ivi', isVisible);
  }, [isVisible]);

  useEffect(() => {
    const imgEl = imgRef.current;
    if (!imgEl) return;

    if (loaded) {
      imgEl.classList.add('Ldd');
      imgEl.removeAttribute('data-lazy');
    }
  }, [loaded]);

  useEffect(() => {
    if (/\.(gif)$/.test(src) && imgRef.current) {
      imgRef.current.src = src;
      imgRef.current.classList.add('Ldd');
      setLoaded(true);
    }
  }, [src]);

  return (
    <img
      ref={imgRef}
      alt={alt}
      data-lazy={src}
      className={`lazy-img ${loaded ? 'Ldd' : ''} ${className}`.trim()}
      {...props}
    />
  );
};

export default LazyImage;