import { memo, useMemo } from "react";
import { ProjectCard } from "./ProjectsCards";
import { PROJECTS } from "~/constants/constants";

interface Project {
  id: string;
  title: string;
  description: string;
  date: string;
  technologies: string[];
  image?: string;
  links: {
    github?: string;
    demo?: string;
    article?: string;
  };
  status: string;
}

// Composants mémorisés
const ProjectHeader = memo(() => (
  <div className="mb-12 border-b border-cyber-primary/30 pb-4">
    <div className="flex items-center gap-4 mb-2">
      <div className="h-3 w-3 bg-cyber-primary rounded-full animate-pulse" />
      <h2 className="font-mono text-2xl text-cyber-primary tracking-wider">
        MISSION CONTROL CENTER
      </h2>
    </div>
    <StatusBar />
  </div>
));

const StatusBar = memo(() => (
  <div className="flex items-center gap-4 text-sm font-mono">
    <span className="text-cyber-primary/60">STATUS: OPERATIONAL</span>
    <time className="text-cyber-primary/60" dateTime={new Date().toISOString()}>
      TIME: {new Date().toUTCString()}
    </time>
  </div>
));

const ScanEffect = memo(() => (
  <div className="absolute inset-0 overflow-hidden flex justify-center">
    <div
      className="absolute w-[92%] h-[300px] animate-scan"
      style={{
        background: `linear-gradient(
          var(--scan-direction, to bottom),
          transparent 10%,
          rgba(0, 255, 136, 0.04) 45%,
          rgba(0, 255, 136, 0.08) 50%,
          rgba(0, 255, 136, 0.06) 55%,
          transparent 100%
        )`,
      }}
    />
  </div>
));

const ProjectGrid = memo(({ projects }: { projects: Project[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-auto">
    {projects.map((project, index) => (
      <div
        key={project.id}
        className={`${project.image ? "row-span-2" : "row-span-1"}`}
      >
        <ProjectCard project={project} index={index} />
      </div>
    ))}
  </div>
));

export default memo(function ProjectsSection() {
  // Trier les projets par date
  const sortedProjects = useMemo(() => 
    [...PROJECTS].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ),
    []
  );

  return (
    <div className="relative max-w-7xl mx-auto py-15 px-6">
      <ProjectHeader />
      
      <div className="px-6 py-4 relative">
        <ScanEffect />
        <ProjectGrid projects={sortedProjects} />
      </div>
    </div>
  );
});
