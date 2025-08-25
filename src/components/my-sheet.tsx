"use client"

import { useState, useEffect } from "react"

import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

interface MySheetProps {
  title?: string,
  description?: string,
  isOpen: boolean,
  onClose: () => void,
  side: "top" | "bottom" | "left" | "right",
  children: React.ReactNode,
  className?: string
}

export const MySheet = ({
  title,
  description,
  isOpen,
  onClose,
  side,
  children,
  className,
}: MySheetProps) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const onChange = (open: boolean) => {
    if (!open) {
      onClose()
    }
  }

  if (!isMounted) {
    return null
  }

  return (
    <Sheet open={isOpen} onOpenChange={onChange}>
      <SheetContent className={cn("w-full max-h-[98%] pb-6", className)} side={side}>
        <div className="h-full max-h-screen overflow-y-auto px-3 sm:px-6">
          <SheetHeader className="pt-8 px-6">
            <SheetTitle className="text-2xl text-center font-bold">
              {title}
            </SheetTitle>
            <SheetDescription className="text-center text-zinc-500">
              {description}
            </SheetDescription>
          </SheetHeader>
          {children}
        </div>
      </SheetContent>
    </Sheet>
  )
}
