"use client";

import { useGetMeetingsQuery } from "@/state/api";

const MeetingsPage = () => {
  const { data: meetings, isLoading } = useGetMeetingsQuery({});

  return (
    <div className="w-full flex flex-col items-center justify-center mt-10">
      {meetings?.map((meeting) => (
        <div key={meeting.id} className="p-4 border rounded mb-4 w-1/2">
          {/* <p>Meeting ID: {meeting.id}</p> */}
          {/* <p>Visibility: {meeting.visibility}</p> */}
          <p>日時: {meeting.startDate?.toString()}</p>
          {/* <p>End Date: {meeting.endDate?.toString()}</p> */}
          <p>{meeting.description}</p>
        </div>
      ))}
      {isLoading && <p>Loading meetings...</p>}
      {!isLoading && meetings?.length === 0 && <p>ミーティングがありません</p>}
    </div>
  )
}

export default MeetingsPage;
