import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Languages,
  Cpu,
  SatelliteDish,
  Computer,
  TicketCheck,
  Antenna,
} from "lucide-react";

interface Skill {
  name: string;
  icon: string;
  tools: string[];
}

interface ArsenalSectionProps {
  categories: { [key: string]: Skill[] };
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

// Créer un objet de mapping des icônes
const ICON_MAP = {
  Languages,
  Cpu,
  SatelliteDish,
  Computer,
  TicketCheck,
  Antenna,
} as const;

export default function ArsenalSection({
  categories,
  activeCategory,
  onCategoryChange,
}: ArsenalSectionProps) {
  return (
    <Card className="bg-navy-800/30 backdrop-blur-sm border-0 relative overflow-hidden shadow-[0px_0px_10px_4px_rgba(255,0,0,0.1)]">
      {/* Coins cyberpunk style arsenal */}
      <div className="absolute top-0 left-0 w-6 h-6">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-red-500/60" />
        <div className="absolute top-0 left-0 h-full w-[2px] bg-red-500/60" />
      </div>

      <div className="absolute top-0 right-0 w-6 h-6">
        <div className="absolute top-0 right-0 w-full h-[2px] bg-red-500/60" />
        <div className="absolute top-0 right-0 h-full w-[2px] bg-red-500/60" />
      </div>

      <div className="absolute bottom-0 left-0 w-6 h-6">
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-red-500/60" />
        <div className="absolute bottom-0 left-0 h-full w-[2px] bg-red-500/60" />
      </div>

      <div className="absolute bottom-0 right-0 w-6 h-6">
        <div className="absolute bottom-0 right-0 w-full h-[2px] bg-red-500/60" />
        <div className="absolute bottom-0 right-0 h-full w-[2px] bg-red-500/60" />
      </div>
      <CardContent className="p-6">
        <Tabs
          value={activeCategory}
          onValueChange={(value) => onCategoryChange(value as any)}
        >
          <TabsList className="grid grid-cols-2 gap-4 bg-transparent p-0 mb-6">
            {Object.keys(categories).map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="font-sans text-sm px-5 py-2 rounded-lg 
                         text-cyber-primary/70
                         data-[state=active]:bg-cyber-primary/20 
                         data-[state=active]:border-cyber-primary/40
                         data-[state=active]:border
                         data-[state=active]:text-cyber-primary
                         hover:text-cyber-primary
                         transition-all duration-300"
              >
                {category.toUpperCase()}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(categories).map(([category, skills]) => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {skills.map((skill) => (
                  <Card
                    key={skill.name}
                    className="bg-navy-800/50 border border-cyber-primary/30
                             hover:border-cyber-primary/60 transition-all duration-300
                             transform hover:scale-[1.02]"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl text-cyber-primary">
                          {/* Utiliser l'icône dynamiquement */}
                          {(() => {
                            const Icon =
                              ICON_MAP[skill.icon as keyof typeof ICON_MAP];
                            return Icon ? <Icon /> : null;
                          })()}
                        </span>
                        <span className="font-sans text-sm text-cyber-primary">
                          {skill.name}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {skill.tools.map((tool) => (
                          <Badge
                            key={tool}
                            variant="outline"
                            className="bg-cyber-primary/10 border-cyber-primary/30
                 text-xs px-2 py-1 text-cyber-primary"
                          >
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
