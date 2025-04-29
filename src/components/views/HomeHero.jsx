// src/components/views/HomeHero.jsx
'use client';

import { useRef, useEffect } from 'react';
import { useInView }         from '@/hooks/useIntersectionObserver';
import AnimatedWrite         from '@/components/AnimatedWrite';
import Title                 from '@/components/webgl/Title';
import '@/styles/components/homeHero.pcss';

export default function HomeHero() {
  const heroRef = useRef(null);
  const inView   = useInView(heroRef, { threshold: 0.1 });

  // Legacy GSAP timelines triggered on inView
  useEffect(() => {
    if (inView) {
      // e.g. gsap.fromTo(...), or useFrameMotion animations
      // match your legacy timings here
    }
  }, [inView]);

  // Words to render
  const words = [
    { text: 'Chris',   l: '-0.022', idx: 0 },
    { text: 'Hall',    l: '-0.016', idx: 1 },
  ];

  return (
    <section ref={heroRef} className="home_hero">
      <div className="c-vw cnt">
        <div className="cnt_hold">
          <h2 className="cnt_tt">
            {words.map(({ text, l, idx }) => (
              <div key={idx} className="Atitle">
                <div className="cCover">
                  {/* WebGL Title canvas */}
                  <Title
                    text={text}
                    index={idx}
                    className="glF"
                    data-temp="tt"
                    data-l={l}
                    data-m="5"
                    data-text={text}
                    data-oi={idx}
                  />
                </div>
                {/* Invisible split‐text “Oi” overlay (legacy placeholder) */}
                <div
                  className="Oi Oi-tt"
                  data-temp="tt"
                  data-l={l}
                  data-m="5"
                  data-text={text}
                  data-oi={idx}
                  style={{ visibility: 'hidden' }}
                />
                {/* Animated characters */}
                <AnimatedWrite
                  className="ttj Oiel act"
                  data-temp="Oiel"
                  data-oi={idx}
                >
                  {text}
                </AnimatedWrite>
              </div>
            ))}
          </h2>

          <div className="cnt_bt inview stview">
            <AnimatedWrite
              as="h3"
              className="tt3"
              data-io="0"
            >
              Art Director &amp; Designer<br />
              Living in Los Angeles
            </AnimatedWrite>
          </div>

          <h4
            className="Awrite inview stview ivi"
            data-params="1.6"
          >
            <AnimatedWrite
              className="iO iO-std"
              data-io="1"
            >
              PORTFOLIO_2025
            </AnimatedWrite>
          </h4>

          <div className="cnt_sc">
            <AnimatedWrite
              as="h4"
              className="Awrite inview stview okF"
              data-io="2"
              data-params="1.6"
              data-bucle="1"
            >
              [Sroll to Explore]
            </AnimatedWrite>
          </div>

          <div className="cnt_lk">
            <a
              className="Awrite inview stview ivi"
              data-params="0"
              href="https://drive.google.com/…"
              target="_blank"
              rel="noopener"
            >
              <AnimatedWrite
                className="iO iO-std"
                data-io="3"
              >
                Download Resume →
              </AnimatedWrite>
              <i>
                {/* legacy arrow SVG */}
                <svg
                  viewBox="0 0 7 7"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.49194 3.516H5.67594L5.67594 2.052…"
                    fill="black"
                  />
                </svg>
              </i>
            </a>
            <a
              className="Awrite inview stview ivi"
              data-params="0"
              href="https://www.linkedin.com/in/chrisryanhall"
              target="_blank"
              rel="noopener"
            >
              <AnimatedWrite
                className="iO iO-std"
                data-io="4"
              >
                LinkedIn
              </AnimatedWrite>
              <i>
                <svg
                  viewBox="0 0 7 7"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.49194 3.516H5.67594L…"
                    fill="black"
                  />
                </svg>
              </i>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}