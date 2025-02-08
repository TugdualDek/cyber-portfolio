import { useState, useEffect } from 'react';
import { useNavigate } from '@remix-run/react';

const BOOT_SEQUENCE = [
  { text: "INITIALIZING SYSTEM KERNEL", delay: 400 },
  { text: "LOADING SECURITY PROTOCOLS", delay: 500 },
  { text: "ESTABLISHING SECURE CONNECTION", delay: 600 },
  { text: "AUTHENTICATING USER CREDENTIALS", delay: 700 },
  { text: "ACCESSING CONTROL CENTER", delay: 800 },
];

export default function CommandCenter() {
  const [bootStep, setBootStep] = useState(-1);
  const [matrixText, setMatrixText] = useState("");
  const navigate = useNavigate();

  // Séquence de démarrage
useEffect(() => {
  if (bootStep < BOOT_SEQUENCE.length - 1) {
    const timer = setTimeout(() => {
      setBootStep(prev => prev + 1);
    }, BOOT_SEQUENCE[bootStep]?.delay || 800);

    return () => clearTimeout(timer);
  } else if (bootStep === BOOT_SEQUENCE.length - 1) {
    setTimeout(() => navigate('/dashboard'), 800);
  }
}, [bootStep]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Effet Matrix en arrière-plan */}
      <div className="absolute inset-0 text-cyber-primary/5 font-mono text-sm overflow-hidden">
        {Array(20).fill(0).map((_, i) => (
          <div 
            key={i}
            className="whitespace-nowrap animate-slideDown"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {matrixText}
          </div>
        ))}
      </div>

      <div className="w-full max-w-2xl space-y-8 relative z-10">
        {/* Terminal Header */}
        <div className="border border-cyber-primary/20 bg-navy-800/30 rounded-t-lg">
          <div className="px-4 py-2 border-b border-cyber-primary/20 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
            <span className="ml-2 text-cyber-primary/60 text-sm font-mono">
              terminal@tugdual
            </span>
          </div>

          {/* Terminal Content */}
          <div className="p-6 font-mono text-sm space-y-2">
            {BOOT_SEQUENCE.map((step, index) => (
              index <= bootStep && (
                <div 
                  key={index}
                  className="text-cyber-primary/80 animate-typewriter"
                  style={{ animationDelay: `${index * 0.5}s` }}
                >
                  <span className="text-cyber-primary/40">{">_ "}</span>
                  {step.text}
                  {index === bootStep && (
                    <span className="inline-block w-2 h-4 bg-cyber-primary/60 animate-blink ml-1" />
                  )}
                </div>
              )
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        {bootStep >= 0 && (
          <div className="space-y-2">
            <div className="h-1 bg-navy-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-cyber-primary transition-all duration-500"
                style={{ 
                  width: `${Math.min(
                    ((bootStep + 1) / BOOT_SEQUENCE.length) * 100,
                    100
                  )}%` 
                }}
              />
            </div>
            <div className="flex justify-between text-xs font-mono text-cyber-primary/60">
              <span>BOOT SEQUENCE: {Math.round(((bootStep + 1) / BOOT_SEQUENCE.length) * 100)}%</span>
              <span className="animate-blink">{">_"}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}