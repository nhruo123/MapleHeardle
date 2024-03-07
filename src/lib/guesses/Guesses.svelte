<script lang="ts">
  import type { SongGuess } from "../../types";
  import GuessBar from "./GuessBar.svelte";

  export let guessHistory: SongGuess[];
</script>

<div style="margin-bottom: 2vh;">
  {#each guessHistory as guess}
    <GuessBar {guess} />
  {/each}
</div>
