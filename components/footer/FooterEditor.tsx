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

/**
 * Renders a Puck editor configured for editing the site's footer.
 *
 * @param data - Initial footer data used to populate the editor
 * @returns A JSX element containing the Puck editor configured with `footerConfig` and a custom header that provides save actions
 */
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