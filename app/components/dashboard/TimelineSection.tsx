import { GraduationCap, Trophy, Briefcase } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import React from "react";
import { TIMELINE_EVENTS } from "~/constants/profile";

interface TimelineEvent {
  title: string;
  description: string;
  date: string;
  type: "education" | "certification" | "experience";
}

type TimelineType = TimelineEvent["type"];

const typeConfig: Record<
  TimelineType,
  {
    icon: LucideIcon;
    color: string;
    border: string;
    glow: string;
    bg: string;
  }
> = {
  education: {
    icon: GraduationCap,
    color: "text-cyan-400",
    border: "border-cyan-400",
    glow: "shadow-[0_0_15px_rgba(34,211,238,0.3)]", // Glow cyan plus prononcé
    bg: "bg-cyan-400",
  },
  certification: {
    icon: Trophy,
    color: "text-green-400",
    border: "border-green-400",
    glow: "shadow-[0_0_15px_rgba(74,222,128,0.3)]", // Glow vert plus prononcé
    bg: "bg-green-400",
  },
  experience: {
    icon: Briefcase,
    color: "text-purple-400",
    border: "border-purple-400",
    glow: "shadow-[0_0_15px_rgba(192,132,252,0.3)]", // Glow violet plus prononcé
    bg: "bg-purple-400",
  },
};

export function TimelineSection() {
  return (
    <div className="bg-navy-800/30 rounded-lg p-6 border border-cyber-primary/20 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-8">
        <div className="h-2 w-2 bg-cyber-primary rounded-full" />
        <h2 className="text-xl font-mono text-cyber-primary">
          TIMELINE::SYSTEM_LOG
        </h2>
      </div>

      <div className="relative">
        {/* Ligne verticale */}
        <div className="absolute left-4 md:left-6 top-0 bottom-0 w-[2px] bg-cyber-primary/20" />

        <div className="space-y-8">
          {TIMELINE_EVENTS.map((event, index) => (
            <div
              key={index}
              className="relative pl-12 md:pl-16 transition-all duration-300 
                           hover:translate-x-2"
            >
              {/* Point sur la timeline */}
              <div
                className={`
    absolute left-[14px] md:left-[17px] top-1/2 -translate-y-1/2
    w-4 h-4 rounded-full 
    ${typeConfig[event.type as TimelineType].bg}
    border-2 border-navy-900
    shadow-lg ${typeConfig[event.type as TimelineType].glow}
    transition-all duration-300
    hover:scale-110 // Effet au hover sur le point
    hover:${
      typeConfig[event.type as TimelineType].glow
    } // Intensifie le glow au hover
  `}
              />

              <div
                className={`
    relative
    border ${typeConfig[event.type as TimelineType].border}/40
    rounded-lg p-4 
    transition-all duration-300
    hover:shadow-lg ${typeConfig[event.type as TimelineType].glow}
    hover:shadow-xl // Augmente l'effet au hover
    hover:scale-[1.02] // Léger effet de scale au hover
    bg-navy-900/30
    backdrop-blur-sm // Effet de flou en arrière-plan
    before:absolute before:left-[-8px] before:top-1/2 before:-translate-y-1/2
    before:w-2 before:h-2 before:rotate-45
    before:border-l before:border-b before:${
      typeConfig[event.type as TimelineType].border
    }/40
    before:bg-navy-900/30
  `}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {/* Remplacer le span de l'emoji par le composant icône */}
                      {React.createElement(
                        typeConfig[event.type as TimelineType].icon,
                        {
                          className: `w-5 h-5 ${
                            typeConfig[event.type as TimelineType].color
                          }`,
                        }
                      )}
                      <h3
                        className={`font-mono ${
                          typeConfig[event.type as TimelineType].color
                        }`}
                      >
                        {event.title}
                      </h3>
                    </div>
                    <p className="text-cyber-primary/80 text-sm">
                      {event.description}
                    </p>
                  </div>
                  <span className="text-cyber-primary/60 text-sm font-mono whitespace-nowrap">
                    {event.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
