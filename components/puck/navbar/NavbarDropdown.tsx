import { NavbarDropdownDesktop } from "@components/navbar/NavbarDropdownDesktop";
import { NavbarDropdownMobile } from "@components/navbar/NavbarDropdownMobile";
import { ComponentConfig, WithPuckProps } from "@puckeditor/core";

export interface NavbarDropdownItem {
  label: string;
  url?: string;
  groups_with?: string;
}
export interface NavbarDropdownProps {
  title: string;
  items: NavbarDropdownItem[];
  editMode?: boolean;
}

export function NavbarDropdown({
  title,
  items,
  editMode = false,
  ...props
}: WithPuckProps<NavbarDropdownProps>) {
  if (!items) {
    if (editMode) {
      return (
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-rockingsoda">Empty Dropdown</div>
          <div className="text-lg">Add items to this dropdown</div>
        </div>
      );
    }
    return <></>;
  }
  const groupedItems = itemsToGroupedItems(items);

  if (editMode) {
    return (
      <NavbarDropdownMobile
        label={title}
        groupedItems={groupedItems}
        editMode={editMode}
      />
    );
  }

  return (
    <>
      <div className="md:hidden flex flex-col gap-1">
        <NavbarDropdownMobile label={title} groupedItems={groupedItems} />
      </div>
      <div className="hidden md:block">
        <NavbarDropdownDesktop label={title} groupedItems={groupedItems} />
      </div>
    </>
  );
}
export type NavbarDropdownGroupedProps = {
  label: string;
  groupedItems: NavbarDropdownItem[][];
};

function itemsToGroupedItems(items: NavbarDropdownItem[]) {
  return items.reduce((groups, item) => {
    if (
      groups.length === 0 ||
      groups[groups.length - 1][0].groups_with !== item.groups_with
    ) {
      groups.push([item]);
    } else {
      groups[groups.length - 1].push(item);
    }
    return groups;
  }, [] as NavbarDropdownItem[][]);
}

export const navbarDropdownConfig: ComponentConfig<NavbarDropdownProps> = {
  render: NavbarDropdown,
  fields: {
    title: {
      type: "text",
    },
    items: {
      type: "array",
      getItemSummary: (item) => item.label || "Empty Item",
      arrayFields: {
        label: {
          type: "text",
        },
        url: {
          type: "text",
        },
        groups_with: {
          type: "text",
        },
      },
    },
  },
  defaultProps: {
    title: "Dropdown",
    items: [],
  },
};
