import Image from "next/image";

interface StaticImageProps {
  path: string;
  title: string;
}

export function StaticImage({ path, title }: StaticImageProps) {
  return (
    <Image
      src={path}
      alt={title}
      fill={true}
      className="object-cover !static"
    />
  );
}
