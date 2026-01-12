"use client";
import Layer1 from "@components/graphics/parallax-layers/Layer1.svg";
import Layer2 from "@components/graphics/parallax-layers/Layer2.svg";
import Layer3 from "@components/graphics/parallax-layers/Layer3.svg";
import Layer4 from "@components/graphics/parallax-layers/Layer4.svg";
import Layer5 from "@components/graphics/parallax-layers/Layer5.svg";
import Layer6 from "@components/graphics/parallax-layers/Layer6.svg";
import Layer7 from "@components/graphics/parallax-layers/Layer7.svg";
import Mobile from "@components/graphics/parallax-layers/MobileCombined.svg";
import { BannerLayer, ParallaxBanner } from "react-scroll-parallax";

function Parallax() {
  const parallaxLayer1: BannerLayer = {
    image: Layer1.src,
    translateY: [-12, 68],
    shouldAlwaysCompleteAnimation: true,
    expanded: false,
  };

  const parallaxLayer2: BannerLayer = {
    image: Layer2.src,
    translateY: [-12, 60],
    shouldAlwaysCompleteAnimation: true,
    expanded: false,
  };

  const parallaxLayer3: BannerLayer = {
    image: Layer3.src,
    translateY: [-12, 53],
    shouldAlwaysCompleteAnimation: true,
    expanded: false,
  };

  const parallaxLayer4: BannerLayer = {
    image: Layer4.src,
    translateY: [0, 49],
    shouldAlwaysCompleteAnimation: true,
    expanded: false,
  };

  const parallaxLayer5: BannerLayer = {
    image: Layer5.src,
    translateY: [2, 38],
    shouldAlwaysCompleteAnimation: true,
    expanded: false,
  };

  const parallaxLayer6: BannerLayer = {
    image: Layer6.src,
    translateY: [7, 30],
    shouldAlwaysCompleteAnimation: true,
    expanded: false,
  };
  const parallaxLayer7: BannerLayer = {
    image: Layer7.src,
    translateY: [0, 0],
    shouldAlwaysCompleteAnimation: true,
    expanded: false,
  };

  return (
    <div className="relative full">
      {/* MOBILE */}
      <div className="block md:hidden">
        <img src={Mobile.src} alt="Mobile" className="w-full" />
        <div className="absolute inset-0 flex justify-center text-center top-1/12">
          <h1 className="text-5xl text-white drop-shadow-2xl">
            Pfadi Meilen Herrliberg
          </h1>
        </div>
      </div>
      {/* DESKTOP */}
      <div className="hidden md:block bg-[#ffaf1b]">
        <ParallaxBanner
          layers={[
            parallaxLayer1,
            parallaxLayer2,
            parallaxLayer3,
            parallaxLayer4,
            parallaxLayer5,
            parallaxLayer6,
            parallaxLayer7,
          ]}
          className="h-[100vh]"
        />
        <div className="absolute inset-0 flex justify-center text-center top-1/3">
          <h1 className="text-9xl text-white drop-shadow-2xl">
            Pfadi Meilen Herrliberg
          </h1>
        </div>
      </div>
    </div>
  );
}

export default Parallax;
