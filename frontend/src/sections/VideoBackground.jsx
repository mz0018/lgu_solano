import { useEffect, useRef, useState } from "react";
import Player from "@vimeo/player";

const VIDEO_ID = "1128761634";

const VideoBackground = () => {
  const iframeRef = useRef(null);
  const playerRef = useRef(null);
  const observerRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const onIframeLoad = async () => {
      try {
        const player = new Player(iframe, { autopause: false });
        playerRef.current = player;

        player.on("loaded", () => console.log("event: loaded"));
        player.on("play", () => { console.log("event: play"); setPlaying(true); });
        player.on("pause", () => { console.log("event: pause"); setPlaying(false); });
        player.on("error", (e) => console.error("player error:", e));

        await player.ready();
        console.log("player.ready() resolved");
        setReady(true);

        try { await player.setVolume(0); } catch (e) { console.warn("setVolume failed:", e); }

        try {
          await player.play();
          console.log("Autoplay succeeded (player.play() resolved)");
          setAutoplayBlocked(false);
        } catch (err) {
          console.warn("Autoplay blocked or failed:", err);
          setAutoplayBlocked(true);
        }

        observerRef.current = new IntersectionObserver(
          async ([entry]) => {
            try {
              if (!playerRef.current) return;
              if (entry.isIntersecting) await playerRef.current.play();
              else await playerRef.current.pause();
            } catch (e) {
              console.warn("IntersectionObserver play/pause error:", e);
            }
          },
          { threshold: 0.2 }
        );
        observerRef.current.observe(iframe);
      } catch (e) {
        console.error("Error creating player after iframe load:", e);
        setAutoplayBlocked(true);
      }
    };

    if (iframe.complete) {
      setTimeout(onIframeLoad, 50);
    } else {
      iframe.addEventListener("load", onIframeLoad, { once: true });
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
      if (playerRef.current) {
        playerRef.current.destroy().catch(() => {});
        playerRef.current = null;
      }
      iframe.removeEventListener?.("load", onIframeLoad);
    };
  }, []);

  const handleManualPlay = async () => {
    const player = playerRef.current;
    if (!player) return;
    try {
      await player.setVolume(0);
      await player.play();
      setAutoplayBlocked(false);
      console.log("Manual play succeeded");
    } catch (err) {
      console.warn("Manual play failed:", err);
    }
  };

  return (
    <div className="relative w-full pb-[56.25%]">
      <iframe
        ref={iframeRef}
        src={`https://player.vimeo.com/video/${VIDEO_ID}?autoplay=1&muted=1&loop=1&controls=0&playsinline=1`}
        className="absolute top-0 left-0 w-full h-full border-0"
        allow="autoplay; fullscreen; picture-in-picture"
        title="Vimeo Background"
      ></iframe>

      <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>

      <div className="absolute left-4 top-4 z-20 text-white text-sm bg-black/50 px-2 py-1 rounded">
        <div>ready: {String(ready)}</div>
        <div>playing: {String(playing)}</div>
        <div>autoplayBlocked: {String(autoplayBlocked)}</div>
      </div>

      {autoplayBlocked && (
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          <button
            onClick={handleManualPlay}
            className="bg-black/70 text-white px-4 py-3 rounded-md shadow-lg"
          >
            Tap to play background video
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoBackground;
