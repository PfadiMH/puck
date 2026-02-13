import { footerConfig, FooterData } from "@lib/config/footer.config";
import { Render } from "@puckeditor/core";

type FooterRenderProps = {
  data: FooterData;
};

export function FooterRender({ data }: FooterRenderProps) {
  return (
    <footer className="mud-theme bg-ground text-contrast-ground">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Render config={footerConfig} data={data} />
      </div>
    </footer>
  );
}
