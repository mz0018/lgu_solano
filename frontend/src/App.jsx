import { Suspense, lazy, useState, useEffect } from "react";
import NavbarComponent from "./components/NavbarComponent";

import VideoBackgroundFallback from "./fallbacks/VideoBackgroundFallback";
import WhatWeDoFallback from "./fallbacks/WhatWeDoFallback";
import WhySolanoFallback from "./fallbacks/WhySolanoFallback";
import SubFooterFallback from "./fallbacks/SubFooterFallback";
import FooterFallback from "./fallbacks/FooterFallback";

const WhatWeDoSection = lazy(() => import("./sections/WhatWeDoSection"));
const WhySolanoSection = lazy(() => import("./sections/WhySolanoSection"));
const SubFooterSection = lazy(() => import("./sections/SubFooterSection"));
const FooterSection = lazy(() => import("./sections/FooterSection"));
const VideoBackgroundSection = lazy(() => import("./sections/VideoBackground"));

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const App = () => {

  return (
    <div className="relative">
      <NavbarComponent />

      <div className="relative z-10">
        <Suspense fallback={<VideoBackgroundFallback />}>
          <VideoBackgroundSection />
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
