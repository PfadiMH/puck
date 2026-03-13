export interface Rsvp {
  _id: string;
  eventId: string;
  deviceId: string;
  profileId: string;
  firstName: string;
  lastName: string;
  pfadiName?: string;
  comment?: string;
  status: "attending" | "declined";
  createdAt: string;
  updatedAt: string;
}

export interface RsvpInput {
  eventId: string;
  deviceId: string;
  profileId: string;
  firstName: string;
  lastName: string;
  pfadiName?: string;
  comment?: string;
  status: "attending" | "declined";
}

export interface RsvpCount {
  attending: number;
  declined: number;
}
