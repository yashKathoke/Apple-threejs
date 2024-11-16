import React, { useEffect, useRef, useState } from "react";
import { hightlightsSlides } from "../constants";
import { pauseImg, playImg, replayImg } from "../utils";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);

const VideoCarousel = () => {
  const videoRefs = useRef([]);
  const videoDivRefs = useRef([]);
  const videoSpanRefs = useRef([]);
  const [video, setVideo] = useState({
    isPlaying: false,
    videoId: 0,
    startPlay: true,
    isLastVideo: false,
    isEnd: false,
  });

  const [loadeddata, setLoadeddata] = useState([]);

  let { isPlaying, videoId, startPlay, isLastVideo, isEnd } = video;

  useGSAP(() => {
    gsap.to("#slider", {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: "power2.inOut",
    });

    gsap.to("#video", {
      scrollTrigger: {
        trigger: "#video",
        toggleActions: "restart none none none",
      },
      onComplete: () => {
        setVideo((prev) => ({ ...prev, isPlaying: true, startPlay: true }));
      },
    });
  }, [videoId]);

  useEffect(() => {
    let currentProgress = 0;
    let span = videoSpanRefs.current;
    if (span[videoId]) {
      let anim = gsap.to(span[videoId], {
        onUpdate: () => {
          const progress = Math.ceil(anim.progress() * 100);

          if (progress != currentProgress) {
            currentProgress = progress;
          }
          gsap.to(videoDivRefs.current[videoId], {
            width:
              window.innerWidth < 760
                ? "10vw" // phone
                : window.innerWidth < 1200
                ? "10vw" // tablet
                : "5vw", // desktop
          });

          gsap.to(span[videoId], {
            width: `${currentProgress}%`,
            backgroundColor: "white",
          });
        },
        onComplete: () => {
          gsap.to(videoDivRefs.current[videoId], {
            width: "12px",
          });

          gsap.to(span[videoId], {
            backgroundColor: "#afafaf",
          });
        },
      });

      if (videoId == 0) {
        anim.restart();
      }

      // update the progress bar
      const animUpdate = () => {
        anim.progress(
          videoRefs.current[videoId].currentTime /
            hightlightsSlides[videoId].videoDuration
        );
      };

      if (isPlaying) {
        // ticker to update the progress bar
        gsap.ticker.add(animUpdate);
      } else {
        // remove the ticker when the video is paused (progress bar is stopped)
        gsap.ticker.remove(animUpdate);
      }
    }
  }, [videoId, startPlay, isPlaying]);

  useEffect(() => {
    if (loadeddata.length > 3) {
      if (!isPlaying) {
        videoRefs.current[videoId].pause();
      } else {
        startPlay && videoRefs.current[videoId].play();
      }
    }
  }, [startPlay, videoId, isPlaying, loadeddata]);

  const handleProcess = (type, i) => {
    switch (type) {
      case "video-end":
        setVideo((prev) => ({ ...prev, videoId: i + 1, isEnd: true }));
        break;
      case "play":
        setVideo((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
        break;
      case "pause":
        setVideo((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
        break;
      case "video-reset":
        setVideo((prev) => ({ ...prev, isLastVideo: false, videoId: 0 }));
        break;
      case "video-last":
        setVideo((prev) => ({ ...prev, isLastVideo: true }));
        break;
      default:
        break;
    }
  };

  const handleLoadeddata = (i, e) => {
    setLoadeddata((prev) => [...prev, e]);
  };

  return (
    <>
      <div className="flex items-center">
        {hightlightsSlides.map((list, i) => (
          <div key={list.id} id="slider" className="sm:pr-5 pr-10">
            <div className="video-carousel_container">
              <div className="w-full h-full rounded-3xl flex-center bg-black overflow-hidden">
                <video
                  id="video"
                  muted
                  playsInline={true}
                  preload="auto"
                  ref={(el) => (videoRefs.current[i] = el)}
                  onEnded={() =>
                    i !== 3
                      ? handleProcess("video-end", i)
                      : handleProcess("video-last")
                  }
                  onPlay={() =>
                    setVideo((prev) => ({ ...prev, isPlaying: true }))
                  }
                  onLoadedMetadata={(e) => handleLoadeddata(i, e)}
                >
                  <source src={list.video} />
                </video>
              </div>

              <div className="absolute top-12  left-[5%] z-10">
                {list.textLists.map((text, i) => (
                  <p key={text} className="font-medium md:text-2xl text-xl">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex-center mt-10">
        <div className="flex-center py-5 px-3 bg-gray-300 rounded-full blackdrop-blur">
          {videoRefs.current.map((_, i) => (
            <span
              key={i}
              className="mx-2 w-3 h-3 bg-gray-200 cursor-pointer relative rounded-full"
              ref={(el) => (videoDivRefs.current[i] = el)}
            >
              <span
                className="absolute h-full w-full rounded-full"
                ref={(el) => (videoSpanRefs.current[i] = el)}
              ></span>
            </span>
          ))}
        </div>

        <button className="control-btn">
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
            onClick={
              isLastVideo
                ? () => handleProcess("video-reset")
                : !isPlaying
                ? () => handleProcess("play")
                : () => handleProcess("pause")
            }
          />
        </button>
      </div>
    </>
  );
};

export default VideoCarousel;
