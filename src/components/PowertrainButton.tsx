import { useState} from "react";

interface PropsType {
  setIsActive: (value: boolean) => void;
}


export default function PowertrainButton({setIsActive} : PropsType) {
  const [isHovered, setIsHovered] = useState(false);


  return (
    <button
      className=" cursor-pointer relative group bg-white text-black border-r-[#da291c] border-r-[3px] sm:max-w-[465px] w-full overflow-hidden   px-6 py-4 flex items-center justify-between gap-4"
      data-event-module-slug="powertrain"
      data-event-type="OPEN_FOCUSON"
      data-event-label="Explore the Powertrain"
      data-event-focuson-type="HorizontalSlider"
      aria-label="discover more"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsActive(true)}
    >
      {/* Background hover layer */}
      <span
        className={`absolute inset-0 bg-white/10 transition-all duration-300 pointer-events-none w-10 h-10 ${
          isHovered ? "bg-white/20" : ""
        }`}
        style={{ borderRadius: "2px" }}
      ></span>

      {/* Label */}
      <span
        className={`relative text-wrap max-[360px]:text-xs text-sm min-[400px]:text-base sm:text-lg font-semibold z-10 transition-all duration-300 SansRegular`}
      >
        Explore the Powertrain
      </span>

      {/* Icon wrapper */}
      <span className="relative min-w-10 h-10 flex items-center justify-center z-10">
        {/* Circle SVG */}
        <svg
          viewBox="0 0 40 40"
          width="40"
          height="40"
          className={`absolute inset-0 transition-transform duration-1000 ${
            isHovered ? "-rotate-360" : ""
          } ${isHovered ? "scale-110" : ""}`}
        >
          <defs>
            <radialGradient
              cy="0%"
              fx="50%"
              fy="0%"
              r="37.592%"
              gradientTransform="matrix(0 1 -1.50994 0 .5 -.5)"
              id="circle-grey-radial"
            >
              <stop stopColor="#303030" offset="0%" />
              <stop stopColor="#303030" stopOpacity={0} offset="100%" />
            </radialGradient>
            <path
              d="M20 40C8.954 40 0 31.046 0 20S8.954 0 20 0s20 8.954 20 20-8.954 20-20 20zm0-2c9.941 0 18-8.059 18-18S29.941 2 20 2 2 10.059 2 20s8.059 18 18 18z"
              id="circle-grey"
            />
          </defs>
          <g fill="none" fillRule="evenodd">
            <use fill="#D4D2D2" xlinkHref="#circle-grey" />
            <use
              fillOpacity=".6"
              fill="url(#circle-grey-radial)"
              xlinkHref="#circle-grey"
            />
          </g>
        </svg>

        {/* Arrow SVG */}
        <svg
          viewBox="0 0 8 16"
          width="8"
          height="16"
          className={`relative z-10 text-black transition-transform duration-300` }
          fill="currentColor"
        >
          <path d="M7.268 9.547L0 16l4-8-4-8 7.268 6.453C7.715 6.82 8 7.377 8 8c0 .623-.285 1.18-.732 1.547z" />
        </svg>
      </span>
    </button>
  );
}