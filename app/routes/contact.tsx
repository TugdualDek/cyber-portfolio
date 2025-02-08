
import { ContactSection } from "~/components/contact/ContactSection";
import { CommanderProfile } from "~/components/dashboard/CommanderProfile";
import { Footer } from "~/components/footer/Footer";
import { Navbar } from "~/components/navbar/Navbar";
import { COMMANDER_INFO, ARSENAL_CATEGORIES } from "~/constants/constants";

export default function Dashboard() {

  return (
    <div className="min-h-screen  text-cyber-primary">
      <div className="relative z-10">
        <Navbar />
        <main className="container mx-auto px-4 md:px-20 py-16 md:py-24">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6">
            {/* Profile - Fixe sur desktop, normal sur mobile */}
            <div className="w-full lg:col-span-3">
              <div className="lg:sticky lg:top-[6rem]">
                <CommanderProfile info={COMMANDER_INFO} />
              </div>
            </div>

            <div className="w-full lg:col-span-9 space-y-6">
              <ContactSection />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
