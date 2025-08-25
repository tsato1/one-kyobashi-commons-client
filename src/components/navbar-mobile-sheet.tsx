"use client"

import Link from "next/link";
import { motion } from "motion/react"

import { MySheet } from "@/components/my-sheet";
import { LanguageSelect } from "@/components/navbar";
import { Separator } from "@/components/ui/separator";
import { navbarData } from "@/constants/navbar-data";
import { useMySheet } from "@/hooks/use-my-sheet"

export const MobileNavbarSheet = () => {
  const { mySheetType, mySheetData, isOpen, onClose } = useMySheet()
  const isSheetOpen = isOpen && mySheetType === "OpenMobileNavbarSheet"

  return (
    <MySheet
      isOpen={isSheetOpen}
      onClose={onClose}
      side="top"
    >
      <div className="space-y-1 sm:space-y-2">
        <p className="text-lg sm:text-xl">{mySheetData.title}</p>

        <Separator />

        {navbarData.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + 0.18 * index }}
            className="text-sm sm:text-base cursor-pointer hover:font-bold"
            onClick={() => { }}
          >
            <Link href={item.href}>
              {item.title}
            </Link>
          </motion.div>
        ))}

        <Separator />

        <LanguageSelect locale={mySheetData?.locale} />
      </div>
    </MySheet>
  )
}