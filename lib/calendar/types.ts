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
}

export type CalendarGroupDb = CalendarGroup;

export interface CalendarGroupInput {
  slug: string;
  name: string;
  order: number;
}

// --- Calendar Events ---

export interface CalendarEvent {
  _id: string;
  uid: string; // Stable ICS UID: "event-{_id}@pfadimh.ch"
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
