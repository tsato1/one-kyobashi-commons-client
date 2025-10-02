"use client";

import { ErrorComponent } from "@/components/error-component";
import { sidebarDataTrustee, sidebarDataCrew } from "@/constants/navbar-data";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useGetAuthUserQuery } from "@/state/api";
import { AppSidebar } from "./_components/app-sidebar";

interface MembersLayout {
  children: React.ReactNode;
}

const MembersLayout = ({
  children
}: MembersLayout) => {
  const { data: authUser } = useGetAuthUserQuery();

  if (!authUser) {
    return <ErrorComponent />
  }

  return (
    <SidebarProvider>
      <AppSidebar sidebarData={authUser.userRole === "trustee" ? sidebarDataTrustee : sidebarDataCrew} />
      <>{children}</>
    </SidebarProvider>
  )
}

export default MembersLayout;