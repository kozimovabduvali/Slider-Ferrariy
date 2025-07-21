import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import HlsPlayer from "./components/HlsPlayer";
import PowertrainButton from "./components/PowertrainButton";
import HorizontalMenu from "./components/HorizontalMenu";

export default function App() {
  const textRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);
  const charsRef = useRef<HTMLHeadingElement | null>(null);

  const [videoSrc, setVideoSrc] = useState("/video/bgFerari.m3u8");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Check screen size for video source
    const updateVideoSrc = () => {
      if (window.innerWidth <= 640) {
        setVideoSrc("/video/mobile.m3u8");
      } else {
        setVideoSrc("/video/bgFerari.m3u8");
      }
    };

    updateVideoSrc();
    window.addEventListener("resize", updateVideoSrc);
    return () => window.removeEventListener("resize", updateVideoSrc);
  }, []);

  useEffect(() => {
    // Animation setup
    gsap.set(".text", { opacity: 0 });
    gsap.set(".line", { width: 0 });
    gsap.set(".char", { y: 28, opacity: 0 });

    if (textRef.current) {
      const textEls = textRef.current.querySelectorAll(".text");
      gsap.to(textEls, {
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
      });
    }

    if (lineRef.current) {
      gsap.to(lineRef.current, {
        width: "6rem",
        duration: 1.2,
        ease: "power2.out",
      });
    }

    if (charsRef.current) {
      const chars = charsRef.current.querySelectorAll(".char");
      gsap.to(chars, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.03,
      });
    }
  }, []);

  useEffect(() => {
    const setDocHeight = () => {
      document.documentElement.style.setProperty(
        "--doc-height",
        `${window.innerHeight}px`
      );
    };

    setDocHeight();
    window.addEventListener("resize", setDocHeight);
    // Handle orientation changes on mobile devices
    window.addEventListener("orientationchange", setDocHeight);

    return () => {
      window.removeEventListener("resize", setDocHeight);
      window.removeEventListener("orientationchange", setDocHeight);
    };
  }, []);

  return (
    <div
      className="relative w-full bg-[#181818] pt-20 sm:pt-25 overflow-hidden min-h-screen pb-5 flex flex-col  justify-between"
    >
      <div className="relative z-20 px-6 sm:px-12">
        <div ref={textRef} className="flex flex-col gap-6 sm:gap-8">
          <div className="flex items-center gap-2">
            <span className="text-xs font-normal text-[#da291c] SansRegular text">
              1
            </span>
            <div
              ref={lineRef}
              className="w-24 h-[1px] bg-[#da291c] line"
            />
            <h2 className="text-xs font-medium text-[#da291c] uppercase SansRegular text">
              Powertrain
            </h2>
          </div>

          <h3
            ref={charsRef}
            className="text-[26px] sm:text-[28px] font-bold text-white leading-none tracking-tight overflow-hidden SansRegular"
          >
            {"BEYOND".split("").map((char, idx) => (
              <span key={idx} className="char inline-block">
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
            {" PERFORMANCE".split("").map((char, idx) => (
              <span key={idx + 6} className="char inline-block">
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h3>
        </div>
      </div>

      {/* Video Background */}
      <div className="absolute top-0 left-0 w-full min-h-screen" >
        <HlsPlayer src={videoSrc} />
      </div>

      {/* Action Button */}
      <div className="static md:absolute bottom-5 sm:bottom-0 right-0 z-20 max-sm:px-6 w-full flex justify-end">
        <PowertrainButton setIsActive={setIsActive} />
      </div>

      <HorizontalMenu setIsActive={setIsActive} isActive={isActive} />
    </div>
  );
}