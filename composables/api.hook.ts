import { $fetch, FetchOptions } from "ohmyfetch";

import repository from "~/repository";

export function useApiHook() {
  const { $auth, $config } = useNuxtApp();

  const fetchOptions: FetchOptions = {
    baseURL: $config.baseURL,
    onRequest({ options }) {
      options.headers = {
        ...(options.headers ? options.headers : {}),
        ...($auth.tokenData.access_token
          ? { Authorization: `Bearer ${$auth.tokenData.access_token}` }
          : {}),
      };
    },
  };

  const apiFetcher = $fetch.create(fetchOptions);

  const $api = repository(apiFetcher);

  return $api;
}
