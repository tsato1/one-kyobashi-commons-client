import { AuthUser } from "aws-amplify/auth";

declare global {
  interface UserInfo {
    id: string
    cognitoId: string
    name: string
    email: string
  }

  interface Event {
    id: string
    name: string
    description: string
    location: string
    startDate: Date
    endDate: Date
    fee: string
    adUrl: string
    photoUrls: string[]
    crewCognitoId: string
    crew?: Crew
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
