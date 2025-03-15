import Image from "next/image";

export interface ImageComponentProps {
  path: string;
  title: string;
}

export function StaticImage({ path, title }: ImageComponentProps) {
  return (
    <Image
      src={path}
      alt={title}
      fill={true}
      className="object-cover !static"
    />
  );
}
