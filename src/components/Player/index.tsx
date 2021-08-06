import { useContext, useEffect, useRef, useState } from "react";
import { PlayerContext } from "../../contexts/PlayerContext";
import Image from "next/image";
import Slider from "rc-slider";

import "rc-slider/assets/index.css";
import styles from "./styles.module.scss";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);

  const {
    episodesList,
    currentEpisodeIndex,
    isPlaying,
    isLooping,
    isShuffling,
    hasNextEpisode,
    hasPreviousEpisode,
    togglePlay,
    toggleLoop,
    toggleShuffle,
    setPlayingState,
    playNextEpisode,
    playPreviousEpisode,
    clearPlayerState,
  } = useContext(PlayerContext);

  const episode = episodesList[currentEpisodeIndex];

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  function setupProgressListener() {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener("timeupdate", () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }

  function handleEpisodeEnded() {
    if (hasNextEpisode) {
      playNextEpisode();
    } else {
      clearPlayerState();
    }
  }

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora</strong>
      </header>
      {episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width="592"
            height="592"
            src={episode.thumbnail}
            objectFit="cover"
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ""}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
                trackStyle={{ backgroundColor: "#04d361" }}
                railStyle={{ backgroundColor: "#9f75ff" }}
                handleStyle={{ borderColor: "#04d361", borderWidth: "4px" }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        {episode && (
          <audio
            src={episode.url}
            autoPlay
            loop={isLooping}
            ref={audioRef}
            onPlay={() => {
              setPlayingState(true);
            }}
            onPause={() => {
              setPlayingState(false);
            }}
            onLoadedMetadata={setupProgressListener}
            onEnded={handleEpisodeEnded}
          />
        )}
        <div className={styles.buttons}>
          <button
            type="button"
            className={isShuffling ? styles.isActive : ""}
            onClick={toggleShuffle}
            disabled={!episode || episodesList.length === 1}
          >
            <img src="/shuffle.svg" alt="Random" />
          </button>
          <button
            type="button"
            onClick={playPreviousEpisode}
            disabled={!episode || !hasPreviousEpisode}
          >
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>
          <button
            type="button"
            className={styles.playButton}
            disabled={!episode}
            onClick={togglePlay}
          >
            <img src={!isPlaying ? "/play.svg" : "/pause.svg"} alt="Tocar" />
          </button>
          <button
            type="button"
            onClick={playNextEpisode}
            disabled={!episode || !hasNextEpisode}
          >
            <img src="/play-next.svg" alt="Tocar próxima" />
          </button>
          <button
            type="button"
            onClick={toggleLoop}
            className={isLooping ? styles.isActive : ""}
            disabled={!episode}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}
