import { ComponentConfig } from "@measured/puck";

export type FooterLinkGroupProps = {
  heading: string;
  links: { label: string; url: string }[];
};

export function FooterLinkGroup({ heading, links }: FooterLinkGroupProps) {
  const hasLinks = links && links.length > 0 && links.some((l) => l.label);

  return (
    <div>
      <h3 className="font-semibold text-contrast-ground mb-3">{heading}</h3>
      {hasLinks && (
        <ul className="space-y-2">
          {links
            .filter((l) => l.label)
            .map((link, i) => (
              <li key={i}>
                <a
                  href={link.url || "#"}
                  className="text-contrast-ground/80 hover:text-contrast-ground transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

export const footerLinkGroupConfig: ComponentConfig<FooterLinkGroupProps> = {
  label: "Link-Gruppe",
  render: FooterLinkGroup,
  fields: {
    heading: {
      type: "text",
      label: "Überschrift",
    },
    links: {
      type: "array",
      label: "Links",
      arrayFields: {
        label: {
          type: "text",
          label: "Linktext",
        },
        url: {
          type: "text",
          label: "URL",
        },
      },
      getItemSummary: (item) => item.label || "Neuer Link",
      defaultItemProps: {
        label: "",
        url: "",
      },
    },
  },
  defaultProps: {
    heading: "Links",
    links: [],
  },
};
