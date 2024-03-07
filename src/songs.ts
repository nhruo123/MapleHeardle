
import songsJson from "../bgm.json";
import { HEARDLE_GAME_DAY } from "./consts";
import type { Song } from "./types";

export const songs = songsJson as unknown as Song[];
export const sortedSongs = [...songs].sort((a, b) =>
  a.metadata.title.localeCompare(b.metadata.title),
);
export const targetSong = songs[HEARDLE_GAME_DAY % songs.length];
