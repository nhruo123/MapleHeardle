import { type Writable, writable } from "svelte/store"
import { GameState, type GlobalState, Guess, type RestoreState, type SongGuess } from './types'
import { isSameDay } from "./utils";
import { MAX_GUESSES, TODAY } from "./consts";

const STORAGE_KEY = "state";

let resortedGameState: RestoreState | undefined = localStorage.getItem(STORAGE_KEY) ? JSON.parse(
  localStorage.getItem(STORAGE_KEY)!
) : undefined;

if (resortedGameState && !isSameDay(new Date(resortedGameState.date), TODAY)) {
  resortedGameState = undefined;
}

export const defaultValue: GlobalState = {
  gameSate: GameState.Playing,
  currentGuess: 1,
  guessHistory:
    Array(MAX_GUESSES).fill({
      songName: undefined,
      guess: Guess.Unused,
    }),
}

function createGlobalState() {
  const { subscribe, update } = writable(resortedGameState ?? defaultValue);


  subscribe((newValue) => {
    const valueToStore: RestoreState = { ...newValue, date: TODAY.getTime() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(valueToStore));
  });

  const setCurrentGuess = (guess: SongGuess) => update((v) => {
    v.guessHistory[v.currentGuess - 1] = guess;
    v.currentGuess += 1;
    if (guess.guess === Guess.Good) {
      v.gameSate = GameState.Won
    } else if (v.currentGuess > MAX_GUESSES) {
      v.gameSate = GameState.Lost;
    }
    return v;
  });

  const setGameState = (newState: GameState) => update((v) => {
    v.gameSate = newState;
    return v;
  });


  return {
    setCurrentGuess,
    setGameState,
    subscribe,
  }
}

export const globalState = createGlobalState();

