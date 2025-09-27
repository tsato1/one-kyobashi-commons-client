"use client";

import { SettingsForm } from "@/components/forms/settings-form";
import { SettingsFormData } from "@/lib/schemas";
import {
  useGetAuthUserQuery,
  useUpdateTrusteeSettingsMutation,
} from "@/state/api";

const TrusteeSettings = () => {
  const { data: authUser, isLoading } = useGetAuthUserQuery();
  const [updateTrustee] = useUpdateTrusteeSettingsMutation();

  if (isLoading) return <>Loading...</>;

  const initialData = {
    name: authUser?.userInfo?.nickname, // todo: change name -> nickname
    email: authUser?.userInfo?.email,
  };

  const handleSubmit = async (data: SettingsFormData) => {
    await updateTrustee({
      cognitoId: authUser?.cognitoInfo?.userId,
      ...data,
    });
  };

  return (
    <SettingsForm
      initialData={initialData}
      onSubmit={handleSubmit}
      userRole="trustee" />
  );
};

export default TrusteeSettings;
