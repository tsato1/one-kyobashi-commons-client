"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "aws-amplify/auth";
import {
  ChevronRightIcon,
  MenuIcon,
  X,
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
import { sidebarData } from "@/constants/navbar-data";
import { cn } from "@/lib/utils";
import { useGetAuthUserQuery } from "@/state/api";
import { ErrorComponent } from "@/components/error-component";

interface AppSidebarProps {
  userRole: "trustee" | "crew";
}

export const AppSidebar = ({ userRole }: AppSidebarProps) => {
  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
  const pathname = usePathname();
  const router = useRouter();
  const { toggleSidebar, open } = useSidebar();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  if (!authUser || !authUser.userRole) {
    return <ErrorComponent message="ユーザデータが取得できませんでした。" />
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
              <DropdownMenuTrigger asChild className="h-14 focus:outline-none cursor-pointer">
                <SidebarMenuButton className="mb-7">
                  {authLoading ? (
                    <>Loading...</>
                  ) : (
                    authUser ? (
                      <>
                        <Avatar className="size-9 border-2">
                          <AvatarImage src={authUser.userInfo?.image} />
                          <AvatarFallback className="bg-primary">
                            {authUser.cognitoInfo?.username?.[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <p className="hidden md:block py-0.5 text-accent/90 overflow-x-hidden text-ellipsis text-nowrap">
                          {authUser.cognitoInfo?.username}
                        </p>
                        <ChevronRightIcon className="ml-auto" />
                      </>
                    ) : (
                      <>
                        ユーザをロードできません
                      </>
                    )
                  )}
                </SidebarMenuButton>
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
