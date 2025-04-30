'use client';

import { useRef, useEffect } from 'react';
import { useInView }         from '@/hooks/useIntersectionObserver';
import AnimatedWrite         from '@/components/webgl/AnimatedWrite';
import Title                 from '@/components/webgl/Title';
import '@/styles/components/home_hero.pcss';

export default function HomeHero() {
  const heroRef = useRef(null);
  const inView  = useInView(heroRef, { threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      // fire your GSAP/animation timelines here
    }
  }, [inView]);

  const words = [
    { text: 'Chris', l: '-0.022', idx: 0 },
    { text: 'Hall',  l: '-0.016', idx: 1 },
  ];

  return (
    <section ref={heroRef} className="home_hero">
      <div className="c‑vw cnt">
        <div className="cnt_hold">

          {/*** cnt_tt ***/}
          <h2 className="cnt_tt">
            {words.map(({ text, l, idx }) => (
              <div key={idx} className="Atitle">
                <div className="cCover">
                  {/** WebGL canvas **/}
                  <Title text={text} index={idx} className="glF" />
                </div>
                {/** placeholder overlay **/}
                <div
                  className="Oi Oi-tt"
                  data-temp="tt"
                  data-l={l}
                  data-m="5"
                  data-text={text}
                  data-oi={idx}
                  style={{ visibility: 'hidden' }}
                />
                {/** actual split‑text **/}
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

          {/*** cnt_bt ***/}
          <div className="cnt_bt inview stview">
            {/** placeholder for h3 **/}
            <div
              className="iO"
              data-io="0"
              style={{ visibility: 'hidden' }}
            />
            <h3 className="tt3">
              Art Director &amp; Designer<br/>
              Living in Los Angeles
            </h3>

            <h4
              className="Awrite inview stview ivi"
              data-params="1.6"
              style={{ opacity: 1 }}
            >
              {/** placeholder for h4 **/}
              <div
                className="iO iO-std"
                data-io="1"
                style={{ visibility: 'hidden' }}
              />
              {/** animated text **/}
              <AnimatedWrite className="word" data-io="1">
                PORTFOLIO_2025
              </AnimatedWrite>
            </h4>
          </div>

          {/*** cnt_sc ***/}
          <div className="cnt_sc">
            <h4
              className="Awrite inview stview okF"
              data-params="1.6"
              data-bucle="1"
              style={{ opacity: 1 }}
            >
              <div
                className="iO iO-std"
                data-io="2"
                style={{ visibility: 'hidden' }}
              />
              <AnimatedWrite className="word" data-io="2">
                [Scroll to Explore]
              </AnimatedWrite>
            </h4>
          </div>

          {/*** cnt_lk ***/}
          <div className="cnt_lk">
            {[
              { href: 'https://drive.google.com/…', text: 'Resume',   io: 3 },
              { href: 'https://linkedin.com/in/…', text: 'LinkedIn', io: 4 }
            ].map(({ href, text, io }) => (
              <a
                key={io}
                className="Awrite inview stview ivi"
                data-params="0"
                href={href}
                target="_blank"
                rel="noopener"
                style={{ opacity: 1 }}
              >
                <div
                  className="iO iO-std"
                  data-io={io}
                  style={{ visibility: 'hidden' }}
                />
                <AnimatedWrite className="word" data-io={io}>
                  {text}
                </AnimatedWrite>
                <i style={{ display: 'inline-block', position: 'relative' }}>
                  <svg
                    viewBox="0 0 7 7"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ display: 'inline-block', position: 'relative' }}
                  >
                    <path
                      d="M6.49194 3.516H5.67594L5.67594 2.052L5.74794 1.272L5.71194 1.26L4.94394 2.124L0.911938 6.156L0.335937 5.58L4.36794 1.548L5.23194 0.78L5.21994 0.743999L4.43994 0.816L2.97594 0.816V0L6.49194 0L6.49194 3.516Z"
                      fill="black"
                    />
                  </svg>
                </i>
              </a>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}