// src/app/not-found.js
"use client";
import ErrorIntro from "@/components/views/ErrorIntro";
import ErrorView from "@/components/views/ErrorView";

export default function NotFound() {
  return (
    <main className="error-page">
      <ErrorIntro />
      <ErrorView />
    </main>
  );
}