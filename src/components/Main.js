import React from "react";
import songData from "../songData";
import gifsData from "../gifsData";
import Spinner from "./spinner";

export default function Main() {
  const [songs] = React.useState(songData.songs);

  const [gif, setGif] = React.useState(
    gifsData.gifs[Math.floor(Math.random() * gifsData.gifs.length)]
  );

  const [isLoading, setIsLoading] = React.useState(true);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const [currentSong, setCurrentSong] = React.useState(() => {
    return songData.songs[
      Math.floor(Math.random() * songData.songs.length)
    ];
  });

  const audioElm = React.useRef(null);

  const gifsArray = React.useMemo(() => gifsData.gifs, []);
  const gifsUrl = React.useMemo(() => gifsArray.map((g) => g.url), [gifsArray]);

  /* ▶️ Play / Pause */
  React.useEffect(() => {
    if (!audioElm.current) return;

    if (isPlaying) {
      audioElm.current.play();
    } else {
      audioElm.current.pause();
    }
  }, [isPlaying]);

  /* 🖼️ Preload GIFs */
  const cacheImages = async (srcArray) => {
    const promises = srcArray.map(
      (src) =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = reject;
        })
    );

    await Promise.all(promises);
    setIsLoading(false);
  };

  React.useEffect(() => {
  cacheImages(gifsUrl);
}, [gifsUrl]);

  /* ⏭️ Next Song */
  const NextSong = () => {
    const randomSongIndex = Math.floor(Math.random() * songs.length);
    const randomGifIndex = Math.floor(Math.random() * gifsArray.length);

    setCurrentSong(songs[randomSongIndex]);
    setGif(gifsArray[randomGifIndex]);
    setIsPlaying(true);
  };

  /* ⏯️ Toggle Play */
  const PlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const backgroundStyle = {
    backgroundImage: `url("${gif.url}")`,
  };

  const iconStyle = {
    fontSize: "3rem",
  };

  if (isLoading) return <Spinner />;

  return (
    <div
      className="main"
      onDoubleClick={NextSong}
      onClick={PlayPause}
      style={backgroundStyle}
    >
      <a href="https://github.com/corporatebhai">
        <i
          className="fa fa-github icon faa-horizontal animated"
          style={iconStyle}
        ></i>
      </a>

      <div className="overlay"></div>

      <audio
        ref={audioElm}
        src={currentSong.url}
        onEnded={NextSong}
      />

      <div className="glass-container">
        <div className="container">
          <div className="text">
            <p>{isPlaying ? "" : "Happy Journey"}</p>
          </div>
          <div className="text">
            <p>{isPlaying ? currentSong.name : "From Samar ❤️"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
