import HttpFactory from "../factory";

export interface UserAuthDto {
  email: string;
  password: string;
}

export interface UserVerifyDto {
  token: string;
  password: string;
}

export interface UserEmailDto {
  email: string;
}

export interface UserRefreshDto {
  password: string;
  token: string;
}

export interface ITokenDto {
  access_token: string;
  refresh_token: string;
}

class AuthModule extends HttpFactory {
  private RESOURCE = "/auth";

  async signup(credentials: UserAuthDto): Promise<any> {
    return await this.POST<any>(`${this.RESOURCE}/signup`, credentials);
  }

  async verify(credentials: UserVerifyDto): Promise<any> {
    return await this.POST<any>(`${this.RESOURCE}/verify`, credentials);
  }

  async signin(credentials: UserAuthDto): Promise<any> {
    return await this.POST<any>(`${this.RESOURCE}/signin`, credentials);
  }

  async sendLink(credentials: UserEmailDto): Promise<any> {
    return await this.POST<any>(`${this.RESOURCE}/send-link`, credentials);
  }

  async refresh(credentials: UserRefreshDto): Promise<any> {
    return await this.POST<any>(`${this.RESOURCE}/refresh`, credentials);
  }

  async getRefresh(token: { access_token: string }): Promise<any> {
    return await this.POST<any>(`${this.RESOURCE}/getRefreshToken`, token);
  }
}

export type TypeKeysAuth = keyof AuthModule;

export default AuthModule;
