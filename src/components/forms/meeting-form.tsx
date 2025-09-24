"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { useLocale } from "next-intl";
import { enUS, ja } from "date-fns/locale";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { MeetingFormData, meetingSchema } from "@/lib/schemas";
import { CustomFormField } from "./custom-form-field";

interface MeetingFormProps {
  initialData?: MeetingFormData;
  onSubmit: (data: MeetingFormData) => Promise<void>;
  userRole: "trustee" | "crew";
}

export const MeetingForm = ({
  initialData,
  onSubmit,
  userRole,
}: MeetingFormProps) => {
  const locale = useLocale();
  const dateFnsLocale = locale === "ja" ? ja : enUS

  const [isPending, startTransition] = useTransition()

  const form = useForm<MeetingFormData>({
    resolver: zodResolver(meetingSchema),
    defaultValues: initialData,
  });

  const handleSubmit = (data: MeetingFormData) => {
    startTransition(async () => {
      await onSubmit(data);
    })
  };

  return (
    <div className="w-full pt-2 pb-5 px-3 sm:px-6">
      <div className="mb-5">
        <h1 className="text-xl font-semibold">
          {initialData ? `ミーティング - ${initialData.startDate}` : "新規ミーティング"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          ミーティングを{initialData ? "編集" : "作成"}します。
        </p>
      </div>
      <div className="bg-white rounded-xl p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <CustomFormField
              name="startDate"
              label="開始日時"
              type="datetime"
              initialValue={initialData?.startDate}
              placeholder="未設定"
              disabled={isPending}
              locale={dateFnsLocale} />
            <CustomFormField
              name="endDate"
              label="終了日時"
              type="datetime"
              initialValue={initialData?.endDate || undefined}
              placeholder="未設定"
              disabled={isPending}
              locale={dateFnsLocale} />
            <CustomFormField
              name="description"
              label="詳細（議題など）"
              type="textarea"
              initialValue={initialData?.description || ""}
              disabled={isPending} />
            <Button
              type="submit"
              disabled={isPending}
            >
              保存
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
