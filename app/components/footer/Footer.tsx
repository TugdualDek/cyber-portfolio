// components/layout/Footer.tsx
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import {
  Terminal,
  Shield,
  Radio,
  Power,
  Database,
  Network,
} from "lucide-react";
import { useEffect, useState } from "react";
import { SOCIAL_LINKS } from "~/constants/constants";
import { ServerTime } from "../ui/ServerTime";

export function Footer() {
  const [systemStatus, setSystemStatus] = useState({
    security: { status: "ACTIVE", isSecure: true },
    signal: { status: "STRONG", isStrong: true },
    power: { status: "100%", isOptimal: true },
    cpu: { level: 11, isHigh: true },
    memory: { level: 11, isHigh: true },
  });

  const randomBetween = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  // Mise à jour aléatoire des statuts
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus((prev) => {
        const isSecure = Math.random() > 0.5;

        return {
          security: {
            status: isSecure ? "ACTIVE" : "COMPROMISED",
            isSecure: isSecure, // Utilise la même valeur pour la cohérence
          },
          signal: {
            status: Math.random() > 0.7 ? "WEAK" : "STRONG",
            isStrong: Math.random() > 0.7,
          },
          power: {
            status: `${randomBetween(60, 100)}%`,
            isOptimal: Math.random() > 0.75,
          },
          cpu: {
            level: randomBetween(2, 20),
            isHigh: Math.random() > 0.7,
          },
          memory: {
            level: randomBetween(2, 20),
            isHigh: Math.random() > 0.7,
          },
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <footer
      className={`relative overflow-hidden transition-colors duration-500
        ${
          systemStatus.security.isSecure
            ? "bg-navy-800/30 border-cyber-primary/20"
            : "bg-red-900/30 border-red-500/20"
        }`}
    >
      <div className="max-w-7xl mx-auto py-8 px-6 relative">
        {/* Section principale */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Terminal Status */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-cyber-primary" />
              <h3 className="text-cyber-primary font-mono text-sm tracking-wider">
                TERMINAL_STATUS
              </h3>
            </div>
            <Separator className="bg-cyber-primary/20" />
            <div className="space-y-2 font-mono text-sm">
              <div
                className={`flex items-center gap-2 
          ${
            systemStatus.security.isSecure
              ? "text-cyber-primary/60"
              : "text-red-400"
          }`}
              >
                <Shield
                  className={`h-4 w-4 ${
                    !systemStatus.security.isSecure && "animate-pulse"
                  }`}
                />
                <span>SECURITY: {systemStatus.security.status}</span>
              </div>
              <div
                className={`flex items-center gap-2 
          ${
            systemStatus.signal.isStrong
              ? "text-cyber-primary/60"
              : "text-yellow-400"
          }`}
              >
                <Radio className="h-4 w-4 animate-pulse" />
                <span>SIGNAL: {systemStatus.signal.status}</span>
              </div>
              <div
                className={`flex items-center gap-2 
          ${
            systemStatus.power.isOptimal
              ? "text-cyber-primary/60"
              : "text-orange-400"
          }`}
              >
                <Power className="h-4 w-4" />
                <span>POWER: {systemStatus.power.status}</span>
              </div>
            </div>
          </div>

          {/* System Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-cyber-primary" />
              <h3 className="text-cyber-primary font-mono text-sm tracking-wider">
                SYSTEM_INFO
              </h3>
            </div>
            <Separator className="bg-cyber-primary/20" />
            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between text-cyber-primary/60">
                <span>CPU:</span>
                <span
                  className={
                    systemStatus.cpu.isHigh
                      ? "text-cyber-primary/60"
                      : "text-red-400"
                  }
                >
                  {"|".repeat(systemStatus.cpu.level)}
                </span>
              </div>
              <div className="flex justify-between text-cyber-primary/60">
                <span>MEMORY:</span>
                <span
                  className={
                    systemStatus.memory.isHigh
                      ? "text-cyber-primary/60"
                      : "text-red-400"
                  }
                >
                  {"|".repeat(systemStatus.memory.level)}
                </span>
              </div>
              <div className="flex justify-between text-cyber-primary/60">
                <span>UPTIME:</span>
                <ServerTime />
              </div>
            </div>
          </div>

          {/* Network Status */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Network className="h-4 w-4 text-cyber-primary" />
              <h3 className="text-cyber-primary font-mono text-sm tracking-wider">
                NETWORK_STATUS
              </h3>
            </div>
            <Separator className="bg-cyber-primary/20" />
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(SOCIAL_LINKS).map(
                ([key, { url, label, status }]) => (
                  <Button
                    key={key}
                    variant="ghost"
                    className="w-full justify-start font-mono text-xs text-cyber-primary/60 
                hover:text-cyber-primary hover:bg-cyber-primary/5 group"
                    asChild
                  >
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      <span
                        className={`w-2 h-2 rounded-full mr-2 transition-colors
            ${
              status === "ONLINE"
                ? "bg-cyber-primary/60 group-hover:bg-cyber-primary"
                : "bg-red-500/60 group-hover:bg-red-500"
            }`}
                      />
                      {label}
                    </a>
                  </Button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Copyright avec effet de glitch */}
        <Separator className="my-8 bg-cyber-primary/20" />
        <div className="text-center relative">
          <p className="text-cyber-primary/40 font-mono text-xs tracking-wider">
            © {new Date().getFullYear()} • Tugdual Audren de Kerdrel •
            ALL_RIGHTS_RESERVED
          </p>
        </div>
      </div>
    </footer>
  );
}
