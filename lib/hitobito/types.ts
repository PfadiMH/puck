/** A single member within a group in the Organigramm */
export interface OrganigrammMember {
  id: number;
  firstName: string;
  lastName: string;
  nickname?: string | null;
  /** Role type string from Hitobito (e.g. "Group::Abteilungsleitung") */
  role: string;
  /** Human-readable role name (e.g. "Abteilungsleitung") */
  roleName?: string;
  /** Profile picture URL from Hitobito */
  picture?: string | null;
}

/** A node in the Organigramm tree, representing a group and its members */
export interface OrganigrammNode {
  group: {
    id: number;
    name: string;
    shortName?: string | null;
    type: string;
  };
  members: OrganigrammMember[];
  children: OrganigrammNode[];
}

/** Cached Organigramm data stored in MongoDB */
export interface OrganigrammCache {
  rootGroupId: number;
  fetchedAt: Date;
  data: OrganigrammNode;
}

/** Response from the /api/organigramm endpoint */
export interface OrganigrammResponse {
  data: OrganigrammNode;
  stale: boolean;
  fetchedAt: string;
}
