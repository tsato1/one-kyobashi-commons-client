"use client";

import { enUS, ja } from "date-fns/locale";
import { useLocale } from "next-intl";
import Link from "next/link";

import { ErrorComponent } from "@/components/error-component";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { useGetAuthUserQuery } from "@/state/api";
import { NavbarWelcome } from './_components/navbar-welcome';
import { WelcomeStepper } from "./_components/welcome-stepper";

const WelcomePage = () => {
  const locale = useLocale();
  const { data: authUser, isLoading } = useGetAuthUserQuery();

  if (!authUser) {
    return <ErrorComponent />
  }

  return (
    <div className='w-full sm:w-[600px] mx-auto mb-12'>
      <NavbarWelcome />
      {!authUser.userInfo.birthMonth ? (
        <WelcomeStepper locale={locale === "ja" ? ja : enUS} />
      ) : (
        <Card className="w-full sm:w-[600px] space-y-6">
          <CardHeader>
            <CardTitle className="text-lg sm:text-3xl">
              こ入力ありがとうございます！
            </CardTitle>
            <CardDescription>
              自己紹介の準備をしていてくださいね！
              <br />
              追ってご連絡差し上げますm(_ _)m
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-base">登録されているデータ</div>
            <div className="text-sm text-gray-600 space-y-1">
              <div>ニックネーム：{authUser.userInfo.nickname}</div>
              <div>誕生月：{authUser.userInfo.birthMonth}</div>
              <div>興味のある役割：{authUser.userInfo.role}</div>
            </div>
          </CardContent>
          <CardFooter className="ml-auto">
            <Link href="/">
              <Button>
                ホームへ
              </Button>
            </Link>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

export default WelcomePage;
