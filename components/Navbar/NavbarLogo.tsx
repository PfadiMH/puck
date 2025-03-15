import { StaticImage } from "@components/helperComponents/StaticImage";

type NavbarLogoProps = {
  logo?: string;
};

export function NavbarLogo({ logo }: NavbarLogoProps) {
  if (!logo) return null;

  return (
    <div className="relative z-20 w-28 h-28 mb-[-50px]">
      <a href="/" className="block rounded-full overflow-hidden w-full h-full">
        <StaticImage path={logo} title="logo" />
      </a>
    </div>
  );
}
