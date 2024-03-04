<script lang="ts">
  import AudioPlayer from "./AudioPlayer.svelte";
  import songsJson from "../bgm.json";
  import type { YouTubePlayer } from "youtube-player/dist/types";
  import {
    GameState,
    Guess,
    type Song,
    type SongGuess,
    type StorageLayout,
  } from "../types";
  import GuessBar from "./GuessBar.svelte";
  import ShareButton from "./ShareButton.svelte";

  let player: YouTubePlayer;

  const songs = songsJson as unknown as Song[];

  const MS_IN_DAY = 1000 * 60 * 60 * 24;
  const STORAGE_KEY = "state";
  const START_DATE = new Date("2024-03-04");
  const TODAY = new Date();
  const GAME_DAY = Math.floor(
    (TODAY.getTime() - START_DATE.getTime()) / MS_IN_DAY,
  );

  const targetSong = songs[GAME_DAY % songs.length];

  let resortedGameState: StorageLayout | null = JSON.parse(
    localStorage.getItem(STORAGE_KEY) ?? "null",
  );

  if (resortedGameState) {
    const daysDiff = Math.floor(
      (TODAY.getTime() - new Date(resortedGameState.date).getTime()) /
        MS_IN_DAY,
    );
    if (daysDiff !== 0) {
      resortedGameState = null;
    }
  }

  const MAX_GUESSES = 6;
  const guessHistory: SongGuess[] =
    resortedGameState?.guessHistory ??
    Array(MAX_GUESSES).fill({
      songName: undefined,
      guess: Guess.Unused,
    });

  let currentGuess = resortedGameState?.currentGuess ?? 1;
  let currentGameState = resortedGameState?.gameSate ?? GameState.Playing;
  let currentPlayTime = resortedGameState?.currentPlayTime ?? 1000;
  let resetTime = 0;
  let currentlyPlaying = false;
  let selectedSong = "";

  let cancelationEvent: ((value: unknown) => void) | undefined;

  function syncLocalStorage() {
    const currentState: StorageLayout = {
      guessHistory,
      currentPlayTime,
      gameSate: currentGameState,
      currentGuess,
      date: new Date().getTime(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState));
  }

  async function play() {
    if (currentlyPlaying) {
      return;
    }

    currentlyPlaying = true;
    await player.seekTo(resetTime, true);
    await player.playVideo();
    await new Promise((resolve) => {
      cancelationEvent = resolve;
      setTimeout(resolve, currentPlayTime);
    });

    await player.pauseVideo();
    currentlyPlaying = false;
  }

  function pause() {
    cancelationEvent?.(undefined);
  }

  function advanceGuess() {
    currentPlayTime += currentGuess * 1000;
    currentGuess += 1;
    if (currentGuess > MAX_GUESSES) {
      currentGameState = GameState.Lost;
    }
    syncLocalStorage();
  }

  function skipGuess() {
    pause();
    guessHistory[currentGuess - 1] = { name: undefined, guess: Guess.Skipped };
    advanceGuess();
  }

  function guessSong() {
    pause();
    if (selectedSong === "") {
      return;
    }

    if (selectedSong === targetSong.metadata.title) {
      guessHistory[currentGuess - 1] = {
        name: selectedSong,
        guess: Guess.Good,
      };
      currentGameState = GameState.Won;
      syncLocalStorage();
    } else {
      guessHistory[currentGuess - 1] = {
        name: selectedSong,
        guess: Guess.Bad,
      };
      advanceGuess();
    }
  }

  async function playFullSong() {
    player.on("stateChange", (event) => {
      if (event.data === 0) {
        currentlyPlaying = false;
      }
    });
    if (currentlyPlaying) {
      currentlyPlaying = false;
      await player.pauseVideo();
    } else {
      currentlyPlaying = true;
      await player.seekTo(0, true);
      await player.playVideo();
    }
  }
</script>

<div class="container main">
  <AudioPlayer videoId={targetSong.youtube} bind:player />
  {#each guessHistory as guess}
    <GuessBar {guess} />
  {/each}
  {#if currentGameState == GameState.Playing}
    <div class="container grid">
      <button class="outline" on:click={guessSong}>Guess</button>
      {#if !currentlyPlaying}
        <button class="outline" on:click={play}>Play</button>
      {:else}
        <button class="outline" on:click={pause}>Pause</button>
      {/if}
      <button class="outline" on:click={skipGuess}>
        {#if currentGuess < MAX_GUESSES}
          Skip (+{currentGuess})
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
      {#each songs as song}
        <option value={song.metadata.title}>{song.description}</option>
      {/each}
    </datalist>
  {:else if currentGameState === GameState.Won}
    {#if currentGuess === 1}
      <h4>You won in single guess!</h4>
    {:else}
      <h4>You won in {currentGuess} guesses!</h4>
    {/if}
  {:else}
    <h4>You lost...</h4>
  {/if}
  {#if currentGameState !== GameState.Playing}
    <h4>
      Today song was: <a
        href="https://www.youtube.com/watch?v={targetSong.youtube}"
        >{targetSong.metadata.title}</a
      >
    </h4>
    <div class="grid">
      <button class="outline" on:click={playFullSong}>
        {#if !currentlyPlaying}
          Play
        {:else}
          Pause
        {/if}
      </button>
      <ShareButton game_day={GAME_DAY} {guessHistory} />
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
