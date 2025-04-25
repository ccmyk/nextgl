"use client";
import AboutIntro from "@/components/views/AboutIntro";
import AboutDual from "@/components/views/AboutDual";
import AboutView from "@/components/views/AboutView";

export default function AboutPage() {
  return (
    <main className="about-page">
      <AboutIntro />
      <AboutDual />
      <AboutView />
    </main>
  );
}