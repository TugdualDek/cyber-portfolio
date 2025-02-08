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
  status: "completed" | "in-progress" | "planned";
}

export default function ProjectsSection() {
  return (
    <div className="relative max-w-7xl mx-auto py-15 px-6">
      {/* Header style NASA */}
      <div className="mb-12 border-b border-cyber-primary/30 pb-4">
        <div className="flex items-center gap-4 mb-2">
          <div className="h-3 w-3 bg-cyber-primary rounded-full animate-pulse" />
          <h2 className="font-mono text-2xl text-cyber-primary tracking-wider">
            MISSION CONTROL CENTER
          </h2>
        </div>
        <div className="flex items-center gap-4 text-sm font-mono">
          <span className="text-cyber-primary/60">STATUS: OPERATIONAL</span>
          <span className="text-cyber-primary/60">
            TIME: {new Date().toUTCString()}
          </span>
          <span className="text-cyber-primary animate-pulse">●</span>
        </div>
      </div>

      {/* Container avec padding pour éviter le rognage */}
      <div className="px-6 py-8 relative">
        {/* Effet de scan */}
        <div className="absolute inset-0 overflow-hidden flex justify-center">
          <div
            className="absolute w-[90%] h-[300px] animate-scan"
            style={{
              background: `
          linear-gradient(
            var(--scan-direction, to bottom),
            transparent 10%,
            rgba(0, 255, 136, 0.04) 45%,
            rgba(0, 255, 136, 0.06) 50%,
            rgba(0, 255, 136, 0.04) 55%,
            transparent 100%
          )
        `,
            }}
          />
        </div>

        {/* Grille de projets */}
        {/* Modification de la grille */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-auto grid-auto-flow-dense">
          {PROJECTS.map((project, index) => (
            <div
              key={project.id}
              className={`${project.image ? "row-span-2" : "row-span-1"}`}
            >
              <ProjectCard project={project as Project} index={index} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
