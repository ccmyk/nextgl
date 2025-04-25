"use client";
import ProjectsIntro from "@/components/views/ProjectsIntro";
import ProjectsView from "@/components/views/ProjectsView";

export default function ProjectsPage() {
  return (
    <main className="projects-page">
      <ProjectsIntro />
      <ProjectsView />
    </main>
  );
}