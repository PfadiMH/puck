"use client";
import OtherHeaderActions from "@components/puck-overrides/OtherHeaderActions";
import PuckHeader from "@components/puck-overrides/PuckHeader";
import {
  FooterConfig,
  footerConfig,
  FooterData,
} from "@lib/config/footer.config";
import { saveFooter } from "@lib/db/db-actions";
import { Puck } from "@measured/puck";
import "@measured/puck/puck.css";

export function FooterEditor({ data }: { data: FooterData }) {
  return (
    <Puck
      config={footerConfig}
      data={data}
      overrides={{
        header: () => (
          <PuckHeader
            headerTitle="Editing Navbar"
            headerActions={
              <OtherHeaderActions<FooterConfig> saveData={saveFooter} />
            }
          />
        ),
      }}
    />
  );
}
