import { Footer } from "@/components/footer";
import { Hero } from "./_sections/hero";
import { Partners } from "./_sections/partners";
import { Subhero } from "./_sections/subhero";
import { Events } from "./_sections/events";

export default async function Home() {
  return (
    <main className="flex flex-col items-center overflow-hidden">
      <Hero />

      <Partners />

      <Events />

      <Subhero />

      <Footer />
    </main>
  );
}
