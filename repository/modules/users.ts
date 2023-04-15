import HttpFactory from "../factory";
import { ISearchUsers } from "~/types/users.types";

class UsersModule extends HttpFactory {
  private RESOURCE = "/users";

  async toggleRole(userId: string, value: string): Promise<any> {
    return await this.POST(`${this.RESOURCE}/toggle-role`, {
      userId,
      value,
    });
  }

  async delete(id: string): Promise<any> {
    return await this.DELETE(`${this.RESOURCE}/${id}`);
  }

  async findAll(query: ISearchUsers): Promise<any> {
    return await this.GET(`${this.RESOURCE}`, {
      query,
    });
  }
}

export default UsersModule;
