import clsx from "clsx";
import { SVGProps } from "react";

interface NavbarDropdownArrowProps extends SVGProps<SVGSVGElement> {
  open: boolean;
  className?: string;
  invertRotationDirection?: boolean;
}

export function NavbarDropdownArrowSvg({
  open,
  className = "",
  invertRotationDirection = false,
  ...props
}: NavbarDropdownArrowProps) {
  const rotationString = invertRotationDirection ? "-rotate-180" : "rotate-180";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 95.05 57.43"
      className={clsx(
        "stroke-none w-5 h-5 transform transition duration-250 ease-in-out",
        { [rotationString]: open },
        className
      )}
      {...props}
    >
      <polygon points="0 11.17 39.67 57 84 6.5 73 2.17 42 36.36 9.83 0 0 11.17" />
    </svg>
  );
}
