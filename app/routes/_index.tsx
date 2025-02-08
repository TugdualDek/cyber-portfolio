// app/routes/_index.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from '@remix-run/react';
import { Progress } from "../components/ui/progress"
import { Card, CardHeader, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Alert, AlertDescription } from "../components/ui/alert"

const SECURITY_CHECKS = [
  "SYSTEM INITIALIZATION",
  "ACCESS VERIFICATION",
  "LOADING OF THE CONTROL CENTER",
];

export default function CommandCenter() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < SECURITY_CHECKS.length) {
        setCurrentStep(prev => prev + 1);
        setProgress((currentStep + 1) * (100 / SECURITY_CHECKS.length));
      } else {
        navigate('/dashboard');
      }
    }, 1000); // Augmenté pour mieux voir les transitions

    return () => clearTimeout(timer);
  }, [currentStep]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-navy-800/50 border-cyber-primary">
        <CardHeader className="space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-sans text-cyber-primary font-bold tracking-wider">
              CONTROL CENTER
            </h1>
            <Badge 
              variant="outline" 
              className="bg-transparent border-cyber-primary"
            >
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-cyber-primary rounded-full animate-pulse" />
                <span className="text-cyber-primary">SYSTEM ACCESS</span>
              </div>
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Barre de progression */}
          <div className="space-y-2">
            <Progress 
              value={progress} 
              className="h-2 bg-cyber-primary"
            />
            <div className="flex justify-between font-sans text-sm">
              <span className="text-cyber-primary">{Math.round(progress)}%</span>
              <span className="text-cyber-accent animate-pulse">
                {currentStep > 0 ? "PROCESSING" : "INITIALIZING"}
              </span>
            </div>
          </div>

          {/* Message actuel uniquement */}
          <Alert 
            className="border-2 border-cyber-primary bg-navy-900/50"
          >
            <AlertDescription className="font-sans text-lg">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-3 w-3 bg-cyber-primary animate-pulse rounded-full" />
                </div>
                <span className="text-cyber-primary">
                  {SECURITY_CHECKS[currentStep - 1] || "INITIATING SEQUENCE"}
                </span>
              </div>
            </AlertDescription>
          </Alert>

          {/* Terminal-like output */}
          <div className="font-sans text-sm text-cyber-primary/60 space-y-1">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-4 overflow-hidden">
                {i < currentStep && (
                  <div className="animate-typing">
                    &gt; {Math.random().toString(36).substring(2, 15)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
