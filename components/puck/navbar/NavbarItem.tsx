import { ComponentConfig } from "@puckeditor/core";

export type NavbarItemProps = {
  title: string;
  url: string;
  editMode?: boolean;
};

export function NavbarItem({ title, url, editMode }: NavbarItemProps) {
  if (editMode) {
    return <NavbarItemMobile title={title} url={url} />;
  }
  return (
    <>
      <div className="hidden md:block">
        <NavbarItemDesktop title={title} url={url} />
      </div>
      <div className="md:hidden">
        <NavbarItemMobile title={title} url={url} />
      </div>
    </>
  );
}

function NavbarItemDesktop({ title, url }: NavbarItemProps) {
  return (
    <a className="text-black text-2xl font-rockingsoda" href={url || undefined}>
      {title}
    </a>
  );
}

function NavbarItemMobile({ title, url }: NavbarItemProps) {
  return (
    <div className="bg-elevated w-full p-3 flex justify-center">
      <a
        href={url || undefined}
        className="text-brand-yellow text-2xl font-rockingsoda"
      >
        {title}
      </a>
    </div>
  );
}

export const navbarItemConfig: ComponentConfig<NavbarItemProps> = {
  render: NavbarItem,
  fields: {
    title: {
      type: "text",
    },
    url: {
      type: "text",
    },
  },
};
