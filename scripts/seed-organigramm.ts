/**
 * Seed script: inserts a mock Organigramm tree into the hitobito-cache
 * MongoDB collection so the component can be tested without real Hitobito access.
 *
 * Based on the real Pfadi Meilen Herrliberg org chart structure:
 *   L1: Abteilungsleitung (Arwen, Canyella, Maui)
 *   L2: Wolfsstufe (Rikki-Tikki-Tavi), Pfadistufe, Piostufe
 *   L3: Meuten / Trupps / Equipes
 *   L4: Gruppenleitung (Fähnli / Patrouille level)
 *
 * Usage:
 *   bun run scripts/seed-organigramm.ts
 *
 * Requires MongoDB to be running (docker compose up -d).
 */

import { MongoClient } from "mongodb";

const CONNECTION_STRING =
  process.env.MONGODB_CONNECTION_STRING ??
  "mongodb://root:example@localhost:27017";
const DB_NAME = process.env.MONGODB_DB_NAME ?? "pfadimh-db";
const COLLECTION = "hitobito-cache";
const ROOT_GROUP_ID = 1234;

const pic = (seed: string) =>
  `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;

function m(
  id: number,
  firstName: string,
  lastName: string,
  nickname: string | null,
  role: string,
  roleName: string,
  hasPic: boolean
) {
  return {
    id,
    firstName,
    lastName,
    nickname,
    role,
    roleName,
    picture: hasPic ? pic(`${firstName.toLowerCase()}-${id}`) : null,
  };
}

const mockTree = {
  rootGroupId: ROOT_GROUP_ID,
  fetchedAt: new Date(),
  data: {
    // ═══════════════════════════════════════════════════════════
    // L1 — Abteilungsleitung
    // ═══════════════════════════════════════════════════════════
    group: {
      id: ROOT_GROUP_ID,
      name: "Pfadi Meilen Herrliberg",
      shortName: "Pfadi MH",
      type: "Group::Abteilung",
    },
    members: [
      m(1, "Lena", "Baumann", "Arwen", "Group::Abteilung::Abteilungsleitung", "Abteilungsleitung", true),
      m(2, "Silvio", "Meier", "Canyella", "Group::Abteilung::Abteilungsleitung", "Abteilungsleitung", true),
      m(3, "Florian", "Loew", "Maui", "Group::Abteilung::Abteilungsleitung", "Abteilungsleitung", true),
      m(99, "System", "Admin", null, "Group::Abteilung::PowerUser", "PowerUser", false),
    ],
    children: [
      // ═══════════════════════════════════════════════════════════
      // L2 — Wolfsstufe (Rikki-Tikki-Tavi)
      // ═══════════════════════════════════════════════════════════
      {
        group: { id: 2001, name: "Wolfsstufe", shortName: "Rikki-Tikki-Tavi", type: "Group::Woelfe" },
        members: [
          m(10, "Nina", "Roth", "Achaya", "Group::Woelfe::Stufenleitung", "Stufenleitung", true),
          m(11, "Sophie", "Mueller", "Peppina", "Group::Woelfe::Stufenleitung", "Stufenleitung", true),
          m(20, "Elena", "Gerber", "Zafia", "Group::Woelfe::Stufenleitung", "Stufenleitung", true),
          m(21, "Laura", "Brunner", "Zelia", "Group::Woelfe::Stufenleitung", "Stufenleitung", false),
        ],
        children: [
          // ─── L3 — Bienli (Meute Raschka) ───
          {
            group: { id: 3001, name: "Bienli", shortName: "Meute Raschka", type: "Group::Woelfe::Meute" },
            members: [
              m(10, "Nina", "Roth", "Achaya", "Group::Woelfe::Meute::Stufenleitung", "Stufenleitung", true),
              m(11, "Sophie", "Mueller", "Peppina", "Group::Woelfe::Meute::Stufenleitung", "Stufenleitung", true),
            ],
            children: [
              // ─── L4 — Bienli Gruppenleitung ───
              {
                group: { id: 4001, name: "Fähnli Raschka", shortName: null, type: "Group::Woelfe::Fahnli" },
                members: [
                  m(12, "Anna", "Keller", "Moana", "Group::Woelfe::Fahnli::Leitung", "Gruppenleitung", true),
                  m(13, "Lara", "Fischer", "Ayeli", "Group::Woelfe::Fahnli::Leitung", "Gruppenleitung", false),
                  m(14, "Marco", "Huber", "Elua", "Group::Woelfe::Fahnli::Leitung", "Gruppenleitung", true),
                ],
                children: [],
              },
            ],
          },
          // ─── L3 — Wölfli (Meute Akela) ───
          {
            group: { id: 3002, name: "Wölfli", shortName: "Meute Akela", type: "Group::Woelfe::Meute" },
            members: [
              m(20, "Elena", "Gerber", "Zafia", "Group::Woelfe::Meute::Stufenleitung", "Stufenleitung", true),
              m(21, "Laura", "Brunner", "Zelia", "Group::Woelfe::Meute::Stufenleitung", "Stufenleitung", false),
            ],
            children: [
              // ─── L4 — Wölfli Gruppenleitung ───
              {
                group: { id: 4002, name: "Fähnli Akela", shortName: null, type: "Group::Woelfe::Fahnli" },
                members: [
                  m(22, "Tim", "Schmid", "Artus", "Group::Woelfe::Fahnli::Leitung", "Gruppenleitung", false),
                  m(23, "Jonas", "Steiner", "Salero", "Group::Woelfe::Fahnli::Leitung", "Gruppenleitung", true),
                  m(24, "Lena", "Widmer", "Pachica", "Group::Woelfe::Fahnli::Leitung", "Gruppenleitung", true),
                  m(25, "Nora", "Frei", "Malea", "Group::Woelfe::Fahnli::Leitung", "Gruppenleitung", false),
                ],
                children: [],
              },
            ],
          },
        ],
      },

      // ═══════════════════════════════════════════════════════════
      // L2 — Pfadistufe
      // ═══════════════════════════════════════════════════════════
      {
        group: { id: 2002, name: "Pfadistufe", shortName: "Pfadi", type: "Group::Pfadi" },
        members: [
          m(30, "David", "Graf", "Baski", "Group::Pfadi::Stufenleitung", "Stufenleitung", true),
          m(31, "Sarah", "Bieri", "Salita", "Group::Pfadi::Stufenleitung", "Stufenleitung", true),
          m(40, "Robin", "Hartmann", "Maeva", "Group::Pfadi::Stufenleitung", "Stufenleitung", true),
          m(41, "Julia", "Lang", "Nepomuk", "Group::Pfadi::Stufenleitung", "Stufenleitung", false),
        ],
        children: [
          // ─── L3 — Atlantik-Karibik ───
          {
            group: { id: 3003, name: "Atlantik-Karibik", shortName: null, type: "Group::Pfadi::Trupp" },
            members: [
              m(30, "David", "Graf", "Baski", "Group::Pfadi::Trupp::Stufenleitung", "Stufenleitung", true),
              m(31, "Sarah", "Bieri", "Salita", "Group::Pfadi::Trupp::Stufenleitung", "Stufenleitung", true),
            ],
            children: [
              // ─── L4 — Ashera (sub-group of Atlantik-Karibik) ───
              {
                group: { id: 4003, name: "Ashera", shortName: null, type: "Group::Pfadi::Patrouille" },
                members: [
                  m(32, "Fabian", "Kunz", "Chippa", "Group::Pfadi::Patrouille::Leitung", "Gruppenleitung", true),
                  m(33, "Mia", "Gerber", "Maymana", "Group::Pfadi::Patrouille::Leitung", "Gruppenleitung", false),
                  m(34, "Noah", "Ammann", "Arisca", "Group::Pfadi::Patrouille::Leitung", "Gruppenleitung", true),
                  m(35, "Lea", "Moser", "Calima", "Group::Pfadi::Patrouille::Leitung", "Gruppenleitung", false),
                  m(36, "Jan", "Ritter", "Malinka", "Group::Pfadi::Patrouille::Leitung", "Gruppenleitung", true),
                ],
                children: [],
              },
            ],
          },
          // ─── L3 — OFI ───
          {
            group: { id: 3004, name: "OFI", shortName: null, type: "Group::Pfadi::Trupp" },
            members: [
              m(40, "Robin", "Hartmann", "Maeva", "Group::Pfadi::Trupp::Stufenleitung", "Stufenleitung", true),
              m(41, "Julia", "Lang", "Nepomuk", "Group::Pfadi::Trupp::Stufenleitung", "Stufenleitung", false),
            ],
            children: [
              // ─── L4 — OFI Gruppenleitung ───
              {
                group: { id: 4004, name: "Patrouille OFI", shortName: null, type: "Group::Pfadi::Patrouille" },
                members: [
                  m(42, "Nico", "Pfister", "Rajah", "Group::Pfadi::Patrouille::Leitung", "Gruppenleitung", true),
                  m(43, "Amelie", "Berger", "Bachuja", "Group::Pfadi::Patrouille::Leitung", "Gruppenleitung", true),
                  m(44, "Andrin", "Bucher", "Leonidas", "Group::Pfadi::Patrouille::Leitung", "Gruppenleitung", false),
                  m(45, "Clara", "Suter", "Thor", "Group::Pfadi::Patrouille::Leitung", "Gruppenleitung", true),
                  m(46, "Dario", "Meier", "Pyro", "Group::Pfadi::Patrouille::Leitung", "Gruppenleitung", false),
                  m(47, "Eva", "Schmid", "Battino", "Group::Pfadi::Patrouille::Leitung", "Gruppenleitung", true),
                ],
                children: [],
              },
            ],
          },
        ],
      },

      // ═══════════════════════════════════════════════════════════
      // L2 — Piostufe
      // ═══════════════════════════════════════════════════════════
      {
        group: { id: 2003, name: "Piostufe", shortName: "Pio", type: "Group::Pio" },
        members: [
          m(50, "Patrick", "Wyss", "Maui", "Group::Pio::Stufenleitung", "Stufenleitung", true),
        ],
        children: [
          // ─── L3 — Makena ───
          {
            group: { id: 3005, name: "Makena", shortName: null, type: "Group::Pio::Equipe" },
            members: [
              m(50, "Patrick", "Wyss", "Maui", "Group::Pio::Equipe::Stufenleitung", "Stufenleitung", true),
            ],
            children: [
              // ─── L4 — Makena Gruppenleitung ───
              {
                group: { id: 4005, name: "Equipe Makena", shortName: null, type: "Group::Pio::Equipe::Gruppe" },
                members: [
                  m(51, "Carla", "Stocker", "Salita", "Group::Pio::Equipe::Leitung", "Gruppenleitung", true),
                  m(52, "Lars", "Engel", "Twist", "Group::Pio::Equipe::Leitung", "Gruppenleitung", false),
                ],
                children: [],
              },
            ],
          },
        ],
      },
    ],
  },
};

// ─── Helpers ────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyNode = { members: any[]; children: AnyNode[] };

function countNodes(node: AnyNode): number {
  return 1 + node.children.reduce((sum, c) => sum + countNodes(c), 0);
}

function countMembers(node: AnyNode): number {
  return (
    node.members.length +
    node.children.reduce((sum, c) => sum + countMembers(c), 0)
  );
}

function maxDepth(node: AnyNode, depth = 1): number {
  if (node.children.length === 0) return depth;
  return Math.max(...node.children.map((c) => maxDepth(c, depth + 1)));
}

// ─── Seed ───────────────────────────────────────────────────────

async function seed() {
  const client = new MongoClient(CONNECTION_STRING);
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION);

    await collection.updateOne(
      { rootGroupId: ROOT_GROUP_ID },
      { $set: mockTree },
      { upsert: true }
    );

    const groups = countNodes(mockTree.data);
    const members = countMembers(mockTree.data);
    const depth = maxDepth(mockTree.data);

    console.log(
      `Seeded Organigramm cache for group ${ROOT_GROUP_ID} ("${mockTree.data.group.name}")`
    );
    console.log(`  - ${groups} groups across ${depth} layers`);
    console.log(`  - ${members} total members`);
    console.log(`  - ${mockTree.data.children.length} direct child groups`);
    console.log(`\nUse group ID ${ROOT_GROUP_ID} in the Organigramm component.`);
    console.log(`To test role exclusion, add "PowerUser" to the excluded roles field.`);
  } finally {
    await client.close();
  }
}

seed().catch(console.error);
