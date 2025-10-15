"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "aws-amplify/auth";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MenuIcon,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useGetAuthUserQuery } from "@/state/api";
import { ErrorComponent } from "@/components/error-component";
import { Skeleton } from "@/components/ui/skeleton";

interface AppSidebarProps {
  sidebarData: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    href: string;
  }[];
}

export const AppSidebar = ({
  sidebarData
}: AppSidebarProps) => {
  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
  const pathname = usePathname();
  const router = useRouter();
  const { toggleSidebar, open } = useSidebar();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  if (!authUser || !authUser.userRole) {
    return <ErrorComponent />
  }

  return (
    <Sidebar
      collapsible="icon"
      className="fixed shadow-lg"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div
              className={cn(
                "flex w-full items-center pt-3 mb-3",
                open ? "justify-between" : "justify-center"
              )}
            >
              {open ? (
                <>
                  <div
                    role="button"
                    className="w-full flex items-center gap-3 cursor-pointer hover:bg-muted px-6 rounded-2xl"
                    onClick={() => router.push("/")}
                  >
                    <Image
                      src="/logo.png"
                      alt="logo"
                      width={50}
                      height={50} />
                    <p>All O.K!</p>
                  </div>
                  <Button
                    variant="outline"
                    className="hover:text-white translate-x-7"
                    onClick={() => toggleSidebar()}
                  >
                    <ChevronLeftIcon className="h-6 w-6" />
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

      <SidebarContent className={open ? "px-2" : "px-0"}>
        <SidebarMenu>
          {sidebarData.map((link) => {
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
                  <Link
                    href={link.href.replace(":role", `${authUser.userRole?.toLowerCase()}s`)}
                    className="w-full" scroll={false}
                  >
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

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="w-full h-14 focus:outline-none cursor-pointer p-0 mb-8">
                {authLoading ? (
                  <Skeleton className={`${open ? "h-14 w-full" : "h-10 w-10 -translate-x-1"}`} />
                ) : (
                  <SidebarMenuButton className="flex items-center justify-center p-2">
                    <Avatar className={cn("border-2", open ? "size-9" : "size-7")}>
                      <AvatarImage src={authUser.userInfo?.image} />
                      <AvatarFallback className="bg-primary">
                        {authUser.userInfo?.nickname?.[0]?.toUpperCase() || authUser.userInfo?.email?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    {open && (
                      <>
                        <p className="hidden md:block py-0.5 text-accent/90 overflow-x-hidden text-ellipsis text-nowrap">
                          {authUser.userInfo?.nickname || authUser.userInfo?.email}
                        </p>
                        <ChevronRightIcon className="ml-auto" />
                      </>
                    )}
                  </SidebarMenuButton>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="right"
                align="end"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem onClick={() =>
                  router.push(
                    `/${authUser.userRole?.toLowerCase()}s/settings`,
                    { scroll: false }
                  )
                }>
                  設定
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  サインアウト
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
