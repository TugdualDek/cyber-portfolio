import { memo, useMemo } from "react";
import { GraduationCap, Trophy, Briefcase, Users } from "lucide-react";

import { TIMELINE_EVENTS } from "~/constants/constants";

interface TimelineEvent {
  title: string;
  description: string;
  date: string;
  type: "education" | "certification" | "experience" | "association";
}

type TimelineType = TimelineEvent["type"];

// Configuration des types d'événements
const TYPE_CONFIG = {
  education: {
    icon: GraduationCap,
    styles: {
      color: "text-cyan-400",
      border: "border-cyan-400",
      glow: "shadow-[0_0_15px_rgba(34,211,238,0.3)]",
      bg: "bg-cyan-400",
    },
  },
  certification: {
    icon: Trophy,
    styles: {
      color: "text-green-400",
      border: "border-green-400",
      glow: "shadow-[0_0_15px_rgba(74,222,128,0.3)]",
      bg: "bg-green-400",
    },
  },
  experience: {
    icon: Briefcase,
    styles: {
      color: "text-purple-400",
      border: "border-purple-400",
      glow: "shadow-[0_0_15px_rgba(192,132,252,0.3)]",
      bg: "bg-purple-400",
    },
  },
  association: {
    icon: Users,
    styles: {
      color: "text-orange-400",
      border: "border-orange-400",
      glow: "shadow-[0_0_15px_rgba(251,146,60,0.3)]",
      bg: "bg-orange-400",
    },
  },
} as const;

// Composants mémorisés
const TimelineHeader = memo(() => (
  <div className="flex items-center gap-2 mb-8">
    <div className="h-2 w-2 bg-cyber-primary rounded-full" />
    <h2 className="text-xl font-mono text-cyber-primary flex items-center">
      <span>TIMELINE::SYSTEM_LOG</span>
      <span className="inline-block w-[3px] h-5 ml-1 bg-cyber-primary animate-[cursor-blink_1.1s_steps(2)_infinite]" />
    </h2>
  </div>
));

const TimelineEventIcon = memo(({ type }: { type: TimelineEvent["type"] }) => {
  const { icon: Icon, styles } = TYPE_CONFIG[type];
  return (
    <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 md:w-8 md:h-8">
      <Icon className={`w-full h-full ${styles.color}`} strokeWidth={1.5} />
    </div>
  );
});

const TimelineEventCard = memo(({ event }: { event: TimelineEvent }) => {
  const { styles } = TYPE_CONFIG[event.type];
  
  return (
    <div className="relative pl-12 md:pl-16 transition-all duration-300 hover:translate-x-2">
      <div className={`absolute left-[9px] md:left-[17px] top-1/2 -translate-y-1/2
                      w-4 h-4 rounded-full ${styles.bg} border-2 border-navy-900
                      shadow-lg ${styles.glow} transition-all duration-300
                      hover:scale-110`} />

      <div className={`relative border ${styles.border}/40 rounded-lg p-4 
                      transition-all duration-300 hover:shadow-lg ${styles.glow}
                      hover:scale-[1.02] bg-navy-900/30 backdrop-blur-sm
                      before:absolute before:left-[-8px] before:top-1/2 
                      before:-translate-y-1/2 before:w-2 before:h-2 before:rotate-45
                      before:border-l before:border-b before:${styles.border}/40
                      before:bg-navy-900/30`}>
        <div className="space-y-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <TimelineEventIcon type={event.type} />
              <h3 className={`font-mono text-sm md:text-base lg:text-lg ${styles.color} break-words`}>
                {event.title}
              </h3>
            </div>
            <span className="text-cyber-primary/60 text-sm font-mono whitespace-nowrap flex-shrink-0 pl-8 md:pl-0">
              {event.date}
            </span>
          </div>
          <p className="text-cyber-primary/80 text-sm pl-8 md:pl-10">
            {event.description}
          </p>
        </div>
      </div>
    </div>
  );
});

export const TimelineSection = memo(() => {
  const sortedEvents = useMemo(() => 
    [...TIMELINE_EVENTS].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ), 
    []
  );

  return (
    <div className="bg-navy-800/30 rounded-lg p-6 border border-cyber-primary/20 backdrop-blur-sm">
      <TimelineHeader />
      <div className="relative">
        <div className="absolute left-4 md:left-6 top-0 bottom-0 w-[2px] bg-cyber-primary/20" />
        <div className="space-y-8">
          {sortedEvents.map((event, index) => (
            <TimelineEventCard key={index} event={event as TimelineEvent} />
          ))}
        </div>
      </div>
    </div>
  );
});

TimelineSection.displayName = "TimelineSection";
