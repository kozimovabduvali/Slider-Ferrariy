import { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';

interface VideoProps {
    src: string;
    isActiveVideo: boolean;
    setActiveVideoSrc: (src: string | null) => void;
}

const Video: React.FC<VideoProps> = ({ src, isActiveVideo, setActiveVideoSrc }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const progressRef = useRef<HTMLDivElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [tooltipTime, setTooltipTime] = useState(0);
    const [tooltipPosition, setTooltipPosition] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [wasPlayingBeforeDrag, setWasPlayingBeforeDrag] = useState(false);
    const [isHoveringProgress, setIsHoveringProgress] = useState(false);
    const [videoFirstActive, setVideoFirstActive] = useState(false);

    const isPlayingRef = useRef(isPlaying);
    const durationRef = useRef(duration);
    const isDraggingRef = useRef(isDragging);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        isPlayingRef.current = isPlaying;
    }, [isPlaying]);

    useEffect(() => {
        durationRef.current = duration;
    }, [duration]);

    useEffect(() => {
        isDraggingRef.current = isDragging;
    }, [isDragging]);

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const updateVideoTime = useCallback((newTime: number) => {
        const video = videoRef.current;
        if (video) {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            animationFrameRef.current = requestAnimationFrame(() => {
                video.currentTime = newTime;
                setCurrentTime(newTime);
            });
        }
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (isDraggingRef.current && progressRef.current) {
            const rect = progressRef.current.getBoundingClientRect();
            const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            const newTime = pos * durationRef.current;
            setTooltipTime(newTime);
            setTooltipPosition(pos * 100);
            updateVideoTime(newTime);
        }
    }, [updateVideoTime]);

    const handleMouseUp = useCallback(() => {
        if (isDraggingRef.current) {
            setIsDragging(false);
            const video = videoRef.current;
            if (video && wasPlayingBeforeDrag) {
                setTimeout(() => {
                    video.play().catch(() => console.warn('Play blocked by browser'));
                }, 50);
            }
        }
    }, [wasPlayingBeforeDrag]);

    useEffect(() => {
        const video = videoRef.current;
        let hls: Hls | null = null;

        if (video) {
            if (Hls.isSupported()) {
                hls = new Hls();
                hls.loadSource(src);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    hls!.currentLevel = hls!.levels.length - 1;
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = src;
            }

            video.addEventListener('loadedmetadata', () => {
                setDuration(video.duration);
            });

            const handleTimeUpdate = () => {
                if (!isDraggingRef.current) {
                    requestAnimationFrame(() => {
                        setCurrentTime(video.currentTime);
                    });
                }
            };

            video.addEventListener('timeupdate', handleTimeUpdate);

            video.addEventListener('ended', () => {
                setIsPlaying(false);
                setCurrentTime(0);
                video.currentTime = 0;
                setActiveVideoSrc(null);
            });

            return () => {
                video.removeEventListener('timeupdate', handleTimeUpdate);
                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current);
                }
                if (hls) {
                    hls.destroy();
                }
            };
        }
    }, [src, setActiveVideoSrc]);

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            if (isActiveVideo && isPlaying) {
                video.play().catch(() => console.warn('Play blocked by browser'));
            } else {
                video.pause();
                setIsPlaying(false);
            }
        }
    }, [isActiveVideo, isPlaying]);

    const handleTogglePlay = () => {
        const video = videoRef.current;
        if (!video) return;

        if (isPlaying) {
            video.pause();
            setIsPlaying(false);
            setActiveVideoSrc(null);
        } else {
            setActiveVideoSrc(src);
            setIsPlaying(true);
        }
    };

    const handleFullscreenToggle = () => {
        const videoContainer = videoRef.current?.parentElement;
        if (!isFullscreen) {
            if (videoContainer?.requestFullscreen) {
                videoContainer.requestFullscreen();
                setIsFullscreen(true);
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging && progressRef.current) {
            const video = videoRef.current;
            if (video) {
                const rect = progressRef.current.getBoundingClientRect();
                const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                const newTime = pos * duration;
                video.currentTime = newTime;
                setCurrentTime(newTime);
            }
        }
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const video = videoRef.current;
        const wasPlaying = isPlayingRef.current;

        setWasPlayingBeforeDrag(wasPlaying);
        setIsDragging(true);

        if (video && wasPlaying) {
            video.pause();
        }

        const button = e.currentTarget;
        button.style.transform = 'scale(1.1)';
        button.style.transition = 'transform 0.1s ease';
    };

    const handleProgressHover = (e: React.MouseEvent<HTMLDivElement>) => {
        if (progressRef.current && !isDragging) {
            const rect = progressRef.current.getBoundingClientRect();
            const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            requestAnimationFrame(() => {
                setTooltipTime(pos * duration);
                setTooltipPosition(pos * 100);
            });
        }
    };

    const handleProgressMouseEnter = () => {
        setIsHoveringProgress(true);
    };

    const handleProgressMouseLeave = () => {
        if (!isDragging) {
            setIsHoveringProgress(false);
        }
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove, { passive: true });
            document.addEventListener('mouseup', handleMouseUp);

            const resetButtonTransform = () => {
                const buttons = document.querySelectorAll('.progress-button');
                buttons.forEach((btn) => {
                    (btn as HTMLElement).style.transform = '';
                    (btn as HTMLElement).style.transition = '';
                });
            };

            if (!isDragging) {
                resetButtonTransform();
            }
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            setIsHoveringProgress(false);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    const FirstActive = () => {
        setVideoFirstActive(true);
        setActiveVideoSrc(src);
        setIsPlaying(true);
        handleFullscreenToggle();
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center bg-black">
            <video
                ref={videoRef}
                muted={false}
                onClick={handleTogglePlay}
                className="w-full h-full object-contain"
            />

            {!videoFirstActive && (
                <>
                    <div className="w-full h-screen absolute top-0 left-0 z-40"></div>
                    <button onClick={FirstActive} className="cursor-pointer button w-25 h-25 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex items-center justify-center">
                        <img src="/images/play.png" alt="Play" />
                    </button>
                </>
            )}

            {isFullscreen && (
                <button className='cursor-pointer w-11 h-11 absolute top-5 left-5 z-50 flex items-center justify-center bg-black/50 rounded-full border border-white ' onClick={handleFullscreenToggle} aria-label="Exit fullscreen">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 12 12"
                        x="0px"
                        y="0px"
                      width={12}
                      hanging={12}
                        xmlSpace="preserve"
                    >
                        <path
                            fill="#ffffff"
                            d="M4.67417479 6L.34314575 1.05025253c-.19516147-.19516147-.19516147-.5119453 0-.70710678.19516147-.19516147.51194531-.19516147.70710678 0L6 4.6741748 10.94974747.34314575c.19516147-.19516147.5119453-.19516147.70710678 0 .19516147.19516147.19516147.51194531 0 .70710678L7.3258252 6l4.33102904 4.94974747c.19516147.19516147.19516147.5119453 0 .70710678-.19516147.19516147-.51194531.19516147-.70710678 0L6 7.3258252l-4.94974747 4.33102904c-.19516147.19516147-.5119453.19516147-.70710678 0-.19516147-.19516147-.19516147-.51194531 0-.70710678L4.6741748 6z"
                        />
                    </svg>
                </button>
            )}

            {videoFirstActive && (
                <>
                    <button
                        className="cursor-pointer flex items-center justify-center absolute bottom-20 rounded-full left-2 md:left-5 z-20 w-14 h-14 border-2 border-[#969696]"
                        onClick={handleTogglePlay}
                        aria-label={isPlaying ? 'Pause video' : 'Play video'}
                    >
                        {isPlaying ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={14}
                                height={14}
                                fill="white"
                                viewBox="0 0 8 11"
                            >
                                <path d="M5.2 0v11H8V0H5.2zM0 11h2.8V0H0v11z" />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={14}
                                height={14}
                                fill="white"
                                viewBox="0 0 12.8 15"
                            >
                                <path d="M.2 14V1C.2.4.8-.1 1.4.3c.5.3 9.9 6 10.8 6.5.6.3.5 1.1 0 1.4-.6.4-10.1 6.1-10.8 6.5-.5.3-1.2 0-1.2-.7z" />
                            </svg>
                        )}
                    </button>

                    <div className="absolute bottom-20 right-2 md:right-5 z-20 flex items-end gap-2 md:gap-4 text-white">
                        <p className="md:text-3xl text-2xl font-normal leading-8 SansRegular">
                            {formatTime(currentTime)}
                        </p>
                        <p className="md:text-3xl text-2xl font-normal leading-8 SansRegular">
                            {formatTime(duration)}
                        </p>

                        <button
                            className="cursor-pointer w-10 h-10 border-2 border-[#969696] rounded-full flex items-center justify-center mb-2"
                            onClick={handleFullscreenToggle}
                            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                        >
                            {isFullscreen ? (
                                <svg
                                    width={13}
                                    height={12}
                                    fill="white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 18 17"
                                >
                                    <path d="M8.3 9.3V17l-3.1-2.9-3 2.9L0 14.9 3 12 .3 9.3h8zM18 2.1l-3.6 3.4L17.1 8h-8V.4l3.1 3L15.8 0 18 2.1z" />
                                </svg>
                            ) : (
                                <svg
                                    width={13}
                                    height={12}
                                    fill="white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 19.1 18"
                                >
                                    <path d="M18.9.2v8.6l-3.3-3.3-3.3 3.3-2.4-2.4 3.3-3.3-3-3 8.7.1zm-9 11l-4 3.8 2.9 2.8H.1V9.2l3.4 3.4 3.9-3.9 2.5 2.5z" />
                                </svg>
                            )}
                        </button>
                    </div>

                    <div
                        className="cursor-pointer absolute bottom-5 left-0 w-full h-7.5 px-2 md:px-5"
                        ref={progressRef}
                        onMouseMove={handleProgressHover}
                        onMouseEnter={handleProgressMouseEnter}
                        onMouseLeave={handleProgressMouseLeave}
                    >
                        <div className="relative h-full" onClick={handleProgressClick}>
                            <div className="w-full h-0.5 bg-white/30 absolute top-[50%] left-0 -translate-y-[-50%]" />
                            <div
                                className={`h-0.5 bg-[#eb2323] absolute top-[50%] left-0 -translate-y-[-50%] transition-all duration-75 ${isDragging ? 'h-1' : ''}`}
                                style={{ width: `${(currentTime / duration) * 100}%` }}
                            />
                            <div
                                className={`absolute  -top-5  text-white text-[10px] px-3 py-1.5 rounded-md transition-all duration-150 ${isDragging ? 'scale-105' : ''} ${(isHoveringProgress || isDragging) && duration ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                                style={{
                                    left: `${tooltipPosition}%`,
                                    transform: 'translateX(-50%)',
                                }}
                            >
                                {formatTime(tooltipTime)}
                            </div>
                            <button
                                className={`absolute top-[50%] -translate-y-[50%] w-5 h-5 rounded-[9px] bg-white flex items-center justify-center cursor-pointer progress-button transition-all duration-150 ${isDragging ? 'scale-110 shadow-lg' : 'hover:scale-105'}`}
                                style={{
                                    left: `${(currentTime / duration) * 100}%`,
                                    filter: isDragging ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' : ''
                                }}
                                onMouseDown={handleMouseDown}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={10}
                                    height={10}
                                    viewBox="0 0 34 24"
                                >
                                    <path d="M32.9015186 14.3204391L22 24l6-12-6-12 10.9015186 9.6795609C33.5721317 10.2297651 34 11.0649526 34 12c0 .9350474-.4278683 1.7702349-1.0984814 2.3204391zM1.0984814 14.3204391L12 24 6 12l6-12L1.0984814 9.6795609C.4278683 10.2297651 0 11.0649526 0 12c0 .9350474.4278683 1.7702349 1.0984814 2.3204391z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </>
            )}

            <style>
                {`
                    @keyframes scale-in {
                        0% { transform: scale(0.8); opacity: 0; }
                        50% { transform: scale(1.1); opacity: 0.7; }
                        100% { transform: scale(1); opacity: 0.7; }
                    }
                    .fullscreen video {
                        object-fit: contain !important;
                        max-width: 100vw;
                        max-height: 100vh;
                        width: 100%;
                        height: 100%;
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                    }
                    .fullscreen {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 100vw;
                        height: 100vh;
                        background: black;
                    }
                `}
            </style>
        </div>
    );
};

export default Video;