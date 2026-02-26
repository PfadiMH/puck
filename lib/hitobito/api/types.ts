export interface HitobitoClientConfig {
  baseUrl: string;
  token: string;
}

export interface Person {
  id: number;
  first_name: string;
  last_name: string;
  nickname?: string | null;
  email?: string | null;
  birthday?: string | null;
  gender?: "m" | "w" | null;
  address?: string | null;
  zip_code?: string | null;
  town?: string | null;
  country?: string | null;
  primary_group_id?: number | null;
  picture?: string | null;
}

export interface Group {
  id: number;
  name: string;
  short_name?: string | null;
  type: string;
  parent_id?: number | null;
  layer_group_id?: number | null;
  email?: string | null;
  address?: string | null;
  zip_code?: string | null;
  town?: string | null;
  country?: string | null;
}

export interface Event {
  id: number;
  name: string;
  description?: string | null;
  motto?: string | null;
  cost?: string | null;
  maximum_participants?: number | null;
  participant_count?: number | null;
  location?: string | null;
  application_opening_at?: string | null;
  application_closing_at?: string | null;
  application_conditions?: string | null;
  state?: string | null;
  dates: EventDate[];
  group_ids: number[];
}

export interface EventDate {
  id: number;
  label?: string | null;
  start_at: string;
  finish_at?: string | null;
  location?: string | null;
}

export interface Role {
  id: number;
  type: string;
  name?: string;
  person_id: number;
  group_id: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface Invoice {
  id: number;
  title: string;
  state: string;
  sequence_number?: string | null;
  recipient_email?: string | null;
  recipient_address?: string | null;
  sent_at?: string | null;
  due_at?: string | null;
  total?: string | null;
  amount_open?: string | null;
  group_id?: number | null;
  recipient_id?: number | null;
}

export interface MailingList {
  id: number;
  name: string;
  description?: string | null;
  publisher?: string | null;
  mail_name?: string | null;
  additional_sender?: string | null;
  subscribable?: boolean | null;
  subscribers_may_post?: boolean | null;
  anyone_may_post?: boolean | null;
  group_id?: number | null;
}

export interface EventKind {
  id: number;
  label: string;
  short_name?: string | null;
  minimum_age?: number | null;
  general_information?: string | null;
  application_conditions?: string | null;
}

export interface EventKindCategory {
  id: number;
  label: string;
  order?: number | null;
}

export interface PeopleFilter {
  first_name?: string;
  last_name?: string;
  email?: string;
  company?: string;
  birthday?: string;
  gender?: string;
  primary_group_id?: number;
}

export interface GroupsFilter {
  name?: string;
  type?: string;
  parent_id?: number;
  layer?: string;
  archived_at?: string;
}

export interface EventsFilter {
  type?: string;
  group_id?: number;
  kind_id?: number;
  state?: string;
  number?: string;
}

export interface RolesFilter {
  person_id?: number;
  group_id?: number;
  type?: string;
  label?: string;
  start_on?: string;
  end_on?: string;
}

export interface InvoicesFilter {
  group_id?: number;
  recipient_id?: number;
}

export interface MailingListsFilter {
  group_id?: number;
  subscribers_may_post?: boolean;
  anyone_may_post?: boolean;
}

export type PeopleSortKey = "last_name" | "first_name" | "email";
export type GroupsSortKey = "name" | "type";
export type EventsSortKey = "name" | "state";
export type RolesSortKey = "type" | "created_at";
export type InvoicesSortKey =
  | "title"
  | "state"
  | "due_at"
  | "sequence_number";
export type MailingListsSortKey = "name";

export interface QueryOptions<
  TFilter = Record<string, unknown>,
  TSort extends string = string,
> {
  filter?: TFilter;
  sort?: TSort;
  page?: number;
  per_page?: number;
}

export interface PersonUpdate {
  first_name?: string;
  last_name?: string;
  nickname?: string | null;
  email?: string | null;
  birthday?: string | null;
  gender?: "m" | "w" | null;
  address?: string | null;
  zip_code?: string | null;
  town?: string | null;
  country?: string | null;
}

export interface RoleCreate {
  type: string;
  person_id: number;
  group_id: number;
  label?: string;
}

export interface RoleUpdate {
  type?: string;
  label?: string;
}

export interface InvoiceUpdate {
  title?: string;
  state?: string;
  due_at?: string | null;
}
