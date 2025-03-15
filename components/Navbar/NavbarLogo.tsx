import { ImageComponent } from "@components/helperComponents/ImageComponent";

type NavbarLogoProps = {
  logo?: string;
};

export function NavbarLogo({ logo }: NavbarLogoProps) {
  if (!logo) return null;

  return (
    <div className="relative z-20 w-28 h-28 mb-[-50px]">
      <a href="/" className="rounded-full">
        <ImageComponent path={logo} title="logo" />
      </a>
    </div>
  );
}
