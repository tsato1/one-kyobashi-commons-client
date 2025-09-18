/* eslint-disable @typescript-eslint/no-explicit-any */
import { cleanParams, createNewUserInDatabase, withToast } from "@/lib/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import { FiltersState } from ".";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      const session = await fetchAuthSession();
      const { idToken } = session.tokens ?? {};
      if (idToken) {
        headers.set("Authorization", `Bearer ${idToken}`);
      }
      return headers;
    },
  }),
  reducerPath: "api",
  tagTypes: [
    "Trustees",
    "Crews",
    "Meetings",
    "MeetingDetails",
    "Events",
    "EventDetails",
    "Payments",
  ],
  endpoints: (build) => ({
    getAuthUser: build.query<User, void>({
      queryFn: async (_, _queryApi, _extraoptions, fetchWithBQ) => {
        try {
          const session = await fetchAuthSession();
          const { idToken } = session.tokens ?? {};
          const user = await getCurrentUser();
          const userRole = idToken?.payload["custom:role"] as string;

          const endpoint =
            userRole === "trustee"
              ? `/trustees/${user.userId}`
              : `/crews/${user.userId}`;

          let userDetailsResponse = await fetchWithBQ(endpoint);

          // If user doesn't exist, create new user
          if (
            userDetailsResponse.error &&
            userDetailsResponse.error.status === 404
          ) {
            userDetailsResponse = await createNewUserInDatabase(
              user,
              idToken,
              userRole,
              fetchWithBQ
            );
          }

          return {
            data: {
              cognitoInfo: { ...user },
              userInfo: userDetailsResponse.data as Trustee | Crew,
              userRole,
            },
          };
        } catch (error: any) {
          return { error: error.message || "ユーザ情報を取得できませんでした。" };
        }
      },
    }),

    getEvents: build.query<
      Event[],
      Partial<FiltersState> & { favoriteIds?: number[] }
    >({
      query: (filters) => {
        const params = cleanParams({
          eventType: filters.eventType,
          location: filters.location,
          priceMin: filters.priceRange?.[0],
          priceMax: filters.priceRange?.[1],
          dateMin: filters.dateRange?.[0],
          dateMax: filters.dateRange?.[1],
          availableFrom: filters.availableFrom,
          favoriteIds: filters.favoriteIds?.join(","),
        });

        return { url: "events", params };
      },
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: "Events" as const, id })),
            { type: "Events", id: "LIST" },
          ]
          : [{ type: "Events", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "イベントが取得できませんでした。"
        });
      },
    }),

    getEventById: build.query<Event, string>({
      query: (id) => `events/${id}`,
      providesTags: (result, error, id) => [{ type: "EventDetails", id }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "イベントが取得できませんでした。"
        });
      },
    }),

    createEvent: build.mutation<Event, FormData>({
      query: (newEvent) => ({
        url: `events`,
        method: "POST",
        body: newEvent,
      }),
      invalidatesTags: (result) => [
        { type: "Events", id: "LIST" },
        { type: "Crews", id: result?.createdBy },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "イベントを作成しました。",
          error: "イベントが作成できませんでした。",
        });
      },
    }),

    getMeetings: build.query<
      Meeting[],
      Partial<FiltersState> & { favoriteIds?: number[] }
    >({
      query: (filters) => {
        const params = cleanParams({
          location: filters.location,
          dateMin: filters.dateRange?.[0],
          dateMax: filters.dateRange?.[1],
        });

        return { url: "meetings", params };
      },
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: "Meetings" as const, id })),
            { type: "Meetings", id: "LIST" },
          ]
          : [{ type: "Meetings", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "ミーティングが取得できませんでした。"
        });
      },
    }),

    getMeetingById: build.query<Meeting, string>({
      query: (id) => `meetings/${id}`,
      providesTags: (result, error, id) => [{ type: "MeetingDetails", id }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "ミーティングが取得できませんでした。"
        });
      },
    }),

    createMeeting: build.mutation<Meeting, FormData>({
      query: (newMeeting) => ({
        url: `meetings`,
        method: "POST",
        body: newMeeting,
      }),
      invalidatesTags: (result) => [
        { type: "Meetings", id: "LIST" },
        { type: "Crews", id: result?.createdBy },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "ミーティングを作成しました。",
          error: "ミーティングが作成できませんでした。",
        });
      },
    }),

    updateCrewSettings: build.mutation<
      Crew,
      { cognitoId?: string } & Partial<Crew>
    >({
      query: ({ cognitoId, ...updatedCrew }) => ({
        url: `crews/${cognitoId}`,
        method: "PATCH",
        body: updatedCrew,
      }),
      invalidatesTags: (result) => [{ type: "Crews", id: result?.id }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "設定を更新しました。",
          error: "設定を更新できませんでした。",
        });
      },
    }),

    updateTrusteeSettings: build.mutation<
      Trustee,
      { cognitoId?: string } & Partial<Trustee>
    >({
      query: ({ cognitoId, ...updatedTrustee }) => ({
        url: `trustees/${cognitoId}`,
        method: "PATCH",
        body: updatedTrustee,
      }),
      invalidatesTags: (result) => [{ type: "Trustees", id: result?.id }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "設定を更新しました。",
          error: "設定が更新できませんでした。",
        });
      },
    }),

    getPayments: build.query<Payment[], number>({
      query: (leaseId) => `leases/${leaseId}/payments`,
      providesTags: ["Payments"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "決済情報が取得できませんでした。",
        });
      },
    }),
  }),
});

export const {
  useGetAuthUserQuery,
  useGetEventsQuery,
  useGetEventByIdQuery,
  useCreateEventMutation,
  useGetMeetingsQuery,
  useGetMeetingByIdQuery,
  useCreateMeetingMutation,
  useUpdateCrewSettingsMutation,
  useUpdateTrusteeSettingsMutation,
  useGetPaymentsQuery,
} = api;
