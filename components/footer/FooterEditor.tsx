"use client";
import OtherHeaderActions from "@components/puck-overrides/OtherHeaderActions";
import PuckHeader from "@components/puck-overrides/PuckHeader";
import {
  FooterConfig,
  footerConfig,
  FooterData,
} from "@lib/config/footer.config";
import { saveFooter } from "@lib/db/db-actions";
import { Puck } from "@puckeditor/core";
import "@puckeditor/core/puck.css";

export function FooterEditor({ data }: { data: FooterData }) {
  return (
    <div className="puck-editor-wrapper">
      <Puck
        config={footerConfig}
        data={data}
        overrides={{
          header: () => (
            <PuckHeader
              headerTitle="Editing Footer"
              headerActions={
                <OtherHeaderActions<FooterConfig> saveData={saveFooter} />
              }
            />
          ),
        }}
      />
    </div>
  );
}
