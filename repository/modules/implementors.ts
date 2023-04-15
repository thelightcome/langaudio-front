import HttpFactory from "../factory";

import {
  IImplementorCreate,
  ISearchImplementor,
} from "~/types/implementors.types";

class ImplementorModule extends HttpFactory {
  private RESOURCE = "/implementors";

  async create(body: IImplementorCreate): Promise<any> {
    return await this.POST(`${this.RESOURCE}`, body);
  }

  async update(id: number, body: IImplementorCreate): Promise<any> {
    return await this.PATCH(`${this.RESOURCE}/${id}`, body);
  }

  async verify(id: number, body: IImplementorCreate): Promise<any> {
    return await this.PATCH(`${this.RESOURCE}/verify/${id}`, body);
  }

  async delete(id: number): Promise<any> {
    return await this.DELETE(`${this.RESOURCE}/${id}`);
  }

  async findAll(
    params: ISearchImplementor = { offset: 0, limit: 10 }
  ): Promise<any> {
    return await this.GET(
      `${this.RESOURCE}/${params.isVerified ? "" : "verify"}`,
      {
        query: params,
      }
    );
  }
}

export default ImplementorModule;
