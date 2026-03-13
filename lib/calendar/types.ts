// --- Shared Types ---

export type MitnehmenItem = {
  name: string;
  icon?: string; // Icon ID from predefined set
};

export type LocationInfo = {
  name: string;
  mapsLink?: string;
};

// --- Calendar Groups (Stufen) ---

export interface CalendarGroup {
  _id: string;
  slug: string; // URL-safe identifier, e.g. "biber", "woelfe"
  name: string; // Display name, e.g. "Biberstufe"
  order: number; // Display/sort order
  isLeiterGroup?: boolean; // If true, feeds for this group include leitersitzung events
}

export type CalendarGroupDb = CalendarGroup;

export interface CalendarGroupInput {
  slug: string;
  name: string;
  order: number;
  isLeiterGroup?: boolean;
}

// --- Audience ---

export type ActivityAudience = "kinder" | "leiter";

// --- Calendar Events ---

export type CalendarEventType = "aktivitaet" | "lager" | "leitersitzung";

export interface CalendarEvent {
  _id: string;
  uid: string; // Stable ICS UID: "event-{_id}@pfadimh.ch"
  eventType?: CalendarEventType; // defaults to "aktivitaet" for backwards compat
  title: string;
  description?: string;
  date: string; // "YYYY-MM-DD"
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  location?: LocationInfo;
  endLocation?: LocationInfo;
  groups: string[]; // group slugs this event belongs to
  allGroups: boolean; // true = appears in every group's feed
  mitnehmen: MitnehmenItem[];
  bemerkung?: string;
  createdAt: string;
  updatedAt: string;
}

export type CalendarEventDb = CalendarEvent;

export interface CalendarEventInput {
  eventType?: CalendarEventType;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  location?: LocationInfo;
  endLocation?: LocationInfo;
  groups: string[];
  allGroups: boolean;
  mitnehmen: MitnehmenItem[];
  bemerkung?: string;
}

export type RsvpStatus = "attending" | "declined";

export interface Rsvp {
  _id: string;
  activityId: string;
  deviceId: string;
  profileId: string;
  firstName: string;
  lastName: string;
  pfadiName?: string;
  comment?: string;
  status: RsvpStatus;
  createdAt: string;
  updatedAt: string;
}

export interface RsvpInput {
  activityId: string;
  deviceId: string;
  profileId: string;
  firstName: string;
  lastName: string;
  pfadiName?: string;
  status: RsvpStatus;
}

export interface RsvpCount {
  attending: number;
  declined: number;
}
