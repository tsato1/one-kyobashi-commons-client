"use client";

import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { validate as isUuid } from "uuid";

import { ErrorComponent } from "@/components/error-component";
import { MutateMeeting, MeetingForm } from "@/components/forms/meeting-form";
import {
  useGetAuthUserQuery,
  useGetMeetingByIdQuery,
  useUpdateMeetingMutation
} from "@/state/api";

const UpdateMeetingPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
  const { data: meeting, isLoading } = useGetMeetingByIdQuery(id, { skip: !isUuid(id) });
  const [updateMeeting] = useUpdateMeetingMutation();

  const handleSubmit = async (data: MutateMeeting) => {
    console.log("Data being sent to server", data);

    try {
      await updateMeeting({ ...data, id });
      router.push("/trustees/meetings");
    } catch {
      toast.error("Failed to update meeting. Please try again.");
    }
  };

  if (authLoading) {
    return <>Loading...</>;
  }

  if (!authUser) {
    return <ErrorComponent />;
  }

  if (!isUuid(id)) {
    return <div>Invalid meeting ID</div>
  }

  if (isLoading) {
    return <div className="w-full text-center pt-14">Loading...</div>
  }

  return (
    <MeetingForm
      initialData={meeting}
      onSubmit={handleSubmit} />
  )
}

export default UpdateMeetingPage;