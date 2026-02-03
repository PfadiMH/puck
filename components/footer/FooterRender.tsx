import { footerConfig, FooterData } from "@lib/config/footer.config";
import { Theme } from "@lib/section-theming";
import { Render } from "@puckeditor/core";

type FooterRenderProps = {
  data: FooterData;
  theme: Theme;
};

export function FooterRender({ data, theme }: FooterRenderProps) {
  const themeClass = theme === "sun" ? "sun-theme" : "mud-theme";

  return (
    <footer className={`${themeClass} bg-ground text-contrast-ground`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Render config={footerConfig} data={data} />
      </div>
    </footer>
  );
}
