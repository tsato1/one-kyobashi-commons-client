"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { SettingsFormData, settingsSchema } from "@/lib/schemas";
import { CustomFormField } from "./custom-form-field";

interface SettingsFormProps {
  initialData: SettingsFormData;
  onSubmit: (data: SettingsFormData) => Promise<void>;
  userRole: "trustee" | "crew";
}

export const SettingsForm = ({
  initialData,
  onSubmit,
  userRole,
}: SettingsFormProps) => {
  const [editMode, setEditMode] = useState(false);
  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: initialData,
  });

  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (editMode) {
      form.reset(initialData);
    }
  };

  const handleSubmit = async (data: SettingsFormData) => {
    await onSubmit(data);
    setEditMode(false);
  };

  return (
    <div className="pt-8 pb-5 px-3 sm:px-6">
      <div className="mb-5">
        <h1 className="text-xl font-semibold">
          設定
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          アカウント情報や本アプリの使用方法を設定します
        </p>
      </div>
      <div className="bg-white rounded-xl p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <CustomFormField name="name" label="Name" disabled={!editMode} />
            <CustomFormField
              name="email"
              label="Email"
              type="email"
              disabled={!editMode} />

            {/* todo: update profile on cognito */}
            {/* <div className="pt-4 flex justify-between">
              <Button
                type="button"
                onClick={toggleEditMode}
              >
                {editMode ? "Cancel" : "Edit"}
              </Button>
              {editMode && (
                <Button
                  type="submit"
                >
                  Save Changes
                </Button>
              )}
            </div> */}
          </form>
        </Form>
      </div>
    </div>
  );
};
