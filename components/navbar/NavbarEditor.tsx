"use client";
import OtherHeaderActions from "@components/puck-overrides/OtherHeaderActions";
import PuckHeader from "@components/puck-overrides/PuckHeader";
import {
  NavbarConfig,
  navbarConfig,
  NavbarData,
} from "@lib/config/navbar.config";
import { saveNavbar } from "@lib/db/database";
import { Puck } from "@measured/puck";

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
