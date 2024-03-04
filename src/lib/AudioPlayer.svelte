<script context="module" lang="ts">
  let componentCount = 0;
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import YoutubePlayer from "youtube-player";
  import type { YouTubePlayer } from "youtube-player/dist/types";

  componentCount += 1;
  let playerId = `youtube-player-${componentCount}`;
  export let videoId: string;
  export let player: YouTubePlayer | undefined = undefined;

  onMount(() => {
    player = YoutubePlayer(playerId, {
      videoId: videoId,
      width: "0%",
      height: "0%",
      playerVars: {
        autoplay: 0,
      },
    });

    player.on("ready", () => player?.setVolume(100));

    return () => player?.destroy();
  });
</script>

<div class="hidden">
  <div id={playerId} />
</div>

<style>
  .hidden {
    display: none;
  }
</style>
