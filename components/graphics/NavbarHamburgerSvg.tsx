interface NavbarHamburgerSvgProps {
  open: boolean;
}

export function NavbarHamburgerSvg({ open }: NavbarHamburgerSvgProps) {
  return (
    <div className="block w-5 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <span
        aria-hidden="true"
        className={`block absolute h-0.5 w-5 bg-black transform transition duration-500 ease-in-out ${
          open ? "rotate-45" : "-translate-y-1.5"
        }`}
      ></span>
      <span
        aria-hidden="true"
        className={`block absolute h-0.5 w-5 bg-black transform transition duration-500 ease-in-out ${
          open ? "opacity-0" : ""
        }`}
      ></span>
      <span
        aria-hidden="true"
        className={`block absolute h-0.5 w-5 bg-black transform transition duration-500 ease-in-out ${
          open ? "-rotate-45" : "translate-y-1.5"
        }`}
      ></span>
    </div>
  );
}
