import HttpFactory from "../factory";

class RolesModule extends HttpFactory {
  private RESOURCE = "/roles";

  async create(body: { value: string; description: string }): Promise<any> {
    return await this.POST(`${this.RESOURCE}`, {
      value: body.value,
      description: body.description,
    });
  }

  async update(
    name: string,
    body: { value: string; description: string }
  ): Promise<any> {
    return await this.PATCH(`${this.RESOURCE}/${name}`, {
      value: body.value,
      description: body.description,
    });
  }

  async delete(name: string): Promise<any> {
    return await this.DELETE(`${this.RESOURCE}/${name}`);
  }

  async findAll(): Promise<any> {
    return await this.GET(`${this.RESOURCE}`);
  }
}

export default RolesModule;
