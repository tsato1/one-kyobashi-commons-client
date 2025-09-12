"use client";

import { useParams } from "next/navigation"

import { ErrorComponent } from "@/components/error-component";
import { EventForm } from "@/components/forms/event-form";
import { Skeleton } from "@/components/ui/skeleton";
import { EventFormData } from "@/lib/schemas";
import { useGetAuthUserQuery, useGetEventQuery } from "@/state/api";

const EventPage = () => {
  const params = useParams<{ id: string }>()

  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
  const { data: event, isLoading: eventLoading } = useGetEventQuery(params.id)
  // const [updateEvent] = useUpdateEventMutation(); // todo

  if (authLoading || eventLoading) {
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
    // await updateEvent({ });
  };

  if (!authUser) {
    return <ErrorComponent />;
  }

  if (!event) {
    return <div className="text-center">イベントが見つかりませんでした。</div>
  }

  return (
    <EventForm
      initialData={{
        name: event.name,
        description: event.description,
        // tags: event?.tags,
      }}
      onSubmit={handleSubmit}
      userRole="crew" />
  )
}

export default EventPage;