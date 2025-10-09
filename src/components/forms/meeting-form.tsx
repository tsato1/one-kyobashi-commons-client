"use client";

import { useEffect, useTransition } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useLocale } from "next-intl";
import { enUS, ja } from "date-fns/locale";
import { zodResolver } from "@hookform/resolvers/zod";
import { mutateMeetingSchema } from "@one-kyobashi-commons/shared";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CustomFormField } from "./custom-form-field";

export type MutateMeeting = z.infer<typeof mutateMeetingSchema>;

interface MeetingFormProps {
  initialData?: MutateMeeting;
  onSubmit: (data: MutateMeeting) => Promise<void>;
}

export const MeetingForm = ({
  initialData,
  onSubmit,
}: MeetingFormProps) => {
  const locale = useLocale();
  const dateFnsLocale = locale === "ja" ? ja : enUS

  const [isPending, startTransition] = useTransition()

  const form = useForm<MutateMeeting>({
    resolver: zodResolver(mutateMeetingSchema),
    defaultValues: initialData || {},
  });

  const { isDirty } = form.formState;

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const handleSubmit = (data: MutateMeeting) => {
    startTransition(async () => {
      await onSubmit(data);
    })
  };

  return (
    <div className="w-full pt-2 pb-5 px-3 sm:px-6">
      <div className="mb-5">
        <h1 className="text-xl font-semibold">
          {initialData ? `${initialData.name}` : "新規ミーティング"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          ミーティングを{initialData ? "編集" : "作成"}します。
        </p>
      </div>
      <div className={cn(
        "relative bg-white rounded-xl px-2 sm:px-4 py-4 sm:py-6",
        (!!initialData && isDirty) && "ring-2 ring-primary"
      )}>
        {(!!initialData && isDirty) && (
          <Badge className="absolute top-0 right-0 mx-2 sm:mx-4 my-4 sm:my-6">
            Edited
          </Badge>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6 sm:space-y-8"
          >
            <CustomFormField
              name="visibility"
              label="公開タイプ"
              subLabel="誰でも参加可能な一般公開または選択したメンバーが参加の限定公開を選びます"
              type="select"
              options={[
                { value: "public", label: "一般公開" },
                { value: "private", label: "限定公開" }
              ]}
              initialValue={initialData?.visibility || "private"}
              disabled={isPending} />
            <CustomFormField
              name="startDate"
              label="開始日時"
              type="datetime"
              placeholder="未設定"
              disabled={isPending}
              required
              locale={dateFnsLocale} />
            <CustomFormField
              name="endDate"
              label="終了日時"
              type="datetime"
              placeholder="未設定"
              disabled={isPending}
              locale={dateFnsLocale} />
            <CustomFormField
              name="name"
              label="名前"
              initialValue={initialData?.name || ""}
              disabled={isPending}
              required />
            <CustomFormField
              name="description"
              label="詳細（議題など）"
              type="textarea"
              initialValue={initialData?.description}
              disabled={isPending} />
            <CustomFormField
              name="location"
              label="場所"
              type="select"
              initialValue={initialData?.location || "angler"}
              options={[{ value: "angler", label: "アングラー (Sameshima Coffee Rostery)" }]}
              disabled={isPending} />
            <CustomFormField
              name="allowedRoles"
              label="対象者"
              subLabel="一般公開の場合、何にチェックを入れたかに関わらず、メンバー以外の人でも参加が可能な旨表示されます"
              type="multi-select"
              options={[
                { value: "crew", label: "クルー" },
                { value: "trustee", label: "一味" },
              ]}
              initialValue={initialData?.allowedRoles || []}
              disabled={isPending} />
            <CustomFormField
              name="materialUrls"
              label="資料URL"
              subLabel="スライドや資料のURLを追加します"
              type="multi-input"
              placeholder="https://"
              buttonLabel="追加"
              disabled={isPending} />
            <CustomFormField
              name="joinUrl"
              label="オンライン会議URL"
              subLabel="Google MeetまたはZoomのURLが入力できます"
              placeholder="https://"
              initialValue={initialData?.joinUrl || ""}
              disabled={isPending} />
            <div className="w-full flex justify-end">
              <Button
                type="submit"
                disabled={isPending || !isDirty}
              >
                保存
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
