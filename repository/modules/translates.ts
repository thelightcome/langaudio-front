import HttpFactory from "../factory";

import { ISearchTranslate, ITranslate } from "~/types/translates.types";

class TranslateModule extends HttpFactory {
  private RESOURCE = "/translates";

  async create(data: ITranslate): Promise<any> {
    return await this.POST<any>(`${this.RESOURCE}`, data);
  }

  async update(): Promise<any> {
    return await this.GET(`${this.RESOURCE}`);
  }

  async delete(id: string): Promise<any> {
    return await this.DELETE(`${this.RESOURCE}/${id}`);
  }

  async findOne(id: string): Promise<any> {
    return await this.GET(`${this.RESOURCE}/${id}`);
  }

  async findAll(params: ISearchTranslate): Promise<any> {
    return await this.GET(`${this.RESOURCE}`, {
      query: params,
    });
  }
}

export default TranslateModule;
