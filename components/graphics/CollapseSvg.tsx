import cn from "@lib/cn";

type CollapseSvgProps = {
  open: boolean;
};

export function CollapseSvg({ open }: CollapseSvgProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      className={cn(
        "transition duration-250 ease-in-out transform",
        !open && "rotate-180"
      )}
    >
      <path d="m18 15-6-6-6 6"></path>
    </svg>
  );
}
