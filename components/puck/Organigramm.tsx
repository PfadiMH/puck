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
  label: "Org Chart",
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
      label: "MiData Group ID",
      min: 1,
    },
    excludedRoles: {
      type: "textarea",
      label: "Excluded Roles",
    },
    maxDepth: {
      type: "select",
      label: "Max Depth",
      options: [
        { label: "1 Level", value: 1 },
        { label: "2 Levels", value: 2 },
        { label: "3 Levels", value: 3 },
        { label: "4 Levels", value: 4 },
        { label: "5 Levels", value: 5 },
      ],
    },
    maxVisibleMembers: {
      type: "select",
      label: "Visible Members",
      options: [
        { label: "3", value: 3 },
        { label: "4", value: 4 },
        { label: "5", value: 5 },
        { label: "6", value: 6 },
        { label: "8", value: 8 },
        { label: "All", value: 99 },
      ],
    },
    showPictures: {
      type: "radio",
      label: "Show Profile Pictures",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
  },
};
