import { useEffect, useState } from "react";
import { LiaTimesSolid } from "react-icons/lia";
import Modal from "./Modal";

const TrailerComponent = ({ showTrailer, setShowTrailer, movieTitle }) => {
  const [videoId, setVideoId] = useState(null);

  useEffect(() => {
    if (!movieTitle) return;

    const fetchTrailer = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
            movieTitle + " trailer"
          )}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}&type=video`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const videoId = data.items[0]?.id?.videoId;
        setVideoId(videoId);
      } catch (error) {
        console.error("Error fetching trailer:", error);
      }
    };

    fetchTrailer();
  }, [movieTitle]);

  return (
    <Modal modal={showTrailer} setModal={setShowTrailer} visibility={'90'}>
      {showTrailer && videoId && (
        <div
        className={`z-40 flex items-center fixed top-0 bottom-0 left-1 lg:left-[8rem] sm:left-[4rem]
          overflow-auto right-1 sm:right-[4rem] lg:right-[8rem] transition-all
          ${showTrailer ? "visible opacity-100" : "invisible opacity-0"}`} onClick={()=>setShowTrailer(false)}
        >
          <iframe
            className=" relative w-full h-[50%] md:h-[70%] lg:h-[80%] xl:h-[90%] "
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title="YouTube video player"
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
          <button
            onClick={() => setShowTrailer(false)}
            className="hidden md:block z-50 absolute top-[5.1rem] xl:top-[2.5rem] 4xl:top-[5rem] right-[0.1rem] text-xl hover:opacity-50"
          >
            <LiaTimesSolid />
          </button>
        </div>
      )}
    </Modal>
  );
};

export default TrailerComponent;
