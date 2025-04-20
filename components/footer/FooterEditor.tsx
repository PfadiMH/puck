"use client";
import OtherHeaderActions from "@components/puck-overrides/OtherHeaderActions";
import PuckHeader from "@components/puck-overrides/PuckHeader";
import {
  FooterConfig,
  footerConfig,
  FooterData,
} from "@lib/config/footer.config";
import { saveFooter } from "@lib/db/database";
import { Puck } from "@measured/puck";

export function FooterEditor({ data }: { data: FooterData }) {
  const handlePublish = async (data: FooterData) => {
    await saveFooter(data);
  };

  return (
    <Puck
      config={footerConfig}
      data={data}
      overrides={{
        header: () => (
          <PuckHeader
            headerTitle="Editing Navbar"
            headerActions={
              <OtherHeaderActions<FooterConfig> onPublish={handlePublish} />
            }
          />
        ),
      }}
    />
  );
}
