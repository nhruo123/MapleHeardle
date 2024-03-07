export const HEARDLE_START_DATE = new Date(2024, 3 - 1, 7, 0, 0, 0, 0);
export const MS_IN_DAY = 1000 * 60 * 60 * 24;
export const TODAY = new Date();
export const HEARDLE_GAME_DAY = Math.floor(
  (TODAY.getTime() - HEARDLE_START_DATE.getTime()) / MS_IN_DAY,
);

export const MAX_GUESSES = 6;

// current guess stage in seconds
export const GUESSES_TIME = Array(MAX_GUESSES).fill(1);
for (let i = 1; i < GUESSES_TIME.length; i++) {
  GUESSES_TIME[i] = GUESSES_TIME[i - 1] + i;
}
