import type { HitobitoClient } from "./api";
import type { Group, Person, Role } from "./api/types";
import type { OrganigrammMember, OrganigrammNode } from "./types";

/** Max concurrent Hitobito API requests to avoid rate limiting */
const CONCURRENCY_LIMIT = 5;

/**
 * Execute an array of async functions with a concurrency limit.
 * Returns results in the same order as the input.
 */
async function parallelLimit<T>(
  tasks: (() => Promise<T>)[],
  limit: number
): Promise<T[]> {
  const results: T[] = new Array(tasks.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < tasks.length) {
      const index = nextIndex++;
      results[index] = await tasks[index]();
    }
  }

  const workers = Array.from(
    { length: Math.min(limit, tasks.length) },
    () => worker()
  );
  await Promise.all(workers);
  return results;
}

/**
 * Extract a human-readable role name from the Hitobito role type string.
 * e.g. "Group::Abteilung::Abteilungsleitung" → "Abteilungsleitung"
 */
function extractRoleName(roleType: string): string {
  const parts = roleType.split("::");
  return parts[parts.length - 1] ?? roleType;
}

/**
 * Recursively fetch the group tree from Hitobito starting at the given root group.
 * For each group, fetches roles and resolves person details.
 *
 * @param client - Hitobito API client
 * @param rootGroupId - The group ID to start from
 * @param maxDepth - Maximum depth to traverse (1 = root only)
 */
export async function fetchOrganigramm(
  client: HitobitoClient,
  rootGroupId: number,
  maxDepth: number = 5
): Promise<OrganigrammNode> {
  // Phase 1: Build group tree (BFS by level)
  const rootGroup = await client.getGroup(rootGroupId);
  const groupMap = new Map<number, Group>();
  const childrenMap = new Map<number, number[]>();
  groupMap.set(rootGroup.id, rootGroup);
  childrenMap.set(rootGroup.id, []);

  let currentLevel = [rootGroup.id];
  let depth = 1;

  while (currentLevel.length > 0 && depth < maxDepth) {
    const nextLevel: number[] = [];

    // Fetch children for all groups at this level in parallel
    const childFetches = currentLevel.map(
      (parentId) => () =>
        client
          .getGroups({ filter: { parent_id: parentId } })
          .catch(() => [] as Group[])
    );
    const childResults = await parallelLimit(childFetches, CONCURRENCY_LIMIT);

    for (let i = 0; i < currentLevel.length; i++) {
      const parentId = currentLevel[i];
      const children = childResults[i] ?? [];

      for (const child of children) {
        groupMap.set(child.id, child);
        childrenMap.set(child.id, []);
        const parentChildren = childrenMap.get(parentId);
        if (parentChildren) {
          parentChildren.push(child.id);
        }
        nextLevel.push(child.id);
      }
    }

    currentLevel = nextLevel;
    depth++;
  }

  // Phase 2: Fetch roles for all groups in parallel
  const allGroupIds = [...groupMap.keys()];
  const roleFetches = allGroupIds.map(
    (groupId) => () =>
      client
        .getRoles({ filter: { group_id: groupId } })
        .catch(() => [] as Role[])
  );
  const roleResults = await parallelLimit(roleFetches, CONCURRENCY_LIMIT);

  // Map group ID → roles
  const groupRolesMap = new Map<number, Role[]>();
  for (let i = 0; i < allGroupIds.length; i++) {
    const roles = (roleResults[i] ?? []).filter((r) => !r.deleted_at);
    groupRolesMap.set(allGroupIds[i], roles);
  }

  // Phase 3: Collect unique person IDs and fetch their details
  const personIds = new Set<number>();
  for (const roles of groupRolesMap.values()) {
    for (const role of roles) {
      if (role.person_id) {
        personIds.add(role.person_id);
      }
    }
  }

  const personIdArray = [...personIds];
  const personFetches = personIdArray.map(
    (id) => () =>
      client.getPerson(id).catch(() => null as Person | null)
  );
  const personResults = await parallelLimit(personFetches, CONCURRENCY_LIMIT);

  const personMap = new Map<number, Person>();
  for (let i = 0; i < personIdArray.length; i++) {
    const person = personResults[i];
    if (person) {
      personMap.set(person.id, person);
    }
  }

  // Phase 4: Assemble the tree
  function buildNode(groupId: number): OrganigrammNode {
    const group = groupMap.get(groupId)!;
    const roles = groupRolesMap.get(groupId) ?? [];
    const childIds = childrenMap.get(groupId) ?? [];

    // Build members list from roles
    const members: OrganigrammMember[] = [];
    const seenPersonIds = new Set<number>();

    for (const role of roles) {
      // Skip duplicates (same person might have multiple roles in same group)
      // Keep first occurrence (typically the most relevant role)
      if (seenPersonIds.has(role.person_id)) continue;
      seenPersonIds.add(role.person_id);

      const person = personMap.get(role.person_id);
      if (!person) continue;

      members.push({
        id: person.id,
        firstName: person.first_name,
        lastName: person.last_name,
        nickname: person.nickname,
        role: role.type,
        roleName: role.name ?? extractRoleName(role.type),
        picture: person.picture,
      });
    }

    return {
      group: {
        id: group.id,
        name: group.name,
        shortName: group.short_name,
        type: group.type,
      },
      members,
      children: childIds.map(buildNode),
    };
  }

  return buildNode(rootGroupId);
}
