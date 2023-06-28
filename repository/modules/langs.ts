import HttpFactory from "../factory";

import { ILanguage, ILanguageCreate } from "~/types/languages.types";

class LangsModule extends HttpFactory {
  private RESOURCE = "/langs";

  async create(body: ILanguageCreate): Promise<any> {
    return await this.POST(`${this.RESOURCE}`, body);
  }

  async update(id: number, body: ILanguage): Promise<any> {
    return await this.PATCH(`${this.RESOURCE}/${id}`, body);
  }

  async delete(id: number): Promise<any> {
    return await this.DELETE(`${this.RESOURCE}/${id}`);
  }

  async findAll(): Promise<any> {
    return await this.GET(`${this.RESOURCE}`);
  }
}

export default LangsModule;
