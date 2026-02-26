import type { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OrganigrammClient } from "./OrganigrammClient";

const pic = (seed: string) =>
  `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;

function mb(
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

/**
 * Realistic mock data matching the Pfadi Meilen Herrliberg org chart:
 *   L1: Abteilungsleitung (Arwen, Canyella, Maui)
 *   L2: Wolfsstufe, Pfadistufe, Piostufe
 *   L3: Meuten / Trupps with Stufenleitung
 *   L4: Gruppenleitung
 */
const mockOrganigrammData = {
  data: {
    group: {
      id: 1234,
      name: "Pfadi Meilen Herrliberg",
      shortName: "Pfadi MH",
      type: "Group::Abteilung",
    },
    members: [
      mb(1, "Lena", "Baumann", "Arwen", "Group::Abteilung::Abteilungsleitung", "Abteilungsleitung", true),
      mb(2, "Silvio", "Meier", "Canyella", "Group::Abteilung::Abteilungsleitung", "Abteilungsleitung", true),
      mb(3, "Florian", "Loew", "Maui", "Group::Abteilung::Abteilungsleitung", "Abteilungsleitung", true),
      mb(99, "System", "Admin", null, "Group::Abteilung::PowerUser", "PowerUser", false),
    ],
    children: [
      // Wolfsstufe (Rikki-Tikki-Tavi)
      {
        group: { id: 2001, name: "Wolfsstufe", shortName: "Rikki-Tikki-Tavi", type: "Group::Woelfe" },
        members: [
          mb(10, "Nina", "Roth", "Achaya", "Group::Woelfe::Stufenleitung", "Stufenleitung", true),
          mb(11, "Sophie", "Mueller", "Peppina", "Group::Woelfe::Stufenleitung", "Stufenleitung", true),
          mb(20, "Elena", "Gerber", "Zafia", "Group::Woelfe::Stufenleitung", "Stufenleitung", true),
          mb(21, "Laura", "Brunner", "Zelia", "Group::Woelfe::Stufenleitung", "Stufenleitung", false),
        ],
        children: [
          {
            group: { id: 3001, name: "Bienli", shortName: "Meute Raschka", type: "Group::Woelfe::Meute" },
            members: [
              mb(10, "Nina", "Roth", "Achaya", "Group::Woelfe::Meute::Stufenleitung", "Stufenleitung", true),
              mb(11, "Sophie", "Mueller", "Peppina", "Group::Woelfe::Meute::Stufenleitung", "Stufenleitung", true),
            ],
            children: [
              {
                group: { id: 4001, name: "Fähnli Raschka", shortName: null, type: "Group::Woelfe::Fahnli" },
                members: [
                  mb(12, "Anna", "Keller", "Moana", "Group::Woelfe::Fahnli::Leitung", "Gruppenleitung", true),
                  mb(13, "Lara", "Fischer", "Ayeli", "Group::Woelfe::Fahnli::Leitung", "Gruppenleitung", false),
                  mb(14, "Marco", "Huber", "Elua", "Group::Woelfe::Fahnli::Leitung", "Gruppenleitung", true),
                ],
                children: [],
              },
            ],
          },
          {
            group: { id: 3002, name: "Wölfli", shortName: "Meute Akela", type: "Group::Woelfe::Meute" },
            members: [
              mb(20, "Elena", "Gerber", "Zafia", "Group::Woelfe::Meute::Stufenleitung", "Stufenleitung", true),
              mb(21, "Laura", "Brunner", "Zelia", "Group::Woelfe::Meute::Stufenleitung", "Stufenleitung", false),
            ],
            children: [
              {
                group: { id: 4002, name: "Fähnli Akela", shortName: null, type: "Group::Woelfe::Fahnli" },
                members: [
                  mb(22, "Tim", "Schmid", "Artus", "Group::Woelfe::Fahnli::Leitung", "Gruppenleitung", false),
                  mb(23, "Jonas", "Steiner", "Salero", "Group::Woelfe::Fahnli::Leitung", "Gruppenleitung", true),
                  mb(24, "Lena", "Widmer", "Pachica", "Group::Woelfe::Fahnli::Leitung", "Gruppenleitung", true),
                  mb(25, "Nora", "Frei", "Malea", "Group::Woelfe::Fahnli::Leitung", "Gruppenleitung", false),
                ],
                children: [],
              },
            ],
          },
        ],
      },
      // Pfadistufe
      {
        group: { id: 2002, name: "Pfadistufe", shortName: "Pfadi", type: "Group::Pfadi" },
        members: [
          mb(30, "David", "Graf", "Baski", "Group::Pfadi::Stufenleitung", "Stufenleitung", true),
          mb(31, "Sarah", "Bieri", "Salita", "Group::Pfadi::Stufenleitung", "Stufenleitung", true),
          mb(40, "Robin", "Hartmann", "Maeva", "Group::Pfadi::Stufenleitung", "Stufenleitung", true),
          mb(41, "Julia", "Lang", "Nepomuk", "Group::Pfadi::Stufenleitung", "Stufenleitung", false),
        ],
        children: [
          {
            group: { id: 3003, name: "Atlantik-Karibik", shortName: null, type: "Group::Pfadi::Trupp" },
            members: [
              mb(30, "David", "Graf", "Baski", "Group::Pfadi::Trupp::Stufenleitung", "Stufenleitung", true),
              mb(31, "Sarah", "Bieri", "Salita", "Group::Pfadi::Trupp::Stufenleitung", "Stufenleitung", true),
            ],
            children: [
              {
                group: { id: 4003, name: "Ashera", shortName: null, type: "Group::Pfadi::Patrouille" },
                members: [
                  mb(32, "Fabian", "Kunz", "Chippa", "Group::Pfadi::Patrouille::Leitung", "Gruppenleitung", true),
                  mb(33, "Mia", "Gerber", "Maymana", "Group::Pfadi::Patrouille::Leitung", "Gruppenleitung", false),
                  mb(34, "Noah", "Ammann", "Arisca", "Group::Pfadi::Patrouille::Leitung", "Gruppenleitung", true),
                  mb(35, "Lea", "Moser", "Calima", "Group::Pfadi::Patrouille::Leitung", "Gruppenleitung", false),
                  mb(36, "Jan", "Ritter", "Malinka", "Group::Pfadi::Patrouille::Leitung", "Gruppenleitung", true),
                ],
                children: [],
              },
            ],
          },
          {
            group: { id: 3004, name: "OFI", shortName: null, type: "Group::Pfadi::Trupp" },
            members: [
              mb(40, "Robin", "Hartmann", "Maeva", "Group::Pfadi::Trupp::Stufenleitung", "Stufenleitung", true),
              mb(41, "Julia", "Lang", "Nepomuk", "Group::Pfadi::Trupp::Stufenleitung", "Stufenleitung", false),
            ],
            children: [
              {
                group: { id: 4004, name: "Patrouille OFI", shortName: null, type: "Group::Pfadi::Patrouille" },
                members: [
                  mb(42, "Nico", "Pfister", "Rajah", "Group::Pfadi::Patrouille::Leitung", "Gruppenleitung", true),
                  mb(43, "Amelie", "Berger", "Bachuja", "Group::Pfadi::Patrouille::Leitung", "Gruppenleitung", true),
                  mb(44, "Andrin", "Bucher", "Leonidas", "Group::Pfadi::Patrouille::Leitung", "Gruppenleitung", false),
                  mb(45, "Clara", "Suter", "Thor", "Group::Pfadi::Patrouille::Leitung", "Gruppenleitung", true),
                  mb(46, "Dario", "Meier", "Pyro", "Group::Pfadi::Patrouille::Leitung", "Gruppenleitung", false),
                  mb(47, "Eva", "Schmid", "Battino", "Group::Pfadi::Patrouille::Leitung", "Gruppenleitung", true),
                ],
                children: [],
              },
            ],
          },
        ],
      },
      // Piostufe
      {
        group: { id: 2003, name: "Piostufe", shortName: "Pio", type: "Group::Pio" },
        members: [
          mb(50, "Patrick", "Wyss", "Maui", "Group::Pio::Stufenleitung", "Stufenleitung", true),
        ],
        children: [
          {
            group: { id: 3005, name: "Makena", shortName: null, type: "Group::Pio::Equipe" },
            members: [
              mb(50, "Patrick", "Wyss", "Maui", "Group::Pio::Equipe::Stufenleitung", "Stufenleitung", true),
            ],
            children: [
              {
                group: { id: 4005, name: "Equipe Makena", shortName: null, type: "Group::Pio::Equipe::Gruppe" },
                members: [
                  mb(51, "Carla", "Stocker", "Salita", "Group::Pio::Equipe::Leitung", "Gruppenleitung", true),
                  mb(52, "Lars", "Engel", "Twist", "Group::Pio::Equipe::Leitung", "Gruppenleitung", false),
                ],
                children: [],
              },
            ],
          },
        ],
      },
    ],
  },
  stale: false,
  fetchedAt: new Date().toISOString(),
};

// Mock fetch so useQuery resolves with mock data
const createMockFetchDecorator = () => {
  const originalFetch = globalThis.fetch;

  return (Story: React.ComponentType) => {
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === "string" ? input : input.toString();
      if (url.includes("/api/organigramm")) {
        return new Response(JSON.stringify(mockOrganigrammData), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      return originalFetch(input, init);
    };

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, staleTime: Infinity },
      },
    });

    return (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    );
  };
};

const meta: Meta<typeof OrganigrammClient> = {
  component: OrganigrammClient,
  title: "Puck/Organigramm",
  decorators: [createMockFetchDecorator()],
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof OrganigrammClient>;

export const Default: Story = {
  args: {
    rootGroupId: 1234,
    excludedRoles: "",
    maxDepth: 3,
    maxVisibleMembers: 4,
    showPictures: true,
  },
};

export const WithExcludedRoles: Story = {
  args: {
    rootGroupId: 1234,
    excludedRoles: "PowerUser",
    maxDepth: 3,
    maxVisibleMembers: 4,
    showPictures: true,
  },
};

export const NoPictures: Story = {
  args: {
    rootGroupId: 1234,
    excludedRoles: "",
    maxDepth: 3,
    maxVisibleMembers: 4,
    showPictures: false,
  },
};

export const SmallOverflow: Story = {
  name: "Max 3 Visible (more overflow)",
  args: {
    rootGroupId: 1234,
    excludedRoles: "",
    maxDepth: 3,
    maxVisibleMembers: 3,
    showPictures: true,
  },
};

export const ShowAll: Story = {
  name: "Show All Members",
  args: {
    rootGroupId: 1234,
    excludedRoles: "",
    maxDepth: 3,
    maxVisibleMembers: 99,
    showPictures: true,
  },
};

export const NotConfigured: Story = {
  name: "Not Configured (groupId = 0)",
  args: {
    rootGroupId: 0,
    excludedRoles: "",
    maxDepth: 3,
    maxVisibleMembers: 4,
    showPictures: true,
  },
};
