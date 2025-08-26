"use client"

import Link from "next/link";
import Image from "next/image"
import { MenuIcon } from "lucide-react";

import { MobileNavbarSheet } from "@/components/navbar-mobile-sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import { navbarData } from "@/constants/navbar-data";
import { localeToCountryCode, localeToLanguageString, Locale } from "@/lib/utils"
import { useMySheet } from "@/hooks/use-my-sheet";

interface NavbarProps {
  locale: string;
}

export const Navbar = ({
  locale = 'en'
}: NavbarProps) => {
  const { onOpen } = useMySheet();

  const openMobileNavbar = () => {
    onOpen("OpenMobileNavbarSheet", {
      title: "Menu",
      locale
    });
  }

  return (
    <div className="fixed flex items-center justify-end w-screen h-16 sm:h-20 top-0 z-50 bg-gradient-to-b from-white from-90% to-black/50 animate-glow px-2 sm:px-4">
      <Link
        href="#hero"
        className="relative w-48 sm:w-52 h-12 sm:h-16 mr-auto cursor-pointer"
      >
        <Image
          src="/logo.png"
          alt="logo"
          sizes="(max-width: 600px) 100vw, (max-width: 780px) 50vw, 33vw"
          style={{ objectFit: "cover" }}
          priority
          fill />
      </Link>

      {navbarData.map((item, index) => (
        <div
          key={index}
          className="w-20 hidden md:block mr-2 cursor-pointer hover:font-bold text-center"
          onClick={() => { }}
        >
          <Link href={item.href}>
            {item.title}
          </Link>
        </div>
      ))}

      <div className="hidden md:block">
        <LanguageSelect locale={locale} />
      </div>

      {/* For Mobile */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden cursor-pointer hover:bg-zinc-300"
        onClick={() => openMobileNavbar()}
      >
        <MenuIcon className="size-4" />
      </Button>

      <MobileNavbarSheet />
    </div>
  )
}

interface LanguageSelectProps {
  locale?: string;
}

export const LanguageSelect = ({
  locale = "en"
}: LanguageSelectProps) => {
  const handleLocaleChange = (selectedLanguage: string) => {
    window.location.href = `/${selectedLanguage}`;
  }

  return (
    <Select
      onValueChange={(data) => handleLocaleChange(data)}
      defaultValue={locale}
    >
      <SelectTrigger className="bg-auto cursor-pointer">
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        side="bottom"
        align="end"
        className="bg-background"
      >
        {Object.values(Locale).map((item) => (
          <SelectItem
            key={item}
            value={item}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-x-2">
              <Image
                src={`https://flagsapi.com/${localeToCountryCode(Locale[item as keyof typeof Locale])}/flat/64.png`}
                alt="Flag"
                width={20}
                height={20} />

              <p className="font-medium">
                {localeToLanguageString(Locale[item as keyof typeof Locale])}
              </p>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}