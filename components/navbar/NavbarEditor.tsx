"use client";
import OtherHeaderActions from "@components/puck-overrides/OtherHeaderActions";
import PuckHeader from "@components/puck-overrides/PuckHeader";
import {
  NavbarConfig,
  navbarConfig,
  NavbarData,
} from "@lib/config/navbar.config";
import { saveNavbar } from "@lib/db/db-actions";
import { Puck } from "@measured/puck";
import "@measured/puck/puck.css";

/**
 * Editor component that renders a Puck-based UI for editing navbar data.
 *
 * @param data - The current navbar data used to populate and edit the navbar configuration
 * @returns A JSX element that renders the navbar editor with a customized header and save actions
 */
export function NavbarEditor({ data }: { data: NavbarData }) {
  return (
    <Puck
      config={navbarConfig}
      data={data}
      overrides={{
        header: () => (
          <PuckHeader
            headerTitle="Editing Navbar"
            headerActions={
              <OtherHeaderActions<NavbarConfig> saveData={saveNavbar} />
            }
          />
        ),
      }}
    />
  );
}