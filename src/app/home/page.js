"use client";
import HomeIntro from "@/components/views/HomeIntro";
import HomeView from "@/components/views/HomeView";

export default function HomePage() {
  return (
    <main className="home-page">
      <HomeIntro />
      <HomeView />
    </main>
  );
}