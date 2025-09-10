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
          return { error: error.message || "Could not fetch user data" };
        }
      },
    }),

    getEvents: build.query<
      Event[],
      Partial<FiltersState> & { favoriteIds?: number[] }
    >({
      query: (filters) => {
        const params = cleanParams({
          location: filters.location,
          priceMin: filters.priceRange?.[0],
          priceMax: filters.priceRange?.[1],
          beds: filters.beds,
          baths: filters.baths,
          eventType: filters.eventType,
          squareFeetMin: filters.squareFeet?.[0],
          squareFeetMax: filters.squareFeet?.[1],
          amenities: filters.amenities?.join(","),
          availableFrom: filters.availableFrom,
          favoriteIds: filters.favoriteIds?.join(","),
          latitude: filters.coordinates?.[1],
          longitude: filters.coordinates?.[0],
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
          error: "Failed to fetch events.",
        });
      },
    }),

    getEvent: build.query<Event, string>({
      query: (id) => `events/${id}`,
      providesTags: (result, error, id) => [{ type: "EventDetails", id }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to load event details.",
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
        { type: "Crews", id: result?.crew?.id },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Event created successfully!",
          error: "Failed to create event.",
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
          success: "Settings updated successfully!",
          error: "Failed to update settings.",
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
          success: "Settings updated successfully!",
          error: "Failed to update settings.",
        });
      },
    }),

    getPayments: build.query<Payment[], number>({
      query: (leaseId) => `leases/${leaseId}/payments`,
      providesTags: ["Payments"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to fetch payment info.",
        });
      },
    }),
  }),
});

export const {
  useGetAuthUserQuery,
  useGetEventsQuery,
  useGetEventQuery,
  useUpdateCrewSettingsMutation,
  useUpdateTrusteeSettingsMutation,
  useCreateEventMutation,
  useGetPaymentsQuery,
} = api;
