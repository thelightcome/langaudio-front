import HttpFactory from "../factory";

import { ICountry } from "~/types/countries.types";

class CountryModule extends HttpFactory {
  private RESOURCE = "/countries";

  async create(body: ICountry): Promise<any> {
    return await this.POST(`${this.RESOURCE}`, body);
  }

  async update(name: string, body: ICountry): Promise<any> {
    return await this.PATCH(`${this.RESOURCE}/${name}`, body);
  }

  async delete(name: string): Promise<any> {
    return await this.DELETE(`${this.RESOURCE}/${name}`);
  }

  async findAll(): Promise<any> {
    return await this.GET(`${this.RESOURCE}`);
  }
}

export default CountryModule;
