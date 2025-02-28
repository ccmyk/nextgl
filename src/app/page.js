"use client";

import { useEffect, useRef, useState } from "react";
import Page from "@/lib/utils/pageMain";
import Intro from "@/app/home/intro/page";
import Scroll from "@/lib/utils/pageScroll";
import useBrowser from "@/lib/startup/useBrowser";

const HomePage = ({ content, main, temp }) => {
  const homeRef = useRef(null);
  const [pageContent, setPageContent] = useState("");

  useEffect(() => {
    const initHome = async () => {
      if (!homeRef.current) {
        homeRef.current = new Page(main);
      }
      const generatedContent = await homeRef.current.create(content, main, temp);
      setPageContent(generatedContent);
    };

    initHome();
  }, [content, main, temp]);

  useEffect(() => {
    if (homeRef.current && pageContent) {
      const contentElement = document.getElementById("content");
      if (contentElement) {
        homeRef.current.initializeDOM(contentElement);
      }
    }
  }, [pageContent]);

  return <div id="content" dangerouslySetInnerHTML={{ __html: pageContent }} />;
};

export default HomePage;