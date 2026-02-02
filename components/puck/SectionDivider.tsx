import { SectionBreak } from "@components/misc/SectionBreak";
import { ComponentConfig } from "@measured/puck";

export type SectionDividerProps = {};

function SectionDivider({}: SectionDividerProps) {
  return (
    <div className="full">
      <SectionBreak />
    </div>
  );
}

export const sectionDividerConfig: ComponentConfig<SectionDividerProps> = {
  render: SectionDivider,
};
