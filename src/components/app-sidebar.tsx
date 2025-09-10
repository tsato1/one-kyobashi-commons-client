"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BuildingIcon,
  DollarSignIcon,
  FileTextIcon,
  HeartIcon,
  HomeIcon,
  MenuIcon,
  SettingsIcon,
  X,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  userRole: "trustee" | "crew";
}

export const AppSidebar = ({ userRole }: AppSidebarProps) => {
  const pathname = usePathname();
  const { toggleSidebar, open } = useSidebar();

  const navLinks =
    userRole === "trustee"
      ? [
        { icon: BuildingIcon, label: "ダッシュボード", href: "/trustees/dashboard" },
        { icon: FileTextIcon, label: "イベント", href: "/crews/events" },
        { icon: HomeIcon, label: "ショップ", href: "/crews/shop" },
        { icon: DollarSignIcon, label: "売上", href: "/crews/revenue" },
        { icon: SettingsIcon, label: "設定", href: "/trustees/settings" },
      ]
      : [
        { icon: HeartIcon, label: "ダッシュボード", href: "/crews/dashboard" },
        { icon: FileTextIcon, label: "イベント", href: "/crews/events" },
        { icon: HomeIcon, label: "ショップ", href: "/crews/shop" },
        { icon: DollarSignIcon, label: "売上", href: "/crews/revenue" },
        { icon: SettingsIcon, label: "設定", href: "/crews/settings" },
      ];

  return (
    <Sidebar
      collapsible="icon"
      className="fixed left-0 shadow-lg pt-16 sm:pt-20"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div
              className={cn(
                "flex w-full items-center pt-3 mb-3",
                open ? "justify-between px-6" : "justify-center"
              )}
            >
              {open ? (
                <>
                  <h1 className="text-xl font-bold text-gray-700">
                    {userRole === "trustee" ? "一味" : "クルー"}
                  </h1>
                  <Button
                    variant="ghost"
                    className="hover:text-white"
                    onClick={() => toggleSidebar()}
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => toggleSidebar()}
                >
                  <MenuIcon className="h-6 w-6" />
                </Button>
              )}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {navLinks.map((link) => {
            const isActive = pathname.includes(link.href);

            return (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "flex items-center px-7 py-7",
                    isActive
                      ? "bg-secondary hover:bg-secondary/60"
                      : "",
                    open ? "" : "ml-[6px]"
                  )}
                  tooltip={link.label}
                >
                  <Link href={link.href} className="w-full" scroll={false}>
                    <div className="flex items-center gap-3 shrink-0">
                      <link.icon className={`h-5 w-5 ${isActive ? "text-primary-foreground" : ""}`} />
                      {open && (
                        <span className={`font-medium ${isActive ? "text-primary-foreground" : ""}`}>
                          {link.label}
                        </span>
                      )}
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};
