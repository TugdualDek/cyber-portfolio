import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Terminal } from "lucide-react"; // Import de l'icône

interface BiographyProps {
  biography: string;
}

export function Biography({ biography }: BiographyProps) {
  return (
    <Card className="bg-navy-800/30 backdrop-blur-sm border-0 relative overflow-hidden group shadow-[0_0_20px_rgba(0,255,136,0.15)]">
        
      {/* Coins cyberpunk */}
      <div className="absolute top-0 left-0 w-4 h-4">
        <div className="absolute top-0 left-0 w-full h-2 bg-cyber-primary/60" />
        <div className="absolute top-0 left-0 w-2 h-full bg-cyber-primary/60" />
      </div>

      <div className="absolute top-0 right-0 w-4 h-4">
        <div className="absolute top-0 right-0 w-full h-2 bg-cyber-primary/60" />
        <div className="absolute top-0 right-0 w-2 h-full bg-cyber-primary/60" />
      </div>

      <div className="absolute bottom-0 left-0 w-4 h-4">
        <div className="absolute bottom-0 left-0 w-full h-2 bg-cyber-primary/60" />
        <div className="absolute bottom-0 left-0 w-2 h-full bg-cyber-primary/60" />
      </div>

      <div className="absolute bottom-0 right-0 w-4 h-4">
        <div className="absolute bottom-0 right-0 w-full h-2 bg-cyber-primary/60" />
        <div className="absolute bottom-0 right-0 w-2 h-full bg-cyber-primary/60" />
      </div>

      <CardHeader className="space-y-1">
        <div className="flex items-center space-x-1">
          <Terminal className="w-5 h-5 text-cyber-primary" />
          <CardTitle className="font-sans text-xl tracking-wide text-cyber-primary">
            BIO
          </CardTitle>
        </div>
        <div className="h-0.5 bg-gradient-to-r from-cyber-primary/50 via-cyber-primary/20 to-transparent" />
      </CardHeader>

      <CardContent className="p-4">
        <div className="relative text-cyber-primary/80 leading-relaxed">
          {/* Texte de la biographie */}
          <p className="relative z-10">{biography}</p>
        </div>
      </CardContent>
    </Card>
  );
}
