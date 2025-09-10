import { Footer } from "@/components/footer";
import { Hero } from "./_sections/hero";
import { Sponsors } from "./_sections/sponsors";
import { Subhero } from "./_sections/subhero";
import { Events } from "./_sections/events";

export default async function Home() {
  return (
    <main className="flex flex-col items-center overflow-hidden">
      <Hero />

      <Sponsors />

      <Subhero />

      <Events />

      <Footer />
    </main>
  );
}
