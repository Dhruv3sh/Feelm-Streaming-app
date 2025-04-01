import { useEffect, useState } from "react";
import { LiaTimesSolid } from "react-icons/lia";
import Modal from "./Modal";
import { toast } from "react-toastify";

// Function to retrieve cached videoId for a movie title
const getCachedTrailer = (movieTitle) => {
  const cache = localStorage.getItem("trailerCache");
  if (!cache) return null;
  const trailerCache = JSON.parse(cache);
  return trailerCache[movieTitle];
};

// Function to set cached videoId for a movie title
const cacheTrailer = (movieTitle, videoId) => {
  const cache = localStorage.getItem("trailerCache");
  let trailerCache = {};
  if (cache) {
    trailerCache = JSON.parse(cache);
  }
  trailerCache[movieTitle] = videoId;
  localStorage.setItem("trailerCache", JSON.stringify(trailerCache));
};

const TrailerComponent = ({ showTrailer, setShowTrailer, movieTitle }) => {
  const [videoId, setVideoId] = useState(null);

  useEffect(() => {
    if (!movieTitle || !showTrailer) return;

    const cachedVideoId = getCachedTrailer(movieTitle);
    if (cachedVideoId) {
      setVideoId(cachedVideoId);
      return;
    }

    const fetchTrailer = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
            movieTitle + " trailer"
          )}&key=${import.meta.env.VITE_YOUTUBE_API_KEY}&type=video`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const fetchedVideoId = data.items[0]?.id?.videoId;
        if (fetchedVideoId) {
          setVideoId(fetchedVideoId);
          cacheTrailer(movieTitle, fetchedVideoId);
        } else {
          throw new Error("No video found");
        }
      } catch (error) {
        toast.dismiss();
        toast.error("Error playing trailer", {
          position: "top-center",
          theme: "dark",
          autoClose: 1200,
        });
        console.error("Error fetching trailer:", error);
        setShowTrailer(false);
      }
    };

    fetchTrailer();
  }, [movieTitle,showTrailer,setShowTrailer]);

  return (
    <>
      {videoId && (
        <Modal modal={showTrailer} setModal={setShowTrailer} visibility={"90"}>
          <div
            className={`z-40 flex items-center fixed top-0 bottom-0 left-1 lg:left-[8rem] sm:left-[4rem]
            overflow-auto right-1 sm:right-[4rem] lg:right-[8rem] transition-all
            ${showTrailer ? "visible opacity-100" : "invisible opacity-0"}`}
            onClick={() => setShowTrailer(false)}
          >
            <iframe
              className="relative w-full h-[50%] md:h-[70%] lg:h-[80%] xl:h-[90%] transition-all "
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title="YouTube video player"
              allow="autoplay; encrypted-media"
              allowFullScreen
              aria-label="Trailer video"
            ></iframe>

            <button
              onClick={() => setShowTrailer(false)}
              className="hidden md:block z-50 absolute top-[5.1rem] xl:top-[2.5rem] 4xl:top-[5rem] right-[0.1rem] text-xl hover:opacity-50"
              aria-label="Close trailer"
            >
              <LiaTimesSolid />
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default TrailerComponent;
