import { $Fetch } from "ohmyfetch";

class HttpFactory {
  private $fetch: $Fetch;

  constructor(fetcher: $Fetch) {
    this.$fetch = fetcher;
  }

  async CALL<T>(
    method: string,
    url: string,
    data?: null | object,
    extras = {}
  ): Promise<T> {
    return await this.$fetch(url, {
      method,
      ...(data && { body: data }),
      ...extras,
    });
  }

  async GET<T>(url: string, extras = {}): Promise<T> {
    return await this.CALL<T>("GET", url, null, extras);
  }

  async POST<T>(url: string, data?: object, extras = {}): Promise<T> {
    return await this.CALL<T>("POST", url, data, extras);
  }

  async PATCH<T>(url: string, data?: object, extras = {}): Promise<T> {
    return await this.CALL<T>("PATCH", url, data, extras);
  }

  async DELETE<T>(url: string, extras = {}): Promise<T> {
    return await this.CALL<T>("DELETE", url, null, extras);
  }
}

export default HttpFactory;
