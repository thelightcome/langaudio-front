import HttpFactory from "../factory";

import { ISearchPlaylist } from "~/types/playlists.types";

class PlaylistModule extends HttpFactory {
  private RESOURCE = "/playlists";

  async create(data: { name: string }): Promise<any> {
    return await this.POST(`${this.RESOURCE}`, data);
  }

  async update(): Promise<any> {
    return await this.GET(`${this.RESOURCE}`);
  }

  async delete(): Promise<any> {
    return await this.GET(`${this.RESOURCE}`);
  }

  async findOne(): Promise<any> {
    return await this.GET(`${this.RESOURCE}`);
  }

  async addToPlaylist(data: { plId: number; sourceId: number }): Promise<any> {
    return await this.POST(`${this.RESOURCE}/add`, {
      playlistId: data.plId,
      sourceId: data.sourceId,
    });
  }

  async removeFromPlaylist(data: {
    plId: number;
    sourceId: number;
  }): Promise<any> {
    return await this.POST(`${this.RESOURCE}/remove`, {
      playlistId: data.plId,
      sourceId: data.sourceId,
    });
  }

  async findAll(params: ISearchPlaylist): Promise<any> {
    return await this.GET(`${this.RESOURCE}`, {
      query: params,
    });
  }
}

export default PlaylistModule;
