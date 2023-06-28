export interface IPlaylistShort {
  id: number;
  name: string;
}

export interface IPlaylist extends IPlaylistShort {
  sourceCount: Number;
}

export interface ISearchPlaylist {
  name?: string;
  offset: number;
  limit: number;
  fields?: string[];
}
