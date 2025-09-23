"use client";

import { useRouter, usePathname } from "next/navigation";
import { PlusIcon } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const MeetingsPageLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/)/, '');
  const lastPathSegment = pathname.split("/").filter(Boolean).at(-1);

  return (
    <div className="w-full mt-6.5">
      <div className="flex items-center justify-between">
        <Breadcrumb className="px-3 sm:px-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              {pathnameWithoutLocale === "/trustees/meetings" ? (
                <BreadcrumbPage>ミーティング</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href="/trustees/meetings">ミーティング</BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!pathname.endsWith("/meetings") && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {pathnameWithoutLocale === "/trustees/meetings/new" ? (
                    <BreadcrumbPage>new</BreadcrumbPage>
                  ) : (
                    <BreadcrumbPage>{lastPathSegment}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        {pathname.split("/").filter(Boolean).at(-1) === "meetings" ? (
          <Button
            onClick={() => router.push("/trustees/meetings/new")}
            className="mr-6"
          >
            <PlusIcon />新規作成
          </Button>
        ) : (
          <div className="h-9" />
        )}
      </div>

      <Separator className="mt-6.5" />

      <div className="mt-7">
        {children}
      </div>
    </div>
  )
}

export default MeetingsPageLayout;