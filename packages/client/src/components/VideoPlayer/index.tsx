import { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

export default function VideoPlayer({ src }: any) {
  const videoRef = useRef<any>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.controls = true;
    const defaultOptions = {};
    if (video.canPlayType('video/mp4')) {
      video.src = src;
    } else if (Hls.isSupported()) {

      const hls = new Hls();
      hls.loadSource(src);
      const player = new Plyr(video, defaultOptions);
      hls.attachMedia(video);
    } else {
      console.error(
        'This is an old browser that does not support MSE https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API'
      );
    }
  }, [src, videoRef]);

  return (
    <>
      <video data-displaymaxtap ref={videoRef} />
      <style jsx>{`
        video {
          max-width: 100%;
        }
      `}</style>
    </>
  );
}
