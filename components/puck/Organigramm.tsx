import type { ComponentConfig } from "@puckeditor/core";
import { OrganigrammClient } from "./OrganigrammClient";

export type OrganigrammProps = {
  rootGroupId: number;
  excludedRoles: string;
  maxDepth: number;
  maxVisibleMembers: number;
  showPictures: boolean;
};

function Organigramm({
  rootGroupId,
  excludedRoles,
  maxDepth,
  maxVisibleMembers,
  showPictures,
}: OrganigrammProps) {
  return (
    <OrganigrammClient
      rootGroupId={rootGroupId}
      excludedRoles={excludedRoles}
      maxDepth={maxDepth}
      maxVisibleMembers={maxVisibleMembers}
      showPictures={showPictures}
    />
  );
}

export const organigrammConfig: ComponentConfig<OrganigrammProps> = {
  label: "Organigramm",
  render: Organigramm,
  defaultProps: {
    rootGroupId: 0,
    excludedRoles: "",
    maxDepth: 3,
    maxVisibleMembers: 4,
    showPictures: true,
  },
  fields: {
    rootGroupId: {
      type: "number",
      label: "Hitobito Gruppen-ID",
      min: 1,
    },
    excludedRoles: {
      type: "textarea",
      label: "Ausgeschlossene Rollen",
    },
    maxDepth: {
      type: "select",
      label: "Maximale Tiefe",
      options: [
        { label: "1 Ebene", value: 1 },
        { label: "2 Ebenen", value: 2 },
        { label: "3 Ebenen", value: 3 },
        { label: "4 Ebenen", value: 4 },
        { label: "5 Ebenen", value: 5 },
      ],
    },
    maxVisibleMembers: {
      type: "select",
      label: "Sichtbare Mitglieder",
      options: [
        { label: "3", value: 3 },
        { label: "4", value: 4 },
        { label: "5", value: 5 },
        { label: "6", value: 6 },
        { label: "8", value: 8 },
        { label: "Alle", value: 99 },
      ],
    },
    showPictures: {
      type: "radio",
      label: "Profilbilder anzeigen",
      options: [
        { label: "Ja", value: true },
        { label: "Nein", value: false },
      ],
    },
  },
};
