import { uploadFile } from "@components/customFields/uploadFile";
import { ComponentConfig } from "@measured/puck";
import Image from "next/image";
import { SVGProps } from "react";

export const PostHeroSvg = (props: SVGProps<SVGSVGElement>) => (
  <svg
    className="w-full"
    viewBox="0 0 1440 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      style={{
        fill: "var(--color-background)",
      }}
      d="m1416.17,95.3c-6.21,1.49 -27.97,6.71 -43.51,5.22c-15.54,-1.48 -41.44,-8.19 -49.73,-8.19c-8.29,0 -33.15,2.98 -41.44,7.45c-8.29,4.47 -27.97,1.49 -27.97,1.49c0,0 -3.11,0 -30.04,5.96c-26.94,5.96 -42.48,20.87 -46.62,24.59c-4.14,3.73 -31.08,5.97 -31.08,5.97c0,0 -18.64,2.98 -25.9,6.7c-7.26,3.73 -39.05,7.57 -39.05,7.57c0,0 -66.61,-10.55 -90.44,-3.84c-23.83,6.71 -46.62,-2.24 -89.09,2.24c-42.48,4.47 -41.44,-1.49 -50.77,-4.47c-9.33,-2.98 -26.94,-1.49 -26.94,-1.49c0,0 -13.46,0.74 -35.21,-10.43c-21.76,-11.18 -53.88,-11.18 -59.05,-11.92c-5.18,-0.75 -14.51,2.24 -19.75,2.24c-5.25,0 -10.3,-3.73 -10.3,-3.73c0,0 -8.29,-2.24 -11.39,0.74c-3.11,2.99 -30.04,2.99 -30.04,2.99c0,0 -26.94,-8.2 -37.3,-5.22c-10.37,2.97 -22.8,-1.49 -25.83,-2.96c-3.03,-1.48 -3.18,-0.77 -19.76,-0.03c-16.58,0.75 -48.69,-18.62 -50.77,-20.86c-2.08,-2.24 -15.54,-8.2 -17.61,-8.2c-2.07,0 -15.54,-2.98 -21.76,-5.96c-6.21,-2.98 -42.47,-2.98 -45.58,-2.98c-3.11,0 -23.83,-2.99 -26.94,-3.73c-3.1,-0.74 -12.43,-0.74 -13.46,-1.49c-1.04,-0.74 -6.21,-3.72 -12.44,-4.47c-6.21,-0.74 -9.32,0.75 -13.46,0.75c-4.15,0 -4.15,-2.24 -5.18,-2.98c-1.04,-0.75 -5.18,-2.24 -11.4,-2.24c-6.22,0 -5.17,2.98 -14.5,4.47c-9.33,1.48 -43.51,-5.22 -43.51,-5.22c0,0 -33.15,-5.22 -45.58,11.17c-12.43,16.4 -43.51,12.68 -43.51,12.68c0,0 -40.41,-18.63 -39.37,-24.6c1.03,-5.96 -7.26,-10.43 -7.26,-10.43c0,0 -9.33,-2.98 -18.64,-13.41c-9.33,-10.44 -22.8,-6.71 -21.76,-11.18c1.03,-4.47 -9.33,-8.2 -10.37,-9.69c-1.03,-1.5 -15.53,-3.73 -20.71,-3.73c-5.18,0 -35.69,-8.21 -35.69,-8.21c0,0 -14.02,2.24 -16.09,0c-2.07,-2.23 -13.28,-3.87 -13.28,-3.87c-19.51,2.83 -18.83,0 -18.83,0l-7.26,1.58l0,157.42l1440,0l0,-57.5c0,0 -17.61,-9.69 -23.83,-8.2z"
    />
  </svg>
);

export type HeroProps = {
  title: string;
  backgroundImage?: string;
};

function Hero({ title, backgroundImage: url }: HeroProps) {
  return (
    <div className="w-full h-96 relative flex flex-col justify-center overflow-hidden items-center">
      {url && (
        <Image fill src={url} alt="Hero Image" style={{ objectFit: "cover" }} />
      )}
      {title && (
        <>
          <h1 className="text-4xl font-bold text-center z-10 text-white">
            {title}
          </h1>
          <div className="bg-black opacity-15 absolute z-5 w-full h-full" />
        </>
      )}
      <PostHeroSvg className="z-20 absolute bottom-0" />
    </div>
  );
}

export const heroConfig: ComponentConfig<HeroProps> = {
  render: Hero,
  fields: {
    title: {
      type: "text",
      label: "Title (Optional)",
    },
    backgroundImage: uploadFile,
  },
};
