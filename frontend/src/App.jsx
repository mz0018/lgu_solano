import { Suspense, lazy } from "react";
import NavbarComponent from "./components/NavbarComponent";

import CarouselFallback from "./fallbacks/CarouselFallback";
import WhatWeDoFallback from "./fallbacks/WhatWeDoFallback";
import WhySolanoFallback from "./fallbacks/WhySolanoFallback";
import SubFooterFallback from "./fallbacks/SubFooterFallback";
import FooterFallback from "./fallbacks/FooterFallback";

const CarouselSection = lazy(() => import("./sections/CarouselSection"));
const WhatWeDoSection = lazy(() => import("./sections/WhatWeDoSection"));
const WhySolanoSection = lazy(() => import("./sections/WhySolanoSection"));
const SubFooterSection = lazy(() => import("./sections/SubFooterSection"));
const FooterSection = lazy(() => import("./sections/FooterSection"));
import VideoBackground from "./sections/VideoBackground";

const App = () => {
  return (
    <div className="relative">
      <VideoBackground />

      <div className="relative z-10">
        <NavbarComponent />

        <Suspense fallback={<CarouselFallback />}>
          <CarouselSection />
        </Suspense>

        <Suspense fallback={<WhatWeDoFallback />}>
          <WhatWeDoSection />
        </Suspense>

        <Suspense fallback={<WhySolanoFallback />}>
          <WhySolanoSection />
        </Suspense>

        <Suspense fallback={<SubFooterFallback />}>
          <SubFooterSection />
        </Suspense>

        <Suspense fallback={<FooterFallback />}>
          <FooterSection />
        </Suspense>
      </div>
    </div>
  );
};

export default App;
