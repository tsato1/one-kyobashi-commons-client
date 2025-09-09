"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useGetAuthUserQuery } from "@/state/api";
import { AppSidebar } from "@/components/app-sidebar";

export function DashboardAuthProvider({
  children
}: {
  children: React.ReactNode
}) {
  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authUser) {
      const userRole = authUser.userRole?.toLowerCase();

      if (
        (userRole === "trustee" && pathname.startsWith("/crews")) ||
        (userRole === "crew" && pathname.startsWith("/trustees"))
      ) {
        router.push(
          userRole === "trustee"
            ? "/trustees/dashboard"
            : "/crews/dashbaord",
          { scroll: false }
        );
      } else {
        setIsLoading(false);
      }
    } else {
      if (!isLoading) {
        router.push("/")
      }
    }
  }, [authUser, router, pathname, isLoading]);

  if (authLoading || isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!authUser?.userRole) {
    return null;
  }

  return (
    <>
      <AppSidebar userRole={authUser.userRole.toLowerCase()} />
      <>{children}</>
    </>
  )
}
