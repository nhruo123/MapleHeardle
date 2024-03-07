<script lang="ts">
  import { tweened } from "svelte/motion";
  export let totalDuration: number;
  export let duration: number;
  const progress = tweened(0, { duration: 0 });

  export function animate() {
    reset();
    progress.set(duration / totalDuration, { duration });
  }

  export function reset() {
    progress.set(0, { duration: 0 });
  }

  function formatTime(durationInMs: number) {
    durationInMs = Math.round(durationInMs);

    const milliSeconds = durationInMs % 1000;
    durationInMs -= milliSeconds;
    const durationInSeconds = durationInMs / 1000;
    const seconds = durationInSeconds % 60;
    const minutes = (durationInSeconds - seconds) / 60;

    return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }
</script>

<div class="outer">
  <div class="progress">
    <div class="fill" style="width: {$progress * 100}%; "></div>
    <div
      class="target"
      style="width: {(duration / totalDuration) * 100}%; "
    ></div>
  </div>

  <div style="display: flex; justify-content: space-between ;">
    <span>
      {formatTime($progress * totalDuration)}
    </span>
    <span>
      {formatTime(totalDuration)}
    </span>
  </div>
</div>

<style>
  .progress {
    position: relative;
    height: 2vh;
    border: solid;
    border-color: solid;
    border-width: 0.35vh;
    margin-bottom: 0.5vh;
  }
  .outer {
    margin-bottom: 0.5vh;
  }
  .fill {
    display: block;
    background-color: green;
    height: 100%;
    position: absolute;
    z-index: 10;
  }
  .target {
    display: block;
    background-color: gray;
    height: 100%;
    margin-bottom: 1vh;
  }
</style>
