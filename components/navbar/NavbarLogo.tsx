import type { FileSelection } from "@lib/storage/file-record";
import Image from "next/image";

type NavbarLogoProps = {
  logo: FileSelection;
};

export function NavbarLogo({ logo }: NavbarLogoProps) {
  return (
    <a href="/" className="block rounded-full overflow-hidden w-full h-full">
      <Image
        src={logo.url}
        alt="Logo"
        fill
        className="object-cover"
      />
    </a>
  );
}
