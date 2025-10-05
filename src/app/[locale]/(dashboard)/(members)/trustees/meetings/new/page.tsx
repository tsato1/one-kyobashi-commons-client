"use client";

import { signOut } from "aws-amplify/auth";
import { toast } from "sonner";

import { ErrorComponent } from "@/components/error-component";
import { MutateMeeting, MeetingForm } from "@/components/forms/meeting-form";
import { Skeleton } from "@/components/ui/skeleton";
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

  const handleSubmit = async (data: MutateMeeting) => {
    if (!authUser?.cognitoInfo?.userId) {
      toast.error("ユーザIDが見つかりません。ログインし直してください。");
      setTimeout(async () => {
        await signOut();
        window.location.href = "/";
      }, 1000);
      return;
    }

    console.log("Data being sent to server", data);

    await createMeeting(data);
  };

  if (!authUser) {
    return <ErrorComponent />;
  }

  return (
    <MeetingForm onSubmit={handleSubmit} />
  )
}

export default NewMeetingPage;