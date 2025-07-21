import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import { Swiper as SwiperType } from 'swiper';
import Menu from './Menu';
import Video from './Video';

interface PropsType {
    isActive: boolean;
    setIsActive: (value: boolean) => void;
}

const menuItems = [
    {
        index: 1,
        category: 'Powertrain',
        title: 'The first hybrid',
        description:
            'The SF90 Stradale has a 90° V8 turbo engine capable of delivering 780 cv, the highest power output of any 8-cylinder in Ferrari history. The remaining 220 cv is delivered by three electric motors, one located between the engine and the new 8-speed dual-clutch transmission on the rear axle, and two on the front axle. This sophisticated system does not, however, make for a more complicated driving experience. Quite the opposite, in fact: the driver simply has to select one of the four power unit modes, and then just concentrate on driving. The sophisticated control logic takes care of the rest, managing the flow of power between the V8, the electric motors and the batteries.',
        videoSrc: '/video/rul.m3u8',
    },
    {
        index: null,
        category: null,
        title: 'EDRIVE',
        description:
            'The SF90 Stradale is equipped with three electric motors capable of generating a total of 220 cv (162 kW). A high performance Li-ion battery provides power to all three motors and guarantees a 25-kilometre range in all-electric eDrive mode, using just the front axle. When the internal combustion engine is turned off, the two independent front motors deliver a maximum speed of 135 km/h with longitudinal acceleration of ≤0.4 g. Reverse can only be used in eDrive mode which means the car can be manoeuvred at low speeds without using the V8. This mode is ideal for city centre driving or any other situation in which the driver wishes to eliminate the sound of the Ferrari V8.',
        videoSrc: '/video/bottomExo.m3u8',
    },
    {
        index: null,
        category: null,
        title: 'HYBRID',
        description:
            'This is the default setting when the car is turned on, in which the power flows are managed to optimise the overall efficiency of the system. The control logic autonomously decides whether to keep the internal combustion engine running or turn it off. If it is on, the internal combustion engine can run at maximum power thus guaranteeing powerful performance whenever the driver requires.',
        videoSrc: '/video/bgFerari.m3u8',
    },
    {
        index: null,
        category: null,
        title: 'PERFORMANCE',
        description:
            'Unlike "Hybrid", this mode keeps the ICE running because the priority is more on charging the battery than on efficiency. This guarantees that power is instantly and fully available when required. This mode is best suited to situations in which driving pleasure and fun behind the wheel are the main focus.',
        videoSrc: '/video/quality.m3u8',
    },
    {
        index: null,
        category: null,
        title: 'QUALIFY',
        description:
            'The internal combustion engine and electric motors work in synergy to generate an incredible 1,000 cv, which puts the SF90 Stradale at the very top of the range in performance terms. This mode allows the system to achieve maximum power output by allowing the electric motors to work at their maximum potential (162kW). The control logic prioritises performance over battery charging.',
        videoSrc: null,
    },
];

