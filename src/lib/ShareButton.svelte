<script lang="ts">
  import { Guess, type SongGuess } from "../types";

  export let guessHistory: SongGuess[];
  export let game_day: number;
  const ORIG_BUTTON_VALUE = "Share";
  let buttonValue: string = ORIG_BUTTON_VALUE;
  let timerId: number | undefined;

  async function share() {
    let won = false;
    const guesses = guessHistory
      .map(({ guess }) => {
        switch (guess) {
          case Guess.Bad:
            return "🟥";
          case Guess.Unused:
            return "⬜";
          case Guess.Good:
            won = true;
            return "🟩";
          case Guess.Skipped:
            return "⬛";
        }
      })
      .join(" ");

    const text = `Maple Heardle #${game_day + 1} \n\n ${won ? "🔊" : "🔇"} ${guesses} \n\n ${document.location.href}`;

    await navigator.clipboard.writeText(text);

    buttonValue = "Copied!";

    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      buttonValue = ORIG_BUTTON_VALUE;
    }, 1000 * 2);
  }
</script>

<button class="outline" on:click={share}>{buttonValue}</button>
