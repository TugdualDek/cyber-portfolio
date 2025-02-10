import { memo } from "react";
import { MetaFunction } from "@remix-run/node";
import { COMMANDER_INFO } from "~/constants/constants";
import { CommanderProfile } from "~/components/dashboard/CommanderProfile";
import { Footer } from "~/components/footer/Footer";
import { Navbar } from "~/components/navbar/Navbar";
import ProjectsSection from "~/components/projects/ProjectsSection";

export const meta: MetaFunction = () => [
  { title: "Tugdual de Kerdrel" },
  { name: "description", content: "Projects - Tugdual de Kerdrel" },
];

// Mémoisation des composants pour éviter les re-renders inutiles
const MemoizedCommanderProfile = memo(CommanderProfile);
const MemoizedProjectsSection = memo(ProjectsSection);
const MemoizedNavbar = memo(Navbar);
const MemoizedFooter = memo(Footer);

// Layout components
const PageLayout = memo(({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen text-cyber-primary">
    <div className="relative z-10">{children}</div>
  </div>
));

const MainContent = memo(({ children }: { children: React.ReactNode }) => (
  <main className="container mx-auto px-4 md:px-20 py-16 md:py-24">
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6">
      {children}
    </div>
  </main>
));

const SidebarProfile = memo(() => (
  <div className="w-full lg:col-span-3">
    <div className="lg:sticky lg:top-[6rem]">
      <MemoizedCommanderProfile info={COMMANDER_INFO} />
    </div>
  </div>
));

const MainSection = memo(() => (
  <div className="w-full lg:col-span-9 space-y-6">
    <MemoizedProjectsSection />
  </div>
));

export default function Dashboard() {
  return (
    <PageLayout>
      <MemoizedNavbar />
      <MainContent>
        <SidebarProfile />
        <MainSection />
      </MainContent>
      <MemoizedFooter />
    </PageLayout>
  );
}
