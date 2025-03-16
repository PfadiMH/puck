import { StaticImage } from "@components/misc/StaticImage";

type NavbarLogoProps = {
  logo: string;
};

export function NavbarLogo({ logo }: NavbarLogoProps) {
  return (
    <a href="/" className="block rounded-full overflow-hidden w-full h-full">
      <StaticImage path={logo} title="logo" />
    </a>
  );
}
