import { COMMANDER_INFO } from "~/constants/constants";
import { StatusCard } from "../ui/StatusCard";

export function CommanderProfile({ info }: { info: typeof COMMANDER_INFO }) {
  return (
    <div
      className="relative bg-navy-800/30 rounded-lg p-6 border border-cyber-primary/20
             backdrop-blur-sm hover:border-cyber-primary/40 transition-all duration-300
             shadow-[0px_0px_10px_4px_rgba(222,252,186,0.2)]"
    >
      {/* Coins en biais */}
      <div className="text-center space-y-6">
        {/* Avatar avec effet pulse */}
        <div className="relative w-40 h-40 mx-auto">
          <div
            className="absolute inset-0 rounded-full 
                 border-2 border-cyber-primary/30
                 animate-pulse"
          />
          <div className="absolute inset-2 rounded-full overflow-hidden">
            <img
              src="/assets/tugdual.webp"
              alt="Profile"
              width="160"
              height="160"
              loading="eager"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Informations */}
        <div className="space-y-2">
          <h2 className="text-2xl font-sans font-bold tracking-wider">
            {info.name}
          </h2>
          <div className="text-cyber-primary/60 font-sans text-sm">
            {info.rank}
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="h-2 w-2 bg-cyber-primary rounded-full animate-pulse" />
            <span className="text-cyber-primary/80 text-sm">{info.status}</span>
            <a
              href="/contact"
              className="ml-4 group flex items-center gap-2 text-sm font-mono
              text-cyber-primary/60 hover:text-cyber-primary
              transition-colors duration-300"
            >
              <span className="relative">
                SEND MESSAGE
                <span
                  className="absolute -bottom-1 left-0 w-0 h-0.5 
                     bg-cyber-primary transition-all duration-300
                     group-hover:w-full"
                />
              </span>
              <span
                className="transform transition-transform duration-300
                   group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <StatusCard label="EXPERIENCE" value={info.experience} />
          <StatusCard label="CLEARANCE" value={info.clearanceLevel} />
        </div>
      </div>
    </div>
  );
}
