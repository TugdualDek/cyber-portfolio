import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Github, ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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

export function ProjectCard({ project, index }: { project: Project; index: number }) {
    const randomRotate = `${(Math.random() * 1.5 - 0.75).toFixed(2)}deg`;
    
    return (
        <div 
          className="bg-navy-900/90 border border-cyber-primary/30 rounded
                    relative overflow-hidden transition-all duration-300
                    hover:border-cyber-primary hover:shadow-lg hover:shadow-cyber-primary/10
                    transform-gpu"
          style={{ transform: `rotate(${randomRotate})` }}
        >
          {/* Terminal header */}
          <div className="bg-navy-800 border-b border-cyber-primary/30 p-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-cyber-primary/60 font-mono text-xs">
                MISSION_{(index + 1).toString().padStart(2, '0')}
              </span>
              <div className="h-1.5 w-1.5 bg-cyber-primary rounded-full animate-pulse" />
            </div>
            <Badge 
              variant="outline" 
              className={`font-mono text-xs
                ${project.status === 'completed' ? 'border-green-500 text-green-500' : ''}
                ${project.status === 'in-progress' ? 'border-yellow-500 text-yellow-500' : ''}
                ${project.status === 'planned' ? 'border-blue-500 text-blue-500' : ''}
              `}
            >
              {project.status.toUpperCase()}
            </Badge>
          </div>

          {/* Image avec overlay style terminal */}
          {project.image ?  (
            <div className="relative h-48 border-b border-cyber-primary/30">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              {/* Overlay avec effet scanline et grille */}
              <div className="absolute inset-0 bg-navy-900/40" />
              <div className="absolute inset-0 grid-background" />
              {/* Coin markers style terminal */}
              <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-cyber-primary/60" />
              <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-cyber-primary/60" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-cyber-primary/60" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-cyber-primary/60" />
              {/* Info overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-navy-900/80 p-2">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-cyber-primary rounded-full animate-pulse" />
                  <span className="text-cyber-primary/80 font-mono text-xs">
                    VISUAL_DATA
                  </span>
                </div>
              </div>
            </div>
          ): null}
  
          <div className="p-4 space-y-4">
            {/* Title with terminal style */}
            <h3 className="text-xl font-mono text-cyber-primary border-l-2 border-cyber-primary pl-2">
              {project.title}
            </h3>
  
            <p className="text-cyber-primary/70 font-mono text-sm leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
  
            {/* Technologies with terminal style */}
            <div className="space-y-2">
              <div className="text-xs font-mono text-cyber-primary/50">TECHNOLOGIES:</div>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map(tech => (
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
  
            {/* Links with terminal style */}
            <div className="flex gap-4 pt-2 border-t border-cyber-primary/20">
              {project.links.github && (
                <a href={project.links.github} 
                   className="text-cyber-primary/60 hover:text-cyber-primary transition-colors
                            flex items-center gap-2 text-xs font-mono"
                   target="_blank" 
                   rel="noopener noreferrer">
                  <Github className="w-4 h-4" />
                  <span>SOURCE</span>
                </a>
              )}
              {project.links.demo && (
                <a href={project.links.demo}
                   className="text-cyber-primary/60 hover:text-cyber-primary transition-colors
                            flex items-center gap-2 text-xs font-mono"
                   target="_blank"
                   rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                  <span>DEPLOY</span>
                </a>
              )}
            </div>
          </div>
        </div>
    );
}
