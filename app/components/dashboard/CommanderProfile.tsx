import { COMMANDER_INFO } from "~/constants/constants";
import { StatusCard } from "../ui/StatusCard";
import { Link } from "@remix-run/react";

export function CommanderProfile({ info }: { info: typeof COMMANDER_INFO }) {
  return (
    <div
      className="relative bg-gradient-to-br from-navy-800/40 to-navy-900/30 
                 rounded-2xl p-4 border border-cyber-primary/20
                 backdrop-blur-xl hover:border-cyber-primary/40 
                 transition-all duration-300
                 shadow-[0px_0px_15px_2px_rgba(222,252,186,0.1)]
                 hover:shadow-[0px_0px_25px_4px_rgba(222,252,186,0.2)]"
    >
      {/* Effet de gradient subtil */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <div
          className="absolute -inset-10 bg-gradient-to-br from-cyber-primary/5 
                        via-transparent to-cyber-secondary/5 blur-3xl"
        />
      </div>

      <div className="relative text-center space-y-6 z-10">
        {/* Avatar modernisé */}
        <div className="relative w-44 h-44 mx-auto">
          {/* Glow effet subtil */}
          <div className="absolute inset-0 bg-cyber-primary/20 rounded-full blur-2xl" />

          {/* Border gradient */}
          <div
            className="absolute -inset-0.5 bg-gradient-to-r from-cyber-primary/50 
                          to-cyber-secondary/50 rounded-full"
          />

          <div
            className="relative w-full h-full rounded-full overflow-hidden 
                          bg-navy-900 p-0.5"
          >
            <img
              src="/assets/tugdual.webp"
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
              loading="eager"
              decoding="async"
              width={176}
              height={176}
            />
          </div>

          {/* Badge de statut moderne */}
          <div className="absolute -bottom-1 right-4">
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 
                            bg-navy-900/95 backdrop-blur-md rounded-full 
                            border border-green-500/30"
            >
              <div className="h-1.5 w-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-[10px] text-green-400/90 font-mono uppercase">
                {info.status}
              </span>
            </div>
          </div>
        </div>

        {/* Informations avec typographie moderne */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold  tracking-tight">{info.name}</h2>
          <div className="flex items-center justify-center gap-3">
            <span
              className="w-12 h-px bg-gradient-to-r from-transparent 
                            via-cyber-primary/30 to-transparent"
            />
            <span className="text-cyber-primary/70 font-mono text-sm uppercase tracking-wider">
              {info.rank}
            </span>
            <span
              className="w-12 h-px bg-gradient-to-r from-transparent 
                            via-cyber-primary/30 to-transparent"
            />
          </div>
        </div>

        {/* Boutons d'action modernisés */}
        <div className="flex gap-3 justify-center items-center">
          {/* Bouton Contact */}
          <Link
            to="/contact"
            className="group relative px-4 sm:px-5 py-2.5 overflow-hidden
               bg-navy-900/50 hover:bg-navy-900/70
               border border-cyber-primary/40 hover:border-cyber-primary/60
               rounded-xl transition-all duration-300
               flex items-center gap-2
               backdrop-blur-sm"
          >
            <span
              className="text-sm font-medium text-cyber-primary/90 
                     group-hover:text-cyber-primary"
            >
              Send a message
            </span>
            <span
              className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent 
                 via-cyber-primary/20 to-transparent 
                 translate-x-[-200%] group-hover:translate-x-[200%] 
                 transition-transform duration-1000"
            />
          </Link>

          {/* Bouton Download CV */}
          <a
            href="/assets/cv.pdf"
            download="CV_TugdualAudrendeKerdrel.pdf"
            className="group relative px-4 sm:px-5 py-2.5 overflow-hidden
               bg-gradient-to-r from-purple-600/20 to-blue-600/20
               hover:from-purple-600/30 hover:to-blue-600/30
               border border-purple-500/40 hover:border-purple-500/60
               rounded-xl transition-all duration-300
               flex items-center gap-2
               backdrop-blur-sm"
          >
            <span
              className="text-sm font-medium text-purple-300 
                     group-hover:text-purple-200"
            >
              Download my resume
            </span>
            <span
              className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent 
                 via-purple-500/20 to-transparent 
                 translate-x-[-200%] group-hover:translate-x-[200%] 
                 transition-transform duration-1000"
            />
          </a>
        </div>

        {/* Stats avec design moderne */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="group">
            <div
              className="bg-navy-900/30 backdrop-blur-sm rounded-xl p-4 
                            border border-cyber-primary/10 group-hover:border-cyber-primary/30
                            transition-all duration-300"
            >
              <div className="text-xs text-cyber-primary/60 font-mono uppercase mb-1">
                Experience
              </div>
              <div className="text-sm font-bold text-white/90">
                {info.experience}
              </div>
            </div>
          </div>
          <div className="group">
            <div
              className="bg-navy-900/30 backdrop-blur-sm rounded-xl p-4 
                            border border-cyber-primary/10 group-hover:border-cyber-primary/30
                            transition-all duration-300"
            >
              <div className="text-xs text-cyber-primary/60 font-mono uppercase mb-1">
                Clearance
              </div>
              <div className="text-sm font-bold text-white/90">
                {info.clearanceLevel}
              </div>
            </div>
          </div>
        </div>

        {/* Ligne de séparation moderne */}
        <div className="pt-4">
          <div className="h-px bg-gradient-to-r from-transparent via-cyber-primary/20 to-transparent" />
        </div>

        {/* Quick Links ou Social (optionnel) */}
        <div className="flex justify-center gap-4">
          <a
            href="https://github.com/TugdualDek"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-navy-900/30 border border-cyber-primary/10 
                       hover:border-cyber-primary/30 transition-all duration-300"
          >
            <svg
              className="w-4 h-4 text-cyber-primary/60 hover:text-cyber-primary"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
          <a
            href="https://linkedin.com/in/tugdual-de-kerdrel"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-navy-900/30 border border-cyber-primary/10 
                       hover:border-cyber-primary/30 transition-all duration-300"
          >
            <svg
              className="w-4 h-4 text-cyber-primary/60 hover:text-cyber-primary"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        </div>
      </div>

      {/* Coins décoratifs minimalistes */}
      <div
        className="absolute top-0 left-0 w-6 h-6 border-t border-l 
                      border-cyber-primary/20 rounded-tl-xl"
      />
      <div
        className="absolute top-0 right-0 w-6 h-6 border-t border-r 
                      border-cyber-primary/20 rounded-tr-xl"
      />
      <div
        className="absolute bottom-0 left-0 w-6 h-6 border-b border-l 
                      border-cyber-primary/20 rounded-bl-xl"
      />
      <div
        className="absolute bottom-0 right-0 w-6 h-6 border-b border-r 
                      border-cyber-primary/20 rounded-br-xl"
      />
    </div>
  );
}
