'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useResize } from '../../hooks/page/useResize'; // Adjust path if needed

const LazyVideo = ({ src, auto = false, touch, canplay, animev, ...props }) => {
  const videoRef = useRef(null);
  const buttonRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [muted, setMuted] = useState(true); // Start muted
  const [toggling, setToggling] = useState(false);
  const { h, max, checkObj } = useResize(videoRef); // Pass videoRef

  const toggleAudio = useCallback(
    async (out = null) => {
      if (!buttonRef.current || toggling) {
        return;
      }

      setToggling(true);

      if (out === 1 || !muted) {
        setMuted(true);

        if (animev && animev.current) {
          animev.current.detail.state = -1;
          animev.current.detail.el = buttonRef.current.querySelector('.on');
          document.dispatchEvent(animev.current);

          await new Promise((resolve) => setTimeout(resolve, 64));

          if (animev && animev.current) {
            animev.current.detail.state = 1;
            animev.current.detail.el = buttonRef.current.querySelector('.off');
            document.dispatchEvent(animev.current);
          }
        }
      } else {
        setMuted(false);

        if (animev && animev.current) {
          animev.current.detail.state = -1;
          animev.current.detail.el = buttonRef.current.querySelector('.off');
          document.dispatchEvent(animev.current);

          await new Promise((resolve) => setTimeout(resolve, 64));

          if (animev && animev.current) {
            animev.current.detail.state = 1;
            animev.current.detail.el = buttonRef.current.querySelector('.on');
            document.dispatchEvent(animev.current);
          }
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 320));
      setToggling(false);
    },
    [muted, toggling, animev]
  );

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (auto) {
      videoEl.loop = true;
      videoEl.muted = true;
      videoEl.setAttribute('webkit-playsinline', 'webkit-playsinline');
      videoEl.setAttribute('playsinline', 'playsinline');

      if (touch) {
        videoEl.load();
      }
    }
  }, [auto, touch]);

  useEffect(() => {
    const videoEl = videoRef.current;
    const buttonEl = buttonRef.current;

    if (!videoEl) return;

    let observer;

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        // Mimic legacy check
        if (entry.isIntersecting == undefined) {
          return;
        }

        if (entry.isIntersecting) {
          setIsVisible(true);

          if (!loaded) {
            videoEl.src = videoEl.dataset.lazy;
          }

          if (!touch) {
            videoEl.play().catch((error) => {
              console.error('Playback failed:', error);
            });
          } else {
            videoEl.setAttribute('autoplay', 'true');
          }
          observer.disconnect();
        } else {
          setIsVisible(false);
          const isPlaying =
            videoEl.currentTime > 0 &&
            !videoEl.paused &&
            !videoEl.ended &&
            videoEl.readyState > videoEl.HAVE_CURRENT_DATA;

          if (isPlaying) {
            if (touch) {
              videoEl.setAttribute('autoplay', 'false');
              toggleAudio(1);
            } else {
              videoEl.pause();
              toggleAudio(1);
            }
          }
        }
      });
    };

    observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.1, // Adjust as needed
    });

    observer.observe(videoEl);

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [src, loaded, touch, toggleAudio]);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    videoEl.muted = muted;
  }, [muted]);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    videoEl.classList.toggle('ivi', isVisible);
  }, [isVisible]);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    videoEl.oncanplay = () => {
      setLoaded(true);
      videoEl.classList.add('Ldd');
    };

    videoEl.onplay = () => {
      // You might not need to store isPlaying in state,
      // videoEl.isPlaying is available directly
    };

    return () => {
      videoEl.oncanplay = null;
      videoEl.onplay = null;
    };
  }, [src]);

  useEffect(() => {
    const buttonEl = buttonRef.current;
    if (buttonEl) {
      buttonEl.onclick = () => toggleAudio();
    }

    if (animev && animev.current) {
      animev.current.detail.state = 0;
      animev.current.detail.el = buttonRef.current.querySelector('.on');
      document.dispatchEvent(animev.current);

      animev.current.detail.state = 0;
      animev.current.detail.el = buttonRef.current.querySelector('.off');
      document.dispatchEvent(animev.current);

      animev.current.detail.state = 1;
      animev.current.detail.el = buttonRef.current.querySelector('.off');
      document.dispatchEvent(animev.current);
    }
  }, [toggleAudio, animev]);

  return (
    <>
      <video
        ref={videoRef}
        data-lazy={src}
        className={`lazy-video ${loaded ? 'Ldd' : ''}`}
        {...props}
      />
      {/* Assuming the button structure is always present */}
      {/* You might need to adjust this depending on how the button is rendered */}
      {props.children}
      {props.hasButton && (
        <button ref={buttonRef} className="cAudio">
          <span className="on">ON</span>
          <span className="off">OFF</span>
        </button>
      )}
    </>
  );
};

export default LazyVideo;