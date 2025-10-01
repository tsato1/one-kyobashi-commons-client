"use client";

import Link from "next/link";
import Image from "next/image"

export const NavbarWelcome = () => {
  return (
    <div className="flex items-center justify-end w-screen h-16 sm:h-20 top-0 z-50">
      <Link
        href="/"
        className="relative w-12 sm:w-16 h-12 sm:h-16 mr-auto cursor-pointer"
      >
        <Image
          src="/logo.png"
          alt="logo"
          sizes="(max-width: 600px) 100vw, (max-width: 780px) 50vw, 33vw"
          style={{ objectFit: "cover" }}
          priority
          fill />
      </Link>

      <div className="hidden md:block">
        {/* <LanguageSelect locale={locale} /> */}
      </div>
    </div>
  )
}