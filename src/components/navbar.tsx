"use client"

import Link from "next/link";
import Image from "next/image"
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "aws-amplify/auth";
import { BellIcon, MenuIcon, MessageCircleIcon } from "lucide-react";

import { MobileNavbarSheet } from "@/components/navbar-mobile-sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { navbarData } from "@/constants/navbar-data";
import { localeToCountryCode, localeToLanguageString, Locale } from "@/lib/utils"
import { useMySheet } from "@/hooks/use-my-sheet";
import { useGetAuthUserQuery } from "@/state/api";
import { Skeleton } from "@/components/ui/skeleton";

interface NavbarProps {
  locale: string;
}

export const Navbar = ({
  locale = 'en'
}: NavbarProps) => {
  const t = useTranslations("common.auth");
  const { data: authUser, isLoading } = useGetAuthUserQuery();
  const router = useRouter();
  const pathname = usePathname();
  const { onOpen } = useMySheet();

  const isDashboardPage = pathname.includes("/trustees") || pathname.includes("/crews");

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  const openMobileNavbar = () => {
    onOpen("OpenMobileNavbarSheet", {
      title: "Menu",
      locale
    });
  }

  return (
    <div className="fixed flex items-center justify-end w-screen h-16 sm:h-20 top-0 z-50 bg-gradient-to-b from-white from-90% to-black/50 animate-glow px-2 sm:px-4">
      {isDashboardPage && (
        <div className="md:hidden">
          {/* <SidebarTrigger /> */}
        </div>
      )}

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

      <div className="flex flex-1 items-center justify-center gap-3">
        {!isDashboardPage && navbarData.map((item, index) => (
          <div
            key={index}
            className="w-24 hidden md:block mr-2 cursor-pointer hover:font-bold text-center"
            onClick={() => { }}
          >
            <Link href={item.href}>
              {item.title}
            </Link>
          </div>
        ))}
      </div>

      <div className="flex items-center">
        {isLoading ? (
          <>
            <Skeleton className="w-22 h-9 bg-accent-foreground rounded-lg mr-2 sm:mr-4" />
            <Skeleton className="w-22 h-9 bg-accent-foreground rounded-lg mr-2 sm:mr-4" />
          </>
        ) : (
          authUser ? (
            <div className="flex items-center justify-around gap-2 sm:gap-4">
              {/* <div className="relative hidden md:block hover:opacity-60 cursor-pointer">
                <MessageCircleIcon className="w-6 h-6 text-accent" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full"></span>
              </div>
              <div className="relative hidden md:block hover:opacity-60 cursor-pointer">
                <BellIcon className="w-6 h-6 text-accent" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full"></span>
              </div> */}

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center focus:outline-none cursor-pointer hover:opacity-60">
                  <Avatar className="size-9 border-2 z-10">
                    <AvatarImage src={authUser.userInfo?.image} />
                    <AvatarFallback className="bg-primary">
                      {authUser.cognitoInfo?.username?.[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <p className="max-w-24 hidden md:block rounded-r-full pr-3 pl-4 -translate-x-2 py-0.5 border-r border-t border-b text-accent/90 overflow-x-hidden text-ellipsis text-nowrap">
                    {authUser.cognitoInfo?.username}
                  </p>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white text-accent">
                  <DropdownMenuItem
                    className="cursor-pointer font-bold"
                    onClick={() =>
                      router.push(
                        authUser.userRole?.toLowerCase() === "trustee"
                          ? "/trustees/dashboard"
                          : "/crews/dashboard",
                        { scroll: false }
                      )
                    }
                  >
                    {t("goToDashboard")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() =>
                      router.push(
                        `/${authUser.userRole?.toLowerCase()}s/settings`,
                        { scroll: false }
                      )
                    }
                  >
                    {t("settings")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={handleSignOut}
                  >
                    {t("signOut")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2 mr-2 sm:mr-4">
              <Link href="/signin">
                <Button
                  variant="secondary"
                  className="bg-primary hover:bg-primary/20 border border-primary text-accent hover:text-primary-foreground rounded-lg"
                  onClick={() => router.push("/signin")}
                >
                  {t("signIn")}
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  variant="outline"
                  className="hover:bg-accent/10 border border-primary hover:text-primary-foreground rounded-lg"
                >
                  {t("signUp")}
                </Button>
              </Link>
            </div>
          )
        )}
      </div>

      {!isDashboardPage && (
        <div className="hidden md:block">
          <LanguageSelect locale={locale} />
        </div>
      )}

      {/* For Mobile */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden hover:bg-zinc-300"
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