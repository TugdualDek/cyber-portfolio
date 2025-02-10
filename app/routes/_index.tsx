import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from '@remix-run/react';
import { MetaFunction } from '@remix-run/node';

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
  const navigate = useNavigate();

  const handleBootSequence = useCallback(() => {
    if (bootStep < BOOT_SEQUENCE.length - 1) {
      const timer = setTimeout(() => {
        setBootStep(prev => prev + 1);
      }, BOOT_SEQUENCE[bootStep]?.[1] || 800);

      return () => clearTimeout(timer);
    } else if (bootStep === BOOT_SEQUENCE.length - 1) {
      const timer = setTimeout(() => navigate('/dashboard'), 800);
      return () => clearTimeout(timer);
    }
  }, [bootStep, navigate]);

  useEffect(handleBootSequence, [handleBootSequence]);

  const progress = Math.min(((bootStep + 1) / BOOT_SEQUENCE.length) * 100, 100);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Matrix Background */}
      <div className="absolute inset-0 text-cyber-primary/5 font-mono text-sm overflow-hidden">
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
        <div className="border border-cyber-primary/20 bg-navy-800/30 rounded-t-lg">
          <TerminalHeader />
          <TerminalContent bootStep={bootStep} />
        </div>

        {/* Progress Bar */}
        {bootStep >= 0 && (
          <ProgressBar 
            progress={progress} 
            bootStep={bootStep} 
          />
        )}
      </div>
    </div>
  );
}

function TerminalHeader() {
  return (
    <div className="px-4 py-2 border-b border-cyber-primary/20 flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-red-500/50" />
      <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
      <div className="w-3 h-3 rounded-full bg-green-500/50" />
      <span className="ml-2 text-cyber-primary/60 text-sm font-mono">
        terminal@tugdual
      </span>
    </div>
  );
}

function TerminalContent({ bootStep }: { bootStep: number }) {
  return (
    <div className="p-6 font-mono text-sm space-y-2">
      {BOOT_SEQUENCE.map(([text], index) => (
        index <= bootStep && (
          <div 
            key={index}
            className="text-cyber-primary/80 animate-typewriter"
            style={{ animationDelay: `${index * 0.5}s` }}
          >
            <span className="text-cyber-primary/40">{">_ "}</span>
            {text}
            {index === bootStep && (
              <span className="inline-block w-2 h-4 bg-cyber-primary/60 animate-blink ml-1" />
            )}
          </div>
        )
      ))}
    </div>
  );
}

function ProgressBar({ progress, bootStep }: { progress: number, bootStep: number }) {
  return (
    <div className="space-y-2">
      <div className="h-1 bg-navy-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-cyber-primary transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between text-xs font-mono text-cyber-primary/60">
        <span>BOOT SEQUENCE: {Math.round(progress)}%</span>
        <span className="animate-blink">{">_"}</span>
      </div>
    </div>
  );
}
