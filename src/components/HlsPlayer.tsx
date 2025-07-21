import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface HlsPlayerProps {
  src: string;
}

const HlsPlayer: React.FC<HlsPlayerProps> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          // 🔥 Majburan eng yuqori sifatni tanlaydi
          hls.currentLevel = hls.levels.length - 1;

          video
            .play()
            .catch(() => console.warn('Autoplay blocked by browser'));
        });

        return () => hls.destroy();
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        video.addEventListener('loadedmetadata', () => {
          video
            .play()
            .catch(() => console.warn('Autoplay blocked by browser'));
        });
      }
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      className='object-cover sm:h-screen block w-full'
    />
  );
};

export default HlsPlayer;
