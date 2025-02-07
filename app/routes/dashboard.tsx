import { ScrollArea } from "../components/ui/scroll-area";
import { COMMANDER_INFO, ARSENAL_CATEGORIES } from "~/constants/profile";
import { CommanderProfile } from "~/components/dashboard/CommanderProfile";
import { ArsenalSection } from "~/components/dashboard/ArsenalSection";
import { useState } from "react";
import { Biography } from "~/components/dashboard/Biography";
import { Navbar } from "~/components/navbar/Navbar";

export default function Dashboard() {
  const [activeCategory, setActiveCategory] = useState("skills");

  return (
    <div className="min-h-screen  text-cyber-primary">
      <div className="relative z-10">
        <Navbar />
        <main className="container mx-auto px-4 md:px-20 py-16 md:py-24">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6">
            {/* Profile - Fixe sur desktop, normal sur mobile */}
            <div className="w-full lg:col-span-3">
              <div className="lg:sticky lg:top-20">
                <CommanderProfile info={COMMANDER_INFO} />
              </div>
            </div>

            {/* Arsenal Section */}
            <div className="w-full lg:col-span-9 space-y-6">
              <Biography biography={COMMANDER_INFO.biography} />
              <ArsenalSection
                categories={ARSENAL_CATEGORIES}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
