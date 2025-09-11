"use client";

import { useEffect, useState } from "react";
import { signOut } from "aws-amplify/auth";
import { HomeIcon, TriangleAlert } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  title?: string
  message?: string
}

export const ErrorComponent = ({
  title = "エラー",
  message = "ユーザデータが取得できませんでした。ログインし直してください。"
}: ErrorPageProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const doSignOut = async () => {
    setIsLoading(true);

    await signOut();
    window.location.href = "/";
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      doSignOut();
      return () => clearTimeout(timer);
    }, 10 * 1000); // 10 seconds
  }, [])

  return (
    <Card className="w-full h-full mx-auto mt-10 flex flex-col items-center text-center">
      <CardHeader className="w-[60%] flex flex-col items-center justify-center rounded-md p-2 sm:p-4 bg-red-50">
        <CardTitle className="flex items-center text-2xl whitespace-nowrap text-destructive">
          <TriangleAlert className="mr-1 sm:mr-2" />
          <h1>{title}</h1>
        </CardTitle>
        <CardDescription>
          {message}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>10秒後にホーム画面へ戻ります。</p>
        <p>自動で遷移しない場合は下のボタンをクリックしてください。</p>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          onClick={() => doSignOut()}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="size-5 mr-1 animate-spin bg-red-400" />
          ) : (
            <HomeIcon className="size-5 mr-1" />
          )}
          ホーム画面へ
        </Button>
      </CardFooter>
    </Card>
  )
}
