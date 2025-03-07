import { ComponentConfig } from "@measured/puck";
import { NavbarDropdownDesktop } from "./NavbarDropdownDesktop";
import { NavbarDropdownMobile } from "./NavbarDropdownMobile";

export interface NavbarDropdownItem {
  title: string;
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
  editMode,
}: NavbarDropdownProps) {
  if (!items) {
    if (editMode) {
      return (
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-rockingsoda">Empty Dropdown</div>
          <div className="text-lg">Add items to this dropdown</div>
        </div>
      );
    }
    return null;
  }
  const groupedItems: NavbarDropdownItem[][] = items.reduce((groups, item) => {
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

  if (editMode) {
    return (
      <NavbarDropdownMobile
        title={title}
        groupedItems={groupedItems}
        editMode={true}
      />
    );
  }

  return (
    <>
      <div className="md:hidden flex flex-col gap-1">
        <NavbarDropdownMobile title={title} groupedItems={groupedItems} />
      </div>
      <div className="hidden md:block">
        <NavbarDropdownDesktop title={title} groupedItems={groupedItems} />
      </div>
    </>
  );
}
export type NavbarDropdownGroupedProps = {
  title: string;
  groupedItems: NavbarDropdownItem[][];
};

export const navbarDropdownConfig: ComponentConfig<NavbarDropdownProps> = {
  render: NavbarDropdown,
  fields: {
    title: {
      type: "text",
    },
    items: {
      type: "array",
      getItemSummary: (item) => item.title,
      arrayFields: {
        title: {
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
};
