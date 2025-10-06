"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ErrorComponent } from "@/components/error-component";
import { MutateMeeting, MeetingForm } from "@/components/forms/meeting-form";
import { useCreateMeetingMutation, useGetAuthUserQuery } from "@/state/api";

const NewMeetingPage = () => {
  const router = useRouter();
  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
  const [createMeeting] = useCreateMeetingMutation();

  const handleSubmit = async (data: MutateMeeting) => {
    console.log("Data being sent to server", data);

    try {
      await createMeeting(data);
      router.push("/trustees/meetings");
    } catch {
      toast.error("Failed to create meeting. Please try again.");
    }
  };

  if (authLoading) {
    return <>Loading...</>;
  }

  if (!authUser) {
    return <ErrorComponent />;
  }

  return (
    <MeetingForm onSubmit={handleSubmit} />
  )
}

export default NewMeetingPage;