import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Typewriter } from "@/components/ui/typewriter";

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
      <div className="absolute min-w-full sm:min-w-1/2 top-1/2 left-1/2 -translate-1/2 bg-primary text-primary-foreground p-4">
        {/* <h1 lang="ja" className="text-4xl sm:text-5xl">{t("headline1")}</h1> */}
        {/* <br /> */}
        <Typewriter text={DEMO_TEXT} typeSpeed={200} className="text-lg sm:text-xl" />
        <h2 className="text-base sm:text-xl">{t("headline2")}</h2>
      </div>
    </section>
  );
}

const DEMO_TEXT = `ワレワレハ
コノ街ノ　平和ヲ　マモル　タメ
タチアガル
「アイ」ト「キボウ」ノ
戦士　ナノデアル

飴　ニモ　マケズ
酒　ニモ　マケズ
渾身のボケがスベッテモ　マケズ

タダ　コノ街ヲ　オモシロク
ソウイウモノニ
ワタシハナリタイ　（仮）`;