function HorizontalMenu({ isActive, setIsActive }: PropsType) {
    const swiperRef = useRef<SwiperType | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLastSlide, setIsLastSlide] = useState(false);
    const [isFirstOrSecondSlide, setIsFirstOrSecondSlide] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeVideoSrc, setActiveVideoSrc] = useState<string | null>(null);

    useEffect(() => {
        const handleWheel = (event: WheelEvent) => {
            if (!isActive || !swiperRef.current || !containerRef.current) return;

            event.preventDefault();

            const scrollSpeed = 1.2;
            const delta = event.deltaY * scrollSpeed;

            if (swiperRef.current) {
                const currentTranslate = swiperRef.current.translate;
                swiperRef.current.translateTo(currentTranslate - delta, 100);
            }
        };

        const isDesktop = window.matchMedia('(min-width: 60.0625em)').matches;
        const swiperElement = containerRef.current;

        if (isDesktop && swiperElement && isActive) {
            swiperElement.addEventListener('wheel', handleWheel, { passive: false });
        }

        return () => {
            if (isDesktop && swiperElement) {
                swiperElement.removeEventListener('wheel', handleWheel);
            }
        };
    }, [isActive]);

    const handleNextSlide = () => {
        if (swiperRef.current) {
            swiperRef.current.slideNext(700); // Increased to 800ms for smoother and slower transition
        }
    };

    const handlePrevSlide = () => {
        if (swiperRef.current) {
            swiperRef.current.slidePrev(700); // Increased to 800ms for smoother and slower transition
        }
    };
    return (
        <div
            ref={containerRef}
            className={`absolute min-[60.0625em]:top-0 ${isActive ? ' min-[60.0625em]:right-0 bottom-0' : '-bottom-full min-[60.0625em]:-right-full'} z-30 min-h-screen w-full bg-white transition-all duration-300 overflow-y-auto`}
        >
            {isActive && (
                <div className="h-screen max-[60.0625em]:pt-14 relative bg-white w-auto">
                    <button
                        className="w-[42px] h-[42px] min-[60.0625em]:absolute fixed min-[60.0625em]:top-[50%] top-5 min-[60.0625em]:translate-y-[-50%] left-5 group z-30"
                        aria-label="close discover more"
                        onClick={() => setIsActive(false)}
                    >
                        <span className="border border-[rgb(212,210,210)] cursor-pointer bg-[#969696] rounded-full text-white relative w-[42px] h-[42px] flex items-center justify-center overflow-hidden">
                            <svg
                                width={42}
                                height={42}
                                viewBox="0 0 24 24"
                                className="absolute top-[-1px] left-[-1px] rotate-[-90deg] pointer-events-none"
                            >
                                <circle
                                    cx={12}
                                    cy={12}
                                    r={11}
                                    stroke="#da291c"
                                    strokeWidth={1.5}
                                    fill="none"
                                    className="stroke-circle"
                                />
                            </svg>
                            <svg
                                viewBox="0 0 12 12"
                                className="z-10"
                                style={{ height: 12, width: 12 }}
                                fill="white"
                            >
                                <path d="M4.674 6L.344 1.05A.5.5 0 0 1 1.05.343L6 4.674l4.95-4.33a.5.5 0 0 1 .707.706L7.326 6l4.33 4.95a.5.5 0 0 1-.706.707L6 7.326l-4.95 4.33a.5.5 0 0 1-.707-.706L4.674 6z" />
                            </svg>
                        </span>
                    </button>

                    <button
                        onClick={() => setIsActive(false)}
                        className="cursor-pointer text-left text-xs font-normal uppercase SansRegular text-[#969696] min-[60.0625em]:hidden fixed top-8 left-18 max-md:hidden"
                    >
                        Close
                    </button>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="cursor-pointer flex items-center justify-between max-w-26 w-full fixed top-5 right-5 z-50"
                    >
                        <p className="text-left text-xs font-normal uppercase SansRegular">Share</p>
                        <div
                            className="w-[38px] h-[38px] group z-50"
                            aria-label="toggle menu"
                        >
                            <span className="cursor-pointer bg-white rounded-full text-white border border-[rgb(212,210,210)] relative w-[38px] h-[38px] flex items-center justify-center">
                                <svg
                                    width={41}
                                    height={41}
                                    viewBox="0 0 24 24"
                                    className="absolute top-[-2px] left-[-2px] rotate-[-90deg] pointer-events-none"
                                >
                                    <circle
                                        cx={12}
                                        cy={12}
                                        r={11}
                                        stroke="#da291c"
                                        strokeWidth={1}
                                        fill="none"
                                        className="stroke-circle"
                                    />
                                </svg>
                                {isMenuOpen ? (
                                    <svg
                                        viewBox="0 0 12 12"
                                        className="z-10"
                                        style={{ height: 12, width: 12 }}
                                    >
                                        <path d="M4.674 6L.344 1.05A.5.5 0 0 1 1.05.343L6 4.674l4.95-4.33a.5.5 0 0 1 .707.706L7.326 6l4.33 4.95a.5.5 0 0 1-.706.707L6 7.326l-4.95 4.33a.5.5 0 0 1-.707-.706L4.674 6z" />
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 12 14" className="w-3 h-3" width="12" height="14">
                                        <path d="M3.37 8.457a2 2 0 1 1-.124-3.022l4.783-2.761a2 2 0 1 1 .652 1.163l-4.728 2.73a2.007 2.007 0 0 1 .029.704L8.81 10.06a2 2 0 1 1-.747 1.108L3.37 8.457z"></path>
                                    </svg>
                                )}
                            </span>
                        </div>
                    </button>

                    <Menu isActive={isMenuOpen} />

                    <div className="min-[60.0625em]:block hidden">
                        <Swiper
                            slidesPerView="auto"
                            spaceBetween={120}
                            freeMode={true}
                            modules={[FreeMode]}
                            className="mySwiper"
                            onSwiper={(swiper) => {
                                swiperRef.current = swiper;
                            }}
                            onSlideChange={(swiper) => {
                                setIsLastSlide(swiper.isEnd);
                                setIsFirstOrSecondSlide(swiper.activeIndex <= 1);
                            }}
                            onReachEnd={() => {
                                setIsLastSlide(true);
                            }}
                            onReachBeginning={() => {
                                setIsFirstOrSecondSlide(true);
                            }}
                        >
                            {menuItems.map((item, index) => (
                                <SwiperSlide key={index} className="!w-auto">
                                    <div
                                        className={`select-none min-[60.0625em]:pl-30 flex items-center h-screen `}
                                    >
                                        <div className="flex-shrink-0 HorizontalSlider__text-wrapper__2rGRUfhC">
                                            {item.index && item.category && (
                                                <div className="flex items-center gap-2 mb-4">
                                                    <span className="text-xs font-normal text-[#da291c] SansRegular">
                                                        {item.index}
                                                    </span>
                                                    <div className="w-24 h-[1px] bg-[#da291c]" />
                                                    <h2 className="text-xs font-medium text-[#da291c] uppercase SansRegular">
                                                        {item.category}
                                                    </h2>
                                                </div>
                                            )}
                                            <h3 className="SansRegular text-[26px] sm:text-[32px] font-medium text-[#181818] leading-12 tracking-tight overflow-hidden mb-5">
                                                {item.title}
                                            </h3>
                                            <p className="SansMedium text-[10.8px] leading-4 font-medium text-[#969696] max-w-[419px]">
                                                {item.description}
                                            </p>
                                        </div>
                                        {item.videoSrc && (
                                            <div className="h-screen min-w-[441.25px] flex-shrink-0">
                                                <Video
                                                    src={item.videoSrc}
                                                    isActiveVideo={activeVideoSrc === item.videoSrc}
                                                    setActiveVideoSrc={setActiveVideoSrc}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    <div className="min-[60.0625em]:hidden block max-md:px-5">
                        {menuItems.map((item, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <div className="flex-shrink-0 py-10">
                                    {item.index && item.category && (
                                        <div className="flex items-center gap-2 mb-6">
                                            <span className="text-xs font-normal text-[#da291c] SansRegular">
                                                {item.index}
                                            </span>
                                            <div className="w-24 h-[1px] bg-[#da291c]" />
                                            <h2 className="text-xs font-medium text-[#da291c] uppercase SansRegular">
                                                {item.category}
                                            </h2>
                                        </div>
                                    )}
                                    <h3 className="SansRegular text-[26px] sm:text-4xl font-bold text-[#181818] leading-12 tracking-tight overflow-hidden mb-7.5 uppercase">
                                        {item.title}
                                    </h3>
                                    <p className="SansMedium text-[13px] font-medium text-[#969696] max-w-[499px]">
                                        {item.description}
                                    </p>
                                </div>
                                {item.videoSrc && (
                                    <div className="flex-shrink-0">
                                        <Video
                                            src={item.videoSrc}
                                            isActiveVideo={activeVideoSrc === item.videoSrc}
                                            setActiveVideoSrc={setActiveVideoSrc}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={handlePrevSlide}
                        className="cursor-pointer w-15 h-15 bg-white items-center justify-center rounded-full border border-[rgb(212,210,210)] min-[60.0625em]:flex hidden absolute bottom-30 left-20 z-30"
                        aria-label="Go to previous slide"
                        disabled={swiperRef.current?.activeIndex === 0}
                    >
                        <svg
                            viewBox="0 0 16 16"
                            className="w-4 h-4 transform rotate-180"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M16 8c0-.6-.2-1.1-.6-1.4L8 0l3.7 7.4-11.4.3c-.1 0-.3.1-.3.3s.2.3.3.3l11.3.3L8 16l7.4-6.5c.4-.4.6-.9.6-1.5z"></path>
                        </svg>
                    </button>

                    <div
                        className={`cursor-pointer min-[60.0625em]:flex hidden absolute bottom-30 right-20 items-center gap-3 z-30 transition-all duration-300 ${isLastSlide ? 'opacity-0 translate-x-5' : 'opacity-100'}`}
                    >
                        {isFirstOrSecondSlide && (
                            <p className="uppercase text-xs SansRegular">SCROLL</p>
                        )}
                        <button
                            type="button"
                            onClick={handleNextSlide}
                            className="w-15 h-15 bg-white cursor-pointer flex items-center justify-center rounded-full border border-[rgb(212,210,210)]"
                            aria-label="Go to next slide"
                            disabled={isLastSlide}
                        >
                            <svg viewBox="0 0 16 16" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 8c0-.6-.2-1.1-.6-1.4L8 0l3.7 7.4-11.4.3c-.1 0-.3.1-.3.3s.2.3.3.3l11.3.3L8 16l7.4-6.5c.4-.4.6-.9.6-1.5z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HorizontalMenu;
