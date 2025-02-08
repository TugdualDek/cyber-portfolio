// components/contact/ContactSection.tsx
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { 
  Terminal, 
  Send, 
  Download, 
  ExternalLink, 
  Shield, 
  AlertCircle,
  Clock,
  MapPin,
  Database
} from "lucide-react";

const INITIALIZATION_STEPS = [
    "INITIALIZING_COMMUNICATION_PROTOCOLS",
    "ESTABLISHING_SECURE_CONNECTION",
    "LOADING_INTERFACE_COMPONENTS",
  ];
  
  export function ContactSection() {
    const [isLoading, setIsLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(0);
  
    // Gestion du chargement initial
    useEffect(() => {
      const stepDuration = 400; // 600ms par étape
  
      const timer = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < INITIALIZATION_STEPS.length) {
            setProgress((prev + 1) * (100 / INITIALIZATION_STEPS.length));
            return prev + 1;
          }
          clearInterval(timer);
          setTimeout(() => setIsLoading(false), 100); // Petit délai avant d'afficher le contenu
          return prev;
        });
      }, stepDuration);
  
      return () => clearInterval(timer);
    }, []);
  
    if (isLoading) {
      return (
        <Card className="bg-navy-800/30 border-cyber-primary/20">
          <CardContent className="p-8 space-y-6">
            {/* En-tête du chargement */}
            <div className="text-center space-y-2">
              <h2 className="text-cyber-primary font-mono text-sm">
                ESTABLISHING_CONNECTION
              </h2>
              <div className="flex items-center justify-center gap-2">
                <span className="h-2 w-2 bg-cyber-primary rounded-full animate-[blink_1s_ease-in-out_infinite]" />
                <span className="text-cyber-primary/60 font-mono text-xs">
                  {INITIALIZATION_STEPS[currentStep - 1] || "PREPARING"}
                </span>
              </div>
            </div>
  
            {/* Barre de progression */}
            <div className="space-y-2">
              <div className="h-1 bg-navy-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyber-primary transition-all duration-300 ease-in-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs font-mono text-cyber-primary/60">
                <span>{Math.round(progress)}%</span>
                <span className="animate-[textBlink_1s_step-end_infinite]">
                  {">_"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }
  

  return (
    <Card className="bg-navy-800/40 border-cyber-primary/20 animate-fadeIn">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className={`h-4 w-4 text-cyber-primary`} />
            <CardTitle className="font-mono text-sm tracking-wider text-cyber-primary">
              COMMUNICATION_TERMINAL
            </CardTitle>
          </div>
          <Badge 
            variant={"default"}
            className="font-mono text-xs bg-cyber-primary/20 text-cyber-primary"
          >
            <Shield className={`h-3 w-3 mr-1`} />
            {"SECURE"}
          </Badge>
        </div>
        <Separator className="bg-cyber-primary/20" />
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Section Communication */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertCircle className={`h-4 w-4 text-cyber-primary`} />
            <h3 className="text-cyber-primary font-mono text-xs tracking-wider">
              COMMUNICATION_PROTOCOLS
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="bg-navy-900/50 border-cyber-primary/30 hover:bg-cyber-primary/10
                       text-cyber-primary font-mono text-sm group w-full
                       hover:border-cyber-primary transition-all duration-300"
              onClick={() => window.location.href = 'mailto:tugdualk@hotmail.com'}
            >
              <Send className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              INITIALIZE_EMAIL
            </Button>
            
            <Button
              variant="outline"
              className="bg-navy-900/50 border-cyber-primary/30 hover:bg-cyber-primary/10
                       text-cyber-primary font-mono text-sm group w-full
                       hover:border-cyber-primary transition-all duration-300"
              asChild
            >
              <a 
                href="https://linkedin.com/in/tugdual-de-kerdrel" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4 group-hover:rotate-45 transition-transform" />
                ACCESS_LINKEDIN
              </a>
            </Button>
          </div>
        </div>

        {/* Section Documents */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Database className={`h-4 w-4 text-cyber-primary`} />
            <h3 className="text-cyber-primary font-mono text-xs tracking-wider">
              CLASSIFIED_DOCUMENTS
            </h3>
          </div>
          
          <Button
            variant="outline"
            className="w-full bg-navy-900/50 border-cyber-primary/30 hover:bg-cyber-primary/10
                     text-cyber-primary font-mono text-sm group
                     hover:border-cyber-primary transition-all duration-300"
            asChild
          >
            <a href="/assets/cv.pdf" download>
              <Download className="mr-2 h-4 w-4 group-hover:-translate-y-1 transition-transform" />
              DOWNLOAD_CV.pdf
            </a>
          </Button>
        </div>

        {/* Status Section */}
        <Card className="bg-navy-900/50 border-cyber-primary/20">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-cyber-primary/60">
                  <Clock className={`h-4 w-4`} />
                  <span className="text-xs font-mono">RESPONSE_TIME</span>
                </div>
                <p className="text-cyber-primary font-mono text-sm">{"< 24H"}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-cyber-primary/60">
                  <MapPin className={`h-4 w-4`} />
                  <span className="text-xs font-mono">LOCATION</span>
                </div>
                <p className="text-cyber-primary font-mono text-sm">PARIS</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
