"use client";

import { SettingsForm } from "@/components/forms/settings-form";
import { SettingsFormData } from "@/lib/schemas";
import {
  useGetAuthUserQuery,
  useUpdateCrewSettingsMutation,
} from "@/state/api";

const CrewSettings = () => {
  const { data: authUser, isLoading } = useGetAuthUserQuery();
  const [updateCrew] = useUpdateCrewSettingsMutation();

  if (isLoading) return <>Loading...</>;

  const initialData = {
    name: authUser?.userInfo.name,
    email: authUser?.userInfo.email,
  };

  const handleSubmit = async (data: SettingsFormData) => {
    await updateCrew({
      cognitoId: authUser?.cognitoInfo?.userId,
      ...data,
    });
  };

  return (
    <SettingsForm
      initialData={initialData}
      onSubmit={handleSubmit}
      userRole="crew" />
  );
};

export default CrewSettings;
