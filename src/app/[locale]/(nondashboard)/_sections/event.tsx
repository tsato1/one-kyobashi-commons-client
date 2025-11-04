"use client"

import { MySheet } from "@/components/my-sheet";
import { Separator } from "@/components/ui/separator";
import { useMySheet } from "@/hooks/use-my-sheet"

export const Event = () => {
  const { mySheetType, mySheetData, isOpen, onClose } = useMySheet()
  const isSheetOpen = isOpen && mySheetType === "OpenEventSheet"

  return (
    <MySheet
      isOpen={isSheetOpen}
      onClose={onClose}
      side="right"
    >
      <div className="space-y-1 sm:space-y-2">
        <p className="text-lg sm:text-xl">{mySheetData.title}</p>

        <Separator />

      </div>
    </MySheet>
  )
}