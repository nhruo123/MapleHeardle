export enum GameState {
  Playing,
  Lost,
  Won,
}

export enum Guess {
  Good,
  Bad,
  Skipped,
  Unused,
}

export type SongGuess = {
  name: string | undefined;
  guess: Guess;
};

export type Song = {
  description: string;
  metadata: {
    title: string;
    year: string;
  };
  youtube: string;
};

export type StorageLayout = {
  date: number,
  gameSate: GameState,
  currentGuess: number;
  currentPlayTime: number
  guessHistory: SongGuess[],
}
