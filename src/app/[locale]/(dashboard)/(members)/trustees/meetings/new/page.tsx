"use client";

import { signOut } from "aws-amplify/auth";
import { toast } from "sonner";

import { ErrorComponent } from "@/components/error-component";
import { MeetingForm } from "@/components/forms/meeting-form";
import { Skeleton } from "@/components/ui/skeleton";
import { MeetingFormData } from "@/lib/schemas";
import { useCreateMeetingMutation, useGetAuthUserQuery } from "@/state/api";

const NewMeetingPage = () => {
  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
  const [createMeeting] = useCreateMeetingMutation();

  if (authLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="w-[80%] h-10 mb-1" />
        <Skeleton className="w-[70%] h-14" />

        <Skeleton className="w-[80%] h-10 mb-1" />
        <Skeleton className="w-[70%] h-14" />
      </div>
    );
  }

  const handleSubmit = async (data: MeetingFormData) => {
    if (!authUser?.cognitoInfo?.userId) {
      toast.error("ユーザIDが見つかりません。ログインし直してください。");
      setTimeout(async () => {
        await signOut();
        window.location.href = "/";
      }, 1000);
      return;
    }

    const formData = new FormData();
    // formData.append("visibility", data.visibility || "Private");
    // formData.append("startDate", data.startDate.toISOString());
    // formData.append("endDate", data.endDate?.toISOString() || "");
    formData.append("description", data.description || "");
    formData.append("createdBy", authUser.cognitoInfo.userId);
    await createMeeting(formData);
  };

  if (!authUser) {
    return <ErrorComponent />;
  }

  return (
    <MeetingForm
      onSubmit={handleSubmit}
      userRole="crew" />
  )
}

export default NewMeetingPage;