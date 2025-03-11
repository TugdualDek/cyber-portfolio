import { useState, useEffect, memo } from "react";
import { useNavigate } from "@remix-run/react";
import { MetaFunction } from "@remix-run/node";

const BOOT_SEQUENCE = [
  ["INITIALIZING SYSTEM KERNEL", 300],
  ["LOADING SECURITY PROTOCOLS", 400],
  ["ESTABLISHING SECURE CONNECTION", 500],
  ["AUTHENTICATING USER CREDENTIALS", 550],
  ["ACCESSING CONTROL CENTER", 600],
] as const;

export const meta: MetaFunction = () => [
  { title: "Tugdual de Kerdrel" },
  { name: "description", content: "Portfolio - Tugdual de Kerdrel" },
];

// Composant optimisé pour l'en-tête du terminal
const TerminalHeader = memo(() => (
  <div className="px-4 py-2 border-b border-green-500/20 flex items-center gap-2">
    <div className="w-3 h-3 rounded-full bg-red-500/50" />
    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
    <div className="w-3 h-3 rounded-full bg-green-500/50" />
    <span className="ml-2 text-green-500/60 text-sm font-mono">
      terminal@tugdual
    </span>
  </div>
));

// Composant optimisé pour la séquence de démarrage
const BootSequence = memo(({ step }: { step: number }) => {
  const progress = Math.min(
    ((step + 1) / BOOT_SEQUENCE.length) * 100,
    100
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Matrix Background - optimisé */}
      <div className="absolute inset-0 text-green-500/5 font-mono text-sm overflow-hidden">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="whitespace-nowrap animate-slideDown"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>

      <div className="w-full max-w-2xl space-y-8 relative z-10">
        {/* Terminal */}
        <div className="border border-green-500/20 rounded-t-lg">
          <TerminalHeader />
          <div className="p-6 font-mono text-sm space-y-2">
            {BOOT_SEQUENCE.map(([text], index) => (
              <div 
                key={index} 
                className={`text-green-500/80 ${step < index ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
              >
                <span className="text-green-500/40">{">_ "}</span>
                {text}
                {index === step && (
                  <span className="inline-block w-2 h-4 bg-green-500/60 animate-pulse ml-1" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-1 bg-gray-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-300"
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
});

export default function CommandCenter() {
  const [bootStep, setBootStep] = useState(-1);
  const navigate = useNavigate();

  useEffect(() => {
    // Utilisation d'une fonction asynchrone pour une meilleure gestion de la séquence
    const bootSequence = async () => {
      setBootStep(0); // Démarre la séquence
      
      // Parcourt la séquence de démarrage
      for (let i = 0; i < BOOT_SEQUENCE.length; i++) {
        const [_, delay] = BOOT_SEQUENCE[i];
        await new Promise(resolve => setTimeout(resolve, delay));
        setBootStep(i + 1);
      }
      
      // Navigation finale après un délai
      setTimeout(() => navigate("/dashboard"), 800);
    };
    
    bootSequence();
  }, [navigate]);

  // Optimisation conditionnelle du rendu
  if (bootStep === -1) {
    // État initial - affiche un écran de chargement minimal
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-green-500/50 border-t-green-500 animate-spin rounded-full"></div>
      </div>
    );
  }
  
  // Rendu principal avec animation de démarrage
  return <BootSequence step={bootStep} />;
}
