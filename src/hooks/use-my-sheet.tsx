import { create } from "zustand"

export type MySheetType = "OpenMobileNavbarSheet"

interface MySheetData {
  title?: string
  locale?: string

  onClose?: () => void

  disabled?: boolean
}

interface useMySheetStore {
  mySheetType: MySheetType | null,
  mySheetData: MySheetData,
  isOpen: boolean,
  onOpen: (type: MySheetType, data?: MySheetData) => void
  onClose: () => void
}

export const useMySheet = create<useMySheetStore>((set, get) => ({
  mySheetType: null,
  mySheetData: {},
  isOpen: false,
  onOpen: (mySheetType, mySheetData = {}) => set({ isOpen: true, mySheetType, mySheetData }),
  onClose: () => {
    set({ isOpen: false, mySheetType: null })
    get().mySheetData.onClose?.()
  }
}))