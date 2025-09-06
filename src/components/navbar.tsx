"use client"

import Link from "next/link";
import Image from "next/image"
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

interface NavbarProps {
  locale: string;
}

export const Navbar = ({
  locale = 'en'
}: NavbarProps) => {
  const { data: authUser } = useGetAuthUserQuery();
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

      <div className="flex items-center gap-5">
        {authUser ? (
          <>
            <div className="relative hidden md:block">
              <MessageCircleIcon className="w-6 h-6 cursor-pointer text-primary-200 hover:text-primary-400" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-secondary-700 rounded-full"></span>
            </div>
            <div className="relative hidden md:block">
              <BellIcon className="w-6 h-6 cursor-pointer text-primary-200 hover:text-primary-400" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-secondary-700 rounded-full"></span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none">
                <Avatar>
                  <AvatarImage src={authUser.userInfo?.image} />
                  <AvatarFallback className="bg-primary-600">
                    {authUser.userRole?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <p className="text-primary-200 hidden md:block">
                  {authUser.userInfo?.name}
                </p>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white text-primary-700">
                <DropdownMenuItem
                  className="cursor-pointer hover:!bg-primary-700 hover:!text-primary-100 font-bold"
                  onClick={() =>
                    router.push(
                      authUser.userRole?.toLowerCase() === "trustee"
                        ? "/trustee/properties"
                        : "/crews/favorites",
                      { scroll: false }
                    )
                  }
                >
                  Go to Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-primary-200" />
                <DropdownMenuItem
                  className="cursor-pointer hover:!bg-primary-700 hover:!text-primary-100"
                  onClick={() =>
                    router.push(
                      `/${authUser.userRole?.toLowerCase()}s/settings`,
                      { scroll: false }
                    )
                  }
                >
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer hover:!bg-primary-700 hover:!text-primary-100"
                  onClick={handleSignOut}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <Link href="/signin">
              <Button
                variant="outline"
                className="border-white bg-transparent hover:text-primary-700 rounded-lg"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                variant="secondary"
                className="bg-secondary-600 hover:text-primary-700 rounded-lg"
              >
                Sign Up
              </Button>
            </Link>
          </>
        )}
      </div>

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