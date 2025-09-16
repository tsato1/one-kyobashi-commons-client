import { AuthUser } from "aws-amplify/auth";

declare global {
  interface UserInfo {
    id: string
    cognitoId: string
    name: string
    email: string
    image?: string
  }

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

  type Trustee = {
    managedEvents: Event[]
  } & UserInfo

  type Crew = {
    events: Event[]
    favorites: Event[]
  } & UserInfo

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
    userInfo: Trustee | Crew;
    userRole: JsonObject | JsonPrimitive | JsonArray;
  }
}

export { };
