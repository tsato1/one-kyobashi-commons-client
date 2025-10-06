"use client";

import { useRouter } from "next/navigation";
import { signOut } from "aws-amplify/auth";
import { toast } from "sonner";

import { ErrorComponent } from "@/components/error-component";
import { MutateMeeting, MeetingForm } from "@/components/forms/meeting-form";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateMeetingMutation, useGetAuthUserQuery } from "@/state/api";

const NewMeetingPage = () => {
  const router = useRouter();
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
    console.log("Data being sent to server", data);

    try {
      await createMeeting(data);
      router.push("/trustees/meetings");
    } catch {
      toast.error("Failed to create meeting. Please try again.");
    }
  };

  if (!authUser) {
    return <ErrorComponent />;
  }

  return (
    <MeetingForm onSubmit={handleSubmit} />
  )
}

export default NewMeetingPage;