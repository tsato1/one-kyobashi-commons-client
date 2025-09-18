import {
  BuildingIcon,
  DollarSignIcon,
  FileTextIcon,
  HomeIcon,
  SettingsIcon,
} from "lucide-react";

export const navbarData = [
  {
    title: "EVENTS",
    href: "#events",
  },
  {
    title: "ABOUT US",
    href: "#about",
  },
  {
    title: "CONTACT",
    href: "#contact",
  }
]

export const sidebarDataCrew = [
  { icon: BuildingIcon, label: "ダッシュボード", href: "/:role/dashboard" },
  { icon: FileTextIcon, label: "イベント", href: "/:role/events" },
  { icon: HomeIcon, label: "ショップ", href: "/:role/shop" },
  { icon: DollarSignIcon, label: "売上", href: "/:role/revenue" },
]

export const sidebarDataTrustee = [
  { icon: BuildingIcon, label: "ダッシュボード", href: "/:role/dashboard" },
  { icon: FileTextIcon, label: "ミーティング", href: "/:role/meetings" },
]

