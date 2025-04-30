// src/app/home/page.jsx
'use client';

import { useScroll }          from '@/hooks/useScroll';
import Mbg                    from '@/components/interface/Mbg';
import WebglLoader            from '@/components/webgl/Loader';
import HomeHero               from '@/components/views/HomeHero';
import HomeIntro              from '@/components/views/HomeIntro';
import HomeView               from '@/components/views/HomeView';


export default function HomePage() {
  // run the global scroll‐state hook (toggles .stview/.scroll-up/down)
  useScroll();

  return (
    <main className="home">
      {/*
        1) LEGACY Mbg background grid
      */}
      <Mbg columns={14} />

      {/*
        2) GLOBAL WebGL loader canvas
      */}
      <WebglLoader />

      {/*
        3) HERO SECTION (home_hero) – mirrors legacy markup exactly
      */}
      <HomeHero />
        <div className="c-vw cnt">
          <div className="cnt_hold">
            <h2 className="cnt_tt">
              {/* First word */}
              <div className="Atitle">
                <div className="cCover">
                  <Title text="Chris" index={0} className="glF" />
                </div>
                <AnimatedWrite
                  className="Oi Oi-tt"
                  data-temp="tt"
                  data-l="-0.022"
                  data-m="5"
                  data-text="Chris"
                  data-oi="0"
                >
                  Eva
                </AnimatedWrite>
              </div>
              {/* Second word */}
              <div className="Atitle">
                <div className="cCover">
                  <Title text="Hall" index={1} className="glF" />
                </div>
                <AnimatedWrite
                  className="Oi Oi-tt"
                  data-temp="tt"
                  data-l="-0.016"
                  data-m="5"
                  data-text="Hall"
                  data-oi="1"
                >
                  Sánchez
                </AnimatedWrite>
              </div>
            </h2>

            {/* Sub‐headline + write‐in text */}
            <div className="cnt_bt inview stview">
              <AnimatedWrite
                as="h3"
                className="tt3"
                data-params="1.6"
              >
                Art Directory & Designer<br/>
                Living in Los Angeles
              </AnimatedWrite>
            </div>

            {/* Body write‐in paragraph */}
            <h4
              className="Awrite inview stview ivi"
              data-params="1.6"
            >
              <AnimatedWrite
                className="iO iO-std"
                data-io="1"
              >
                P O R T F O L I O
              </AnimatedWrite>
            </h4>

            {/* Call‐to‐action links */}
            <div className="cnt_lk">
              <a
                className="Awrite inview stview ivi"
                data-params="0"
                href="/projects"
              >
                <AnimatedWrite
                  className="iO iO-std"
                  data-io="2"
                >
                  View Projects →
                </AnimatedWrite>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/*
        4) LEGACY “0Intro” View
      */}
      <HomeIntro />

      {/*
        5) LEGACY main Home View
      */}
      <HomeView />
    </main>
  );
}