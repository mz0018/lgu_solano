import { useEffect, useRef, useState } from "react";
import Player from "@vimeo/player";
import { Play, Pause, Maximize2 } from "lucide-react";

const VIDEO_ID = "1128761634";

const VideoBackground = () => {
  const iframeRef = useRef(null);
  const playerRef = useRef(null);
  const observerRef = useRef(null);

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [userPaused, setUserPaused] = useState(false);

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
          setUserPaused(false);
        } catch (err) {
          console.warn("Autoplay blocked or failed:", err);
          setAutoplayBlocked(true);
        }

        observerRef.current = new IntersectionObserver(
          async ([entry]) => {
            try {
              if (!playerRef.current) return;
              if (entry.isIntersecting) {
                if (!userPaused) await playerRef.current.play();
              } else {
                await playerRef.current.pause();
              }
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

  const handleTogglePlay = async () => {
    const player = playerRef.current;
    if (!player) return;
    try {
      if (playing) {
        await player.pause();
        setUserPaused(true);
      } else {
        await player.setVolume(0);
        await player.play();
        setUserPaused(false);
      }
    } catch (err) {
      console.warn("toggle play failed:", err);
    }
  };

  const handleFullscreen = async () => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    try {
      if (iframe.requestFullscreen) await iframe.requestFullscreen();
      else if (iframe.webkitRequestFullscreen) iframe.webkitRequestFullscreen();
      else if (iframe.msRequestFullscreen) iframe.msRequestFullscreen();
    } catch (err) {
      console.warn("request fullscreen failed:", err);
    }
  };

  const handleManualPlay = async () => {
    const player = playerRef.current;
    if (!player) return;
    try {
      await player.setVolume(0);
      await player.play();
      setAutoplayBlocked(false);
      setUserPaused(false);
      console.log("Manual play succeeded");
    } catch (err) {
      console.warn("Manual play failed:", err);
    }
  };

  return (
    <div className="relative w-full pb-[56.25%] bg-black">
      <iframe
        ref={iframeRef}
        src={`https://player.vimeo.com/video/${VIDEO_ID}?autoplay=1&muted=1&loop=1&controls=0&playsinline=1`}
        className="absolute top-0 left-0 w-full h-full border-0"
        allow="autoplay; fullscreen; picture-in-picture"
        title="Vimeo Background"
      ></iframe>

      <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>

      <div className="absolute right-4 top-4 z-40">
        <div className="flex items-center gap-2 bg-black/50 px-2 py-1 rounded-md backdrop-blur-sm pointer-events-auto">
          <button
            type="button"
            onClick={handleTogglePlay}
            title={playing ? "Pause" : "Play"}
            aria-label={playing ? "Pause video" : "Play video"}
            className="text-white p-2 rounded hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            {playing ? <Pause size={18} /> : <Play size={18} />}
          </button>

          <button
            type="button"
            onClick={handleFullscreen}
            title="Fullscreen"
            aria-label="Enter fullscreen"
            className="text-white p-2 rounded hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </div>

      {autoplayBlocked && (
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          <button
            onClick={handleManualPlay}
            className="bg-black/70 text-white px-4 py-3 rounded-md shadow-lg"
            type="button"
          >
            Tap to play background video
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoBackground;
