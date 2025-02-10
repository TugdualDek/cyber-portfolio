import { lazy, Suspense, useState, memo } from "react";
import { MetaFunction } from "@remix-run/node";
import { COMMANDER_INFO, ARSENAL_CATEGORIES } from "~/constants/constants";
import { CommanderProfile } from "~/components/dashboard/CommanderProfile";
import { Navbar } from "~/components/navbar/Navbar";
import { TimelineSection } from "~/components/dashboard/TimelineSection";
import { Footer } from "~/components/footer/Footer";
import { Skeleton } from "~/components/ui/skeleton";

// Lazy loading des composants lourds
const Biography = lazy(() => import("~/components/dashboard/Biography"));
const ArsenalSection = lazy(() => import("~/components/dashboard/ArsenalSection"));

export const meta: MetaFunction = () => [
  { title: "Tugdual de Kerdrel" },
  { name: "description", content: "Dashboard - Tugdual de Kerdrel" },
];

// Composants mémorisés pour éviter les re-renders inutiles
const MemoizedCommanderProfile = memo(CommanderProfile);
const MemoizedTimelineSection = memo(TimelineSection);
const MemoizedFooter = memo(Footer);

// Composant de chargement réutilisable
const LoadingSkeleton = memo(() => (
  <Skeleton className="h-4 w-full animate-pulse" />
));

export default function Dashboard() {
  const [activeCategory, setActiveCategory] = useState("skills");

  return (
    <div className="min-h-screen text-cyber-primary">
      <div className="relative z-10">
        <Navbar />
        
        <main className="container mx-auto px-4 md:px-20 py-16 md:py-24">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6">
            {/* Profile Section */}
            <aside className="w-full lg:col-span-3">
              <div className="lg:sticky lg:top-[6rem]">
                <MemoizedCommanderProfile info={COMMANDER_INFO} />
              </div>
            </aside>

            {/* Main Content Section */}
            <section className="w-full lg:col-span-9 space-y-6">
              <Suspense fallback={<LoadingSkeleton />}>
                <Biography biography={COMMANDER_INFO.biography} />
              </Suspense>

              <Suspense fallback={<LoadingSkeleton />}>
                <ArsenalSection
                  categories={ARSENAL_CATEGORIES}
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
                />
              </Suspense>

              <MemoizedTimelineSection />
            </section>
          </div>
        </main>

        <MemoizedFooter />
      </div>
    </div>
  );
}
