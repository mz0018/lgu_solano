import { Loader2 } from "lucide-react";

const VideoBackgroundFallback = () => {
  return (
    <div className="relative w-full pb-[56.25%] bg-gray-100 animate-pulse">
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: "url('/fallback-image.jpg')",
        }}
      ></div>

      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-white animate-spin mb-3" />
        <p className="text-white text-lg font-medium">Getting video ready...</p>
      </div>
    </div>
  );
};

export default VideoBackgroundFallback;
