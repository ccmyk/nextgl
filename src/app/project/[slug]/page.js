// src/app/project/[slug]/page.js
"use client";
import { useParams } from "next/navigation";
import ProjectIntro from "@/components/views/ProjectIntro";
import ProjectIOIn from "@/components/views/ProjectIOIn";
import ProjectView from "@/components/views/ProjectView";

export default function ProjectPage() {
  const { slug } = useParams();
  return (
    <main className="project-page" data-slug={slug}>
      <ProjectIntro />
      <ProjectIOIn />
      <ProjectView />
    </main>
  );
}