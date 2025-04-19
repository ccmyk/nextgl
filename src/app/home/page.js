// src/app/home/page.js

'use client'

import { useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Footer from '@/components/webgl/Footer/Footer'
import Background from '@/components/webgl/Background/Background'
import Title from '@/components/webgl/Title/Title'
import LoaderDOM from '@/components/Interface/LoaderDOM'
import useTextAnimation from '@/hooks/useTextAnimation'

export default function HomePage() {
  const heroRef = useRef(null)
  const ttRef = useRef(null)
  const textRef = useRef(null)

  useTextAnimation({ target: ttRef })
  useTextAnimation({ target: textRef })

  return (
    <main className="home">
      <section className="home_hero" ref={heroRef}>
        <canvas id="glBg" />
        <div className="Mbg">
          <div className="Mbg_col">
            <div className="Mbg_col_el Mbg_col_el-1" />
            <div className="Mbg_col_el Mbg_col_el-2" />
          </div>
        </div>

        <div id="content" data-template="home">
          <div className="cnt">
            <div className="cnt_hold">
              <h2 className="cnt_tt">
                <div className="Atitle">
                  <div className="cCover">
                    <canvas className="glF" />
                  </div>
                  <div className="Oi Oi-tt" data-text="Chris" />
                  <div className="ttj Oiel act" ref={ttRef} />
                </div>
                <div className="Atitle">
                  <div className="cCover">
                    <canvas className="glF" />
                  </div>
                  <div className="Oi Oi-tt" data-text="Hall" />
                  <div className="ttj Oiel act" ref={ttRef} />
                </div>
              </h2>

              <div className="cnt_bt inview stview">
                <h3 className="tt3">Designer + Art Director<br />Living in Los Angeles</h3>
                <h4 className="Awrite inview stview" ref={textRef}>
                  <div className="word">
                    <div className="char">Portfolio</div>
                  </div>
                </h4>
                <div className="cnt_lk">
                  <a className="Awrite inview stview" href="#">
                    <div className="iO iO-std" />
                    <div className="word">
                      <div className="char">Contact</div>
                    </div>
                  </a>
                  <a className="Awrite inview stview" href="#">
                    <div className="iO iO-std" />
                    <div className="word">
                      <div className="char">Work</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home_about">
        <div className="Oi Oi-bg" />
        <div className="c-vw cnt">
          <div className="cnt_tp">
            <h2 className="tt1 Oiel">
              <div className="word">
                <div className="char">About</div>
              </div>
            </h2>
          </div>
        </div>
      </section>

      <Footer />
      <Background />
      <Title />
      <LoaderDOM />
    </main>
  )
}