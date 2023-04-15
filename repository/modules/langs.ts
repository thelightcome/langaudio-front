import HttpFactory from "../factory";

import { ILanguage } from "~/types/languages.types";

class LangsModule extends HttpFactory {
  private RESOURCE = "/langs";

  async create(body: ILanguage): Promise<any> {
    return await this.POST(`${this.RESOURCE}`, body);
  }

  async update(code: string, body: ILanguage): Promise<any> {
    return await this.PATCH(`${this.RESOURCE}/${code}`, body);
  }

  async delete(code: string): Promise<any> {
    return await this.DELETE(`${this.RESOURCE}/${code}`);
  }

  async findAll(): Promise<any> {
    return await this.GET(`${this.RESOURCE}`);
  }

  async findAllWithSources(): Promise<any> {
    return await this.GET(`${this.RESOURCE}/with-source`);
  }
}

export default LangsModule;
