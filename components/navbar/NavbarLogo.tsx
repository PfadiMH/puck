import type { FileSelection } from "@lib/storage/file-record";
import Image from "next/image";
import Link from "next/link";

type NavbarLogoProps = {
  logo: FileSelection | string;
};

/**
 * Normalizes logo prop to handle both legacy string (base64/URL) and new FileSelection format.
 * This provides backward compatibility with existing navbar data.
 */
function normalizeLogo(logo: FileSelection | string): { url: string; alt: string } {
  if (typeof logo === "string") {
    // Legacy format: string URL or base64
    return { url: logo, alt: "Site logo" };
  }
  // New format: FileSelection object
  return { url: logo.url, alt: logo.filename || "Site logo" };
}

export function NavbarLogo({ logo }: NavbarLogoProps) {
  const { url, alt } = normalizeLogo(logo);
  
  return (
    <Link href="/" className="block rounded-full overflow-hidden w-full h-full">
      <Image
        src={url}
        alt={alt}
        fill
        className="object-cover"
      />
    </Link>
  );
}
