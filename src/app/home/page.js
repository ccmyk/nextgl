"use client";
import { useEffect, useState } from "react";
import WebGLCanvas from "@/components/WebGLCanvas";
import useAnimations from "@/lib/animations/useAnimations";
import Page from "@/lib/utils/pageMain";
import Intro from "@/app/home/intro";
import { fetchSiteSettings } from "@/lib/startup/fetchSiteSettings";
import styles from "@/styles/components/hero.module.pcss";

export default function HomePage() {
  useAnimations();
  const [siteContent, setSiteContent] = useState("");

  useEffect(() => {
    async function fetchContent() {
      try {
        const settings = await fetchSiteSettings();
        setSiteContent(settings?.content || "<p>Loading...</p>");
      } catch (error) {
        console.error("Failed to load site settings:", error);
      }
    }
    fetchContent();
  }, []);

  return (
    <div id="home-page">
      {/* WebGL Background */}
      <WebGLCanvas />

      {/* Hero / Intro Section */}
      <section className={styles.home_hero}>
        <div dangerouslySetInnerHTML={{ __html: siteContent }} />
      </section>

      {/* CMS content here */}
      <div id="content" dangerouslySetInnerHTML={{ __html: siteContent }} />
    </div>
  );
}

  async create(content, main, temp = undefined) {
    super.create(content, main);

    if (temp !== undefined) {
      document.querySelector("#content").insertAdjacentHTML("afterbegin", temp);
    } else {
      let data = await fetchSiteSettings();
      document.querySelector("#content").insertAdjacentHTML("afterbegin", data.homeContent);
    }

    this.el = document.querySelector("main");
    this.DOM = { el: this.el };

    // Check if WebGL is supported
    if (this.initWebGL()) {
      console.log("WebGL initialized successfully.");
    } else {
      console.warn("WebGL failed, falling back to static assets.");
      await this.loadImages();
      await this.loadVideos();
    }

    await this.createComps();
    await this.createIos();
    await this.getReady();
  }

  async createComps() {
    await super.createComps();
    if (this.DOM.el.querySelector(".home_intro")) {
      this.components.intro = new Intro(this.DOM.el.querySelector(".home_intro"), this.main.device);
    }
  }

  async animIntro(val) {
    if (this.components.intro) {
      this.components.intro.start();
    }
    return val;
  }

  async animOut() {
    super.animOut();
  }
}

export default Home;