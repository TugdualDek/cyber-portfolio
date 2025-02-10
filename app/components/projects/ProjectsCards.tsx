import { memo, useMemo } from "react";
import { Badge } from "../../components/ui/badge";
import { Github, ExternalLink } from "lucide-react";

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

const STATUS_STYLES = {
  completed: "border-green-500 text-green-500",
  "in-progress": "border-yellow-500 text-yellow-500",
  planned: "border-blue-500 text-blue-500",
} as const;

// Composants mémorisés
const ProjectHeader = memo(({ index, status }: { index: number; status: Project["status"] }) => (
  <div className="bg-navy-800 border-b border-cyber-primary/30 p-3 flex justify-between items-center">
    <div className="flex items-center gap-2">
      <span className="text-cyber-primary/60 font-mono text-xs">
        MISSION_{(index + 1).toString().padStart(2, "0")}
      </span>
    </div>
    <Badge variant="outline" className={`font-mono text-xs ${STATUS_STYLES[status as keyof typeof STATUS_STYLES]}`}>
      {status.toUpperCase()}
    </Badge>
  </div>
));

const ProjectImage = memo(({ image, title }: { image: string; title: string }) => (
  <div className="relative h-48 border-b border-cyber-primary/30">
    <img
      src={image}
      alt={title}
      className="w-full h-full object-cover"
      loading="lazy"
      decoding="async"
    />
    <div className="absolute inset-0 bg-navy-900/40" />
    <div className="absolute inset-0 grid-background" />
    <CornerMarkers />
    <ImageOverlay />
  </div>
));

const CornerMarkers = memo(() => (
  <>
    <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-cyber-primary/60" />
    <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-cyber-primary/60" />
    <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-cyber-primary/60" />
    <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-cyber-primary/60" />
  </>
));

const ImageOverlay = memo(() => (
  <div className="absolute bottom-0 left-0 right-0 bg-navy-900/80 p-2">
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-1.5 bg-cyber-primary rounded-full animate-pulse" />
      <span className="text-cyber-primary/80 font-mono text-xs">VISUAL_DATA</span>
    </div>
  </div>
));

const ProjectLinks = memo(({ links }: { links: Project["links"] }) => (
  <div className="flex gap-4 pt-2 border-t border-cyber-primary/20">
    {links.github && (
      <ProjectLink href={links.github} icon={<Github className="w-4 h-4" />} label="SOURCE" />
    )}
    {links.demo && (
      <ProjectLink href={links.demo} icon={<ExternalLink className="w-4 h-4" />} label="DEPLOY" />
    )}
  </div>
));

const ProjectLink = memo(({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
  <a
    href={href}
    className="text-cyber-primary/60 hover:text-cyber-primary transition-colors flex items-center gap-2 text-xs font-mono"
    target="_blank"
    rel="noopener noreferrer"
  >
    {icon}
    <span>{label}</span>
  </a>
));

export const ProjectCard = memo(({ project, index }: { project: Project; index: number }) => {
  const randomRotate = useMemo(() => 
    `${(Math.random() * 1.5 - 0.75).toFixed(2)}deg`, 
    []
  );

  return (
    <div
      className="bg-navy-900/90 border border-cyber-primary/30 rounded
                relative overflow-hidden transition-all duration-300
                hover:border-cyber-primary hover:shadow-lg hover:shadow-cyber-primary/10
                transform-gpu"
      style={{ transform: `rotate(${randomRotate})` }}
    >
      <ProjectHeader index={index} status={project.status} />
      {project.image && <ProjectImage image={project.image} title={project.title} />}

      <div className="p-4 space-y-4">
        <h3 className="text-xl font-mono text-cyber-primary border-l-2 border-cyber-primary pl-2">
          {project.title}
        </h3>

        <p className="text-cyber-primary/70 font-mono text-sm leading-relaxed whitespace-pre-line">
          {project.description}
        </p>

        <div className="space-y-2">
          <div className="text-xs font-mono text-cyber-primary/50">TECHNOLOGIES:</div>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <Badge
                key={tech}
                variant="outline"
                className="bg-cyber-primary/5 border-cyber-primary/40
                         text-cyber-primary font-mono text-xs
                         hover:bg-cyber-primary/10 transition-colors"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        <ProjectLinks links={project.links} />
      </div>
    </div>
  );
});

ProjectCard.displayName = "ProjectCard";
