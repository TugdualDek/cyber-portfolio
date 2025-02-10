import { memo } from "react";
import { MetaFunction } from "@remix-run/node";
import { COMMANDER_INFO } from "~/constants/constants";
import { CommanderProfile } from "~/components/dashboard/CommanderProfile";
import { ContactSection } from "~/components/contact/ContactSection";
import { Footer } from "~/components/footer/Footer";
import { Navbar } from "~/components/navbar/Navbar";

export const meta: MetaFunction = () => [
  { title: "Tugdual de Kerdrel" },
  { name: "description", content: "Contact - Tugdual de Kerdrel" },
];

// Composants mémorisés
const MemoizedCommanderProfile = memo(CommanderProfile);
const MemoizedContactSection = memo(ContactSection);
const MemoizedNavbar = memo(Navbar);
const MemoizedFooter = memo(Footer);

// Composants de layout
const PageContainer = memo(({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen text-cyber-primary">
    <div className="relative z-10">{children}</div>
  </div>
));

const MainLayout = memo(({ children }: { children: React.ReactNode }) => (
  <main className="container mx-auto px-4 md:px-20 py-16 md:py-24">
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6">
      {children}
    </div>
  </main>
));

const Sidebar = memo(() => (
  <aside className="w-full lg:col-span-3">
    <div className="lg:sticky lg:top-[6rem]">
      <MemoizedCommanderProfile info={COMMANDER_INFO} />
    </div>
  </aside>
));

const MainContent = memo(() => (
  <section className="w-full lg:col-span-9 space-y-6">
    <MemoizedContactSection />
  </section>
));

export default function ContactPage() {
  return (
    <PageContainer>
      <MemoizedNavbar />
      <MainLayout>
        <Sidebar />
        <MainContent />
      </MainLayout>
      <MemoizedFooter />
    </PageContainer>
  );
}
