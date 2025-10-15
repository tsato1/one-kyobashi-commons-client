import { AuthUser } from "aws-amplify/auth";

import {
  meetingResponseSchema,
  userResponseSchema
} from "@one-kyobashi-commons/shared";

export type MeetingResponse = z.infer<typeof meetingResponseSchema>;
export type UserInfo = z.infer<typeof userResponseSchema>;

declare global {
  interface Event {
    id: string
    name: string
    description: string
    location: string
    startDate: Date
    endDate: Date
    price: string
    adUrl: string // For advertisement
    photoUrls: string[] // For records
    createdBy: string
    user?: User
  }

  enum PaymentStatus {
    Pending,
    Paid,
    Failed,
  }

  interface Payment {
    id: string
    amountDue: number
    amountPaid: number
    dueDate: Date
    paymentDate: Date
    paymentStatus: PaymentStatus
    itemId: number
    item: Item
  }

  interface User {
    cognitoInfo: AuthUser;
    userInfo: UserInfo;
    userRole: JsonObject | JsonPrimitive | JsonArray;
  }
}

export { };
