import { StaticImage } from "@components/misc/StaticImage";
import { FileProps } from "@components/puck-fields/fileTable";

type NavbarLogoProps = {
  logo: FileProps;
};

export function NavbarLogo({ logo }: NavbarLogoProps) {
  return (
    <a href="/" className="block rounded-full overflow-hidden w-full h-full">
      <StaticImage path={logo.url || ""} title={logo.name || ""} />
    </a>
  );
}
