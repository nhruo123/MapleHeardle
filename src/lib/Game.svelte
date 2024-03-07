<script lang="ts">
  import AudioPlayer from "./AudioPlayer.svelte";
  import type { YouTubePlayer } from "youtube-player/dist/types";
  import { GameState, Guess } from "../types";
  import GuessBar from "./guesses/Guesses.svelte";
  import ShareButton from "./ShareButton.svelte";
  import SongStatus from "./SongStatus.svelte";
  import { globalState, defaultValue } from "../state";
  import { GUESSES_TIME, HEARDLE_GAME_DAY, MAX_GUESSES } from "../consts";
  import { sortedSongs, targetSong } from "../songs";
  import { onMount } from "svelte";

  let gameState = defaultValue;
  globalState.subscribe((v) => (gameState = v));
  $: currentGuess = gameState.currentGuess;

  let player: YouTubePlayer;

  let songStatus: SongStatus;

  let currentlyPlaying = false;
  let selectedSong = "";
  let fullSongDuration = 0;
  const resetTime = 0;

  let cancelationEvent: ((value: unknown) => void) | undefined;

  async function play(duration: number) {
    if (currentlyPlaying) {
      return;
    }

    currentlyPlaying = true;
    await player.seekTo(resetTime, true);
    await player.playVideo();
    songStatus.animate();
    await new Promise((resolve) => {
      cancelationEvent = resolve;
      setTimeout(resolve, duration);
    });

    await player.pauseVideo();
    currentlyPlaying = false;
  }

  function pause() {
    cancelationEvent?.(undefined);
    songStatus.reset();
  }

  function skipGuess() {
    pause();
    globalState.setCurrentGuess({ name: undefined, guess: Guess.Skipped });
  }

  function guessSong() {
    if (selectedSong === "") {
      return;
    }
    pause();

    const guess =
      selectedSong === targetSong.metadata.title ? Guess.Good : Guess.Bad;
    globalState.setCurrentGuess({ name: selectedSong, guess });

    selectedSong = "";
  }

  onMount(async () => {
    fullSongDuration = (await player.getDuration()) * 1000;
  });
</script>

<div class="container main">
  <AudioPlayer videoId={targetSong.youtube} bind:player />
  <GuessBar guessHistory={gameState.guessHistory} />
  {#if gameState.gameSate == GameState.Playing}
    <SongStatus
      bind:this={songStatus}
      duration={GUESSES_TIME[gameState.currentGuess - 1] * 1000}
      totalDuration={GUESSES_TIME[GUESSES_TIME.length - 1] * 1000}
    />
    <div class="container grid">
      <button class="outline" on:click={guessSong}>Guess</button>
      {#if !currentlyPlaying}
        <button
          class="outline"
          on:click={() => play(GUESSES_TIME[gameState.currentGuess - 1] * 1000)}
          >Play</button
        >
      {:else}
        <button class="outline" on:click={pause}>Pause</button>
      {/if}
      <button class="outline" on:click={skipGuess}>
        {#if currentGuess < MAX_GUESSES}
          Skip (+{GUESSES_TIME[currentGuess] - GUESSES_TIME[currentGuess - 1]}s)
        {:else}
          Give Up
        {/if}
      </button>
    </div>
    <input
      bind:value={selectedSong}
      list="songs"
      placeholder="Enter a song name..."
    />
    <datalist id="songs">
      {#each sortedSongs as song}
        <option value={song.metadata.title}>{song.description}</option>
      {/each}
    </datalist>
  {:else}
    <SongStatus
      bind:this={songStatus}
      duration={fullSongDuration}
      totalDuration={fullSongDuration}
    />
    {#if gameState.gameSate === GameState.Won}
      {#if currentGuess === 1}
        <h4>You won in single guess!</h4>
      {:else}
        <h4>You won in {currentGuess} guesses!</h4>
      {/if}
    {:else}
      <h4>You lost...</h4>
    {/if}
    <h4>
      Today song was: <a
        href="https://www.youtube.com/watch?v={targetSong.youtube}"
        >{targetSong.metadata.title}</a
      >
    </h4>
    <div class="grid">
      {#if !currentlyPlaying}
        <button class="outline" on:click={() => play(fullSongDuration)}
          >Play</button
        >
      {:else}
        <button class="outline" on:click={pause}>Pause</button>
      {/if}
      <ShareButton
        game_day={HEARDLE_GAME_DAY}
        guessHistory={gameState.guessHistory}
      />
    </div>
  {/if}
</div>

<style>
  .main {
    width: 75%;
  }
  div {
    margin-bottom: 0.5em;
  }
  h4 {
    text-align: center;
  }
</style>
