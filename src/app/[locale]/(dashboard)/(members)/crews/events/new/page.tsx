"use client";

import { signOut } from "aws-amplify/auth";
import { toast } from "sonner";

import { ErrorComponent } from "@/components/error-component";
import { EventForm } from "@/components/forms/event-form";
import { Skeleton } from "@/components/ui/skeleton";
import { EventFormData } from "@/lib/schemas";
import { useCreateEventMutation, useGetAuthUserQuery } from "@/state/api";

const NewEventPage = () => {
  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
  const [createEvent] = useCreateEventMutation();

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

  const handleSubmit = async (data: EventFormData) => {
    if (!authUser?.cognitoInfo?.userId) {
      toast.error("ユーザIDが見つかりません。ログインし直してください。");
      setTimeout(async () => {
        await signOut();
        window.location.href = "/";
      }, 1000);
      return;
    }

    // todo: validate other inputs
    if (!data.name || data.name.trim() === "") {
      // todo: show error on the form
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description || "");
    formData.append("createdBy", authUser.cognitoInfo.userId);
    await createEvent(formData);
  };

  if (!authUser) {
    return <ErrorComponent />;
  }

  return (
    <EventForm
      onSubmit={handleSubmit}
      userRole="crew" />
  )
}

export default NewEventPage;