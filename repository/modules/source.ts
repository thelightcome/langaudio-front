import HttpFactory from "../factory";

import { ISearchSource, IUpdateSource } from "~/types/sources.types";

class SourceModule extends HttpFactory {
  private RESOURCE = "/sources";

  async create(formData: FormData): Promise<any> {
    return await this.POST<any>(`${this.RESOURCE}`, formData);
  }

  async update(id: number, body: IUpdateSource): Promise<any> {
    return await this.PATCH(`${this.RESOURCE}/${id}`, body);
  }

  async verify(id: number, body: IUpdateSource): Promise<any> {
    return await this.PATCH(`${this.RESOURCE}/verify/${id}`, body);
  }

  async delete(id: number): Promise<any> {
    return await this.DELETE(`${this.RESOURCE}/${id}`);
  }

  async findAll(
    params: ISearchSource = { offset: 0, limit: 10 }
  ): Promise<any> {
    return await this.GET(
      `${this.RESOURCE}/${params.isVerified ? "" : "verify"}`,
      {
        query: params,
      }
    );
  }

  async findPlaylistSources(
    plName: string,
    params: ISearchSource = { offset: 0, limit: 10 }
  ): Promise<any> {
    return await this.GET(`${this.RESOURCE}/playlist`, {
      query: {
        name: plName,
        ...params,
      },
    });
  }

  async findAllNames(
    params: ISearchSource = { offset: 0, limit: 10 }
  ): Promise<any> {
    return await this.GET(`${this.RESOURCE}`, {
      query: { ...params, fields: ["name"] },
    });
  }
}

export default SourceModule;
