"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useGetAuthUserQuery } from "@/state/api";

export function NonDashboardAuthProvider({
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
        (userRole === "trustee" && pathname.startsWith("/search")) ||
        (userRole === "trustee" && pathname === "/")
      ) {
        router.push("/trustees/dashboard", { scroll: false });
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [authUser, router, pathname]);

  if (authLoading || isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return <>{children}</>
}
