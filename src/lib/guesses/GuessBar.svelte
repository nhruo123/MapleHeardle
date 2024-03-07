<script lang="ts">
  import { Guess, type SongGuess } from "../../types";

  export let guess: SongGuess;
</script>

{#if guess.guess === Guess.Good}
  <div class="container"><p>✅ - {guess.name}</p></div>
{:else if guess.guess === Guess.Bad}
  <div class="container"><p>❌ - {guess.name}</p></div>
{:else if guess.guess === Guess.Skipped}
  <div class="container"><p>❓ - Skipped</p></div>
{:else if guess.guess === Guess.Unused}
  <div class="container"><p></p></div>
{/if}

<style>
  div {
    border: solid;
    padding: 0.75em;
    border-width: 2px;
    align-items: center;
    margin-bottom: 0.5em;
  }
  p {
    margin-bottom: 0;
    font-size: 0.875rem;
    line-height: 1.25rem;
    min-height: 1.25rem;
  }
</style>
