// components/VideoBackground.jsx
import { useEffect, useRef } from "react";

const VideoBackground = () => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        iframe.contentWindow.postMessage(
          JSON.stringify({
            method: isVisible ? "play" : "pause",
          }),
          "*"
        );
      },
      { threshold: 0.2 }
    );

    observer.observe(iframe);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden"
    >
      <iframe
        ref={iframeRef}
        src="https://player.vimeo.com/video/1128761634?background=1&autoplay=1&loop=1&muted=1&controls=0"
        className="w-full h-full object-cover"
        frameBorder="0"
        allow="autoplay; fullscreen"
        allowFullScreen
        title="Background Video"
      ></iframe>

      <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>
    </div>
  );
};

export default VideoBackground;
