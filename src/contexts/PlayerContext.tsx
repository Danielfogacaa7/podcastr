import { createContext, ReactNode, useState, useContext } from "react";

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
};

type PlayerContextData = {
  episodesList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  hasNextEpisode: boolean;
  hasPreviousEpisode: boolean;
  play: (episode: Episode) => void;
  playList: (list: Episode[], index: number) => void;
  togglePlay: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  setPlayingState: (state: boolean) => void;
  playNextEpisode: () => void;
  playPreviousEpisode: () => void;
  clearPlayerState: () => void;
};

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
  children: ReactNode;
};

export function PlayerContextProvider({
  children,
}: PlayerContextProviderProps) {
  const [episodesList, setEpisodesList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  function playList(List: Episode[], index: number) {
    setEpisodesList(List);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function play(episode: Episode) {
    setEpisodesList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function toggleLoop() {
    setIsLooping(!isLooping);
  }

  function toggleShuffle() {
    setIsShuffling(!isShuffling);
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }

  function clearPlayerState() {
    setEpisodesList([]);
    setCurrentEpisodeIndex(0);
  }

  const hasPreviousEpisode = currentEpisodeIndex > 0;
  const hasNextEpisode =
    isShuffling || currentEpisodeIndex + 1 < episodesList.length;

  function playNextEpisode() {
    if (isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(
        Math.random() * episodesList.length
      );
      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    } else if (hasNextEpisode) setCurrentEpisodeIndex(currentEpisodeIndex + 1);
  }

  function playPreviousEpisode() {
    if (hasPreviousEpisode) setCurrentEpisodeIndex(currentEpisodeIndex - 1);
  }

  return (
    <PlayerContext.Provider
      value={{
        episodesList,
        currentEpisodeIndex,
        play,
        playList,
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
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => {
  return useContext(PlayerContext);
};
