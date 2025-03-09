import { useState, useCallback } from "react";
import { useNavigate } from "@remix-run/react";
import { MetaFunction } from "@remix-run/node";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

const BOOT_SEQUENCE = [
  ["INITIALIZING SYSTEM KERNEL", 400],
  ["LOADING SECURITY PROTOCOLS", 500],
  ["ESTABLISHING SECURE CONNECTION", 600],
  ["AUTHENTICATING USER CREDENTIALS", 700],
  ["ACCESSING CONTROL CENTER", 800],
] as const;

export const meta: MetaFunction = () => [
  { title: "Tugdual de Kerdrel" },
  { name: "description", content: "Portfolio - Tugdual de Kerdrel" },
];

export default function CommandCenter() {
  const [bootStep, setBootStep] = useState(-1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [destination, setDestination] = useState("");
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    setIsTransitioning(true);
    setDestination(path);

    // Start boot sequence
    setBootStep(0);

    // Boot sequence will handle navigation after completion
  };

  // Modified boot sequence to handle both destinations
  const handleBootSequence = useCallback(() => {
    if (bootStep < BOOT_SEQUENCE.length - 1) {
      const timer = setTimeout(() => {
        setBootStep((prev) => prev + 1);
      }, BOOT_SEQUENCE[bootStep]?.[1] || 800);

      return () => clearTimeout(timer);
    } else if (bootStep === BOOT_SEQUENCE.length - 1) {
      const timer = setTimeout(() => navigate(destination), 800);
      return () => clearTimeout(timer);
    }
  }, [bootStep, navigate, destination]);

  // Run boot sequence when bootStep changes
  if (bootStep >= 0) {
    handleBootSequence();
  }

  // If transitioning, show boot sequence
  if (isTransitioning) {
    const progress = Math.min(
      ((bootStep + 1) / BOOT_SEQUENCE.length) * 100,
      100
    );

    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        {/* Matrix Background */}
        <div className="absolute inset-0 text-green-500/5 font-mono text-sm overflow-hidden">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="whitespace-nowrap animate-slideDown"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>

        <div className="w-full max-w-2xl space-y-8 relative z-10">
          {/* Terminal */}
          <div className="border border-green-500/20 rounded-t-lg ">
            <div className="px-4 py-2 border-b border-green-500/20 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
              <span className="ml-2 text-green-500/60 text-sm font-mono">
                terminal@tugdual
              </span>
            </div>
            <div className="p-6 font-mono text-sm space-y-2">
              {BOOT_SEQUENCE.map(
                ([text], index) =>
                  index <= bootStep && (
                    <div key={index} className="text-green-500/80">
                      <span className="text-green-500/40">{">_ "}</span>
                      {text}
                      {index === bootStep && (
                        <span className="inline-block w-2 h-4 bg-green-500/60 animate-pulse ml-1" />
                      )}
                    </div>
                  )
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="h-1 bg-gray-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs font-mono text-green-500/60">
              <span>BOOT SEQUENCE: {Math.round(progress)}%</span>
              <span className="animate-pulse">{">_"}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, show selection screen
  return (
    <div className="min-h-screen text-white flex items-center justify-center p-4">
      {/* Background existant */}

      <Card className="w-full max-w-4xl bg-gray-900/80 border border-green-500/30">
        <CardHeader className="text-center border-b border-green-500/20 pb-4">
          <CardTitle className="text-3xl text-green-500">
            Tugdual de Kerdrel
          </CardTitle>
          <p className="text-green-500/60 mt-2">
            Student @ ISEP | System Administrator @ Bilendi
          </p>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Aperçu Dashboard */}
            <div className="space-y-4">
              <div className="relative h-40 border border-green-500/20 rounded overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-70"
                  style={{
                    backgroundImage: "url(/assets/dashboard-preview.webp)",
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                <div className="absolute bottom-0 p-3">
                  <h3 className="text-xl text-white font-bold">
                    Classic Dashboard
                  </h3>
                  <p className="text-sm text-white/80">
                    Professional portfolio with my skills and projects
                  </p>
                </div>
              </div>
              <Button
                className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 h-12"
                onClick={() => handleNavigation("/dashboard")}
              >
                Enter Dashboard
              </Button>
            </div>

            {/* Aperçu Terminal */}
            <div className="space-y-4">
              <div className="relative h-40 border border-green-500/30 rounded overflow-hidden">
                <div className="p-3 bg-black h-full flex flex-col">
                  <div className="flex items-center gap-2 pb-2 border-b border-green-500/20">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                  </div>
                  <div className="text-green-500 text-xs mt-2 flex-grow overflow-hidden">
                    <p>visitor@tugdual-server:~$ whoami</p>
                    <p>visitor</p>
                    <p>visitor@tugdual-server:~$ ls</p>
                    <p>README.md projects/ skills/</p>
                  </div>
                </div>
              </div>
              <Button
                className="w-full bg-black hover:bg-gray-900 text-green-500 border border-green-500 h-12"
                onClick={() => handleNavigation("/terminal")}
              >
                Launch Terminal
              </Button>
            </div>
          </div>

          {/* Bouton pour le blog à ajouter */}
          <div className="mt-8 border-t border-green-500/20 pt-4">
            <Button
              className="w-full bg-black hover:bg-gray-900 text-blue-400 border border-blue-500/30 h-12 inline-flex items-center justify-center"
              onClick={() => handleNavigation("/blog")}
              disabled
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z"
                  clipRule="evenodd"
                />
              </svg>
              Field Reports & Analysis (Blog)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
