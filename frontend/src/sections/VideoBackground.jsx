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
      className="relative w-full pb-[56.25%]"
    >
      <iframe
        ref={iframeRef}
        src="https://player.vimeo.com/video/1128761634?background=1&autoplay=1&loop=1&muted=1&controls=0"
        className="absolute top-0 left-0 w-full h-full border-0 rounded-none"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title="Background Video"
      ></iframe>

      <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>
    </div>
  );
};

export default VideoBackground;
