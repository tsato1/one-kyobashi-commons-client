"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventFormData, eventSchema } from "@/lib/schemas";
import { CustomFormField } from "./custom-form-field";

interface EventFormProps {
  initialData?: EventFormData;
  onSubmit: (data: EventFormData) => Promise<void>;
  userRole: "trustee" | "crew";
}

export const EventForm = ({
  initialData,
  onSubmit,
  userRole,
}: EventFormProps) => {
  const [isPending, startTransition] = useTransition()

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialData,
  });

  const handleSubmit = (data: EventFormData) => {
    startTransition(async () => {
      await onSubmit(data);
    })
  };

  return (
    <div className="pt-2 pb-5 px-3 sm:px-6">
      <div className="mb-5">
        <h1 className="text-xl font-semibold">
          {initialData ? `イベント - ${initialData.name}` : "新規イベント"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          イベントを{initialData ? "編集" : "作成"}します。
        </p>
      </div>
      <div className="bg-white rounded-xl p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <CustomFormField
              name="name"
              label="イベント名"
              initialValue={initialData?.name || ""}
              disabled={isPending} />
            <CustomFormField
              name="description"
              label="詳細"
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
