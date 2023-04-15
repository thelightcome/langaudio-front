import { ISource } from "./sources.types";

export interface IPlaylistShort {
  id: number;
  name: string;
}

export interface IPlaylist extends IPlaylistShort {
  sources: ISource[];
}

export interface ISearchPlaylist {
  name?: string;
  offset: number;
  limit: number;
  fields?: string[];
  include?: string[];
}
