import HttpFactory from "../factory";

import { ITextForTranslate } from "~/types/google-api.types";

class GoogleApi extends HttpFactory {
  private RESOURCE = "/google";

  async translate(data: ITextForTranslate): Promise<any> {
    return await this.POST<any>(`${this.RESOURCE}`, data);
  }
}

export default GoogleApi;
