"use client";

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
    // todo
    // await createEvent({ });
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