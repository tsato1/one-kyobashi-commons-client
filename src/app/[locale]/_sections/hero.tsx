import Image from "next/image";
import { getTranslations } from "next-intl/server";

export const Hero = async () => {
  const t = await getTranslations("main.hero");

  return (
    <section id="hero" className="w-screen h-screen relative">
      {/* <div className="absolute top-0 left-0 w-full h-full">
        <Image
          src="/images/hero.jpg"
          alt="Main Carousel Image"
          fill
          priority />
      </div> */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/60" />
      <div className="absolute top-1/2 left-1/2 -translate-1/2 text-yellow-50 p-4">
        <h1 lang="ja" className="text-4xl sm:text-5xl underline underline-offset-4">ANGLER</h1>
        <br />
        <h2 className="text-base sm:text-xl">{t("caption")}</h2>
      </div>
    </section>
  );
}
