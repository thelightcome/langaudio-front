import { UnwrapNestedRefs } from "nuxt/dist/app/compat/capi";

export interface ITokenData {
  access_token: string;
  refresh_token: string;
  refresh_exp_time: number;
}

export interface IToken extends ITokenData {
  refresh_init_time: number;
}

export interface IJwtInfo {
  iat: number;
  exp: number;
}

export interface IJwtData {
  id: string;
  email: string;
  roles: string[];
}

export type ITokenDataDunc = (data: ITokenData) => Promise<ITokenData>;

export interface ITimerData {
  id: null | ReturnType<typeof setTimeout>;
  time: number;
  counter: number;
}

const paths = {
  logged: "/",
  logout: "/",
};

enum TOKEN_NAMES {
  ACCESS = "access_token",
  REFRESH = "refresh_token",
  EXP_TIME = "refresh_exp_time",
  INIT_TIME = "refresh_init_time",
}

export default defineNuxtPlugin((_) => {
  const $router = useRouter();

  let refreshTokenApiFunc: ITokenDataDunc =
    (async () => {}) as unknown as ITokenDataDunc;

  const tokenData = reactive<IToken>({
    access_token: "",
    refresh_token: "",
    refresh_exp_time: 0,
    refresh_init_time: 0,
  });

  const isLoggedIn = computed(() => {
    return !!tokenData.access_token;
  });

  const timerData = reactive<ITimerData>({
    id: null,
    time: 0,
    counter: 0,
  });

  watch(
    () => timerData.counter,
    () => timerWatchFunc()
  );

  const user = reactive<{ value: any }>({
    value: null,
  });

  function setUserData(accessToken: string) {
    const userData = parseJWTtoken<IJwtData>(accessToken);
    if (!userData) return;
    user.value = Object.keys(userData).reduce((acc, key) => {
      if (key === "iat" || key === "exp") return acc;
      // @ts-ignore
      if (userData[key]) acc[key] = userData[key];
      return acc;
    }, {});
  }

  async function wrapEndpoint(func: Function) {
    const data = await func();
    setTokenData(data);
    $router.push(paths.logged);
    return data;
  }

  function setRefreshApi(func: ITokenDataDunc) {
    refreshTokenApiFunc = func;
  }

  const MAX_TIMER_COUNT = 10;
  let timerWatchFuncCount = 0;
  function timerWatchFunc() {
    timerData.id = setTimeout(async () => {
      const data = await refreshTokenApiFunc(tokenData);
      if (!data)
        if (timerWatchFuncCount < MAX_TIMER_COUNT)
          setTimeout(() => {
            timerWatchFuncCount += 1;
            timerWatchFunc();
          }, 100);
        else throw new Error("Auth Module can't get token data from api");
      else setTokenData(data);
    }, timerData.time * 1000);
  }

  function setTimerToken(token: IToken) {
    if (timerData.id !== null) {
      clearTimeout(timerData.id);
      timerData.id = null;
    }
    const jwtInfo = parseJWTtoken(token.access_token);
    if (!jwtInfo) return;
    const expMin = (new Date().getTime() - token.refresh_init_time) / 1000;
    const exp = jwtInfo.exp - jwtInfo.iat;
    const time = exp > expMin ? exp - expMin : 0;
    timerData.counter += 1;
    timerData.time = time;
  }

  function logout() {
    clearTokenDataWrap(tokenData);
    $router.push(paths.logout);
    if (timerData.id !== null) {
      clearTimeout(timerData.id);
      timerData.id = null;
    }
  }

  function setTokenData(data: any) {
    const parseTokenData = checkAndParseToken(data);
    if (!parseTokenData) return;
    if (checkRefreshTokenExpire(parseTokenData)) return logout();
    setTokenDataWrap(parseTokenData, tokenData);
    setUserData(parseTokenData.access_token);
    setTimerToken(parseTokenData);
  }

  setTokenData(getTokenDataWrap(tokenData));

  return {
    provide: {
      auth: {
        wrapEndpoint,
        logout,
        setRefreshApi,
        isLoggedIn,
        tokenData,
        user,
      },
    },
  };
});

function checkRefreshTokenExpire(token: IToken) {
  return (
    token.refresh_init_time + token.refresh_exp_time * 1000 <
    new Date().getTime()
  );
}
let access = "";
let value: any = null;
function parseJWTtoken<T>(accessToken: string): (T & IJwtInfo) | null {
  try {
    if (access === accessToken) return value;
    const jwtInfo = JSON.parse(
      window && window.Buffer
        ? (Buffer.from(accessToken.split(".")[1], "base64") as any)
        : atob(accessToken.split(".")[1])
    ) as T & IJwtInfo;
    if (!jwtInfo.iat || !jwtInfo.exp) return null;
    access = accessToken;
    value = jwtInfo;
    return jwtInfo;
  } catch (_) {
    return null;
  }
}

function isValidTokenData(data: any): boolean {
  if (!data || !data.access_token || !data.refresh_token) return false;
  if (!parseJWTtoken(data.access_token)) return false;
  return true;
}

function checkAndParseToken(data: any): null | IToken {
  if (!isValidTokenData(data)) return null;
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    refresh_exp_time: Number(data.refresh_exp_time),
    refresh_init_time:
      data.refresh_init_time === undefined
        ? new Date().getTime()
        : Number(data.refresh_init_time),
  };
}

function setTokenDataWrap(data: IToken, reactive: UnwrapNestedRefs<IToken>) {
  setTokenDataToReactive(data, reactive);
  setTokenDataToCookie(data);
  setTokenDataToLocalStorage(data);
}

function clearTokenDataWrap(reactive: UnwrapNestedRefs<IToken>) {
  clearTokenDataFromReactive(reactive);
  clearTokenDataFromCookie();
  clearTokenDataLocalStorage();
}

function getTokenDataWrap(reactive: UnwrapNestedRefs<IToken>): null | IToken {
  return (
    getTokenDataFromReactive(reactive) ||
    getTokenDataFromLocalStorage() ||
    getTokenDataFromCookie()
  );
}

function setTokenDataToReactive(
  data: IToken,
  reactive: UnwrapNestedRefs<IToken>
) {
  reactive.access_token = data.access_token;
  reactive.refresh_token = data.refresh_token;
  reactive.refresh_exp_time = data.refresh_exp_time;
  reactive.refresh_init_time = data.refresh_init_time;
}

function clearTokenDataFromReactive(reactive: UnwrapNestedRefs<IToken>) {
  reactive.access_token = "";
  reactive.refresh_token = "";
  reactive.refresh_exp_time = 0;
  reactive.refresh_init_time = 0;
}

function getTokenDataFromReactive(
  reactive: UnwrapNestedRefs<IToken>
): null | IToken {
  const tokenData = {
    access_token: reactive.access_token,
    refresh_token: reactive.refresh_token,
    refresh_exp_time: reactive.refresh_exp_time,
    refresh_init_time: reactive.refresh_init_time,
  };

  if (
    !(
      tokenData.access_token &&
      tokenData.refresh_token &&
      tokenData.refresh_exp_time &&
      tokenData.refresh_init_time
    )
  )
    return null;

  return tokenData;
}

function setTokenDataToCookie(data: IToken) {
  useCookie(TOKEN_NAMES.ACCESS).value = data.access_token;
  useCookie(TOKEN_NAMES.REFRESH).value = data.refresh_token;
  useCookie(TOKEN_NAMES.EXP_TIME).value = String(data.refresh_exp_time);
  useCookie(TOKEN_NAMES.INIT_TIME).value = String(data.refresh_init_time);
}

function clearTokenDataFromCookie() {
  useCookie(TOKEN_NAMES.ACCESS).value = "";
  useCookie(TOKEN_NAMES.REFRESH).value = "";
  useCookie(TOKEN_NAMES.EXP_TIME).value = "";
  useCookie(TOKEN_NAMES.INIT_TIME).value = "";
}

function getTokenDataFromCookie(): null | IToken {
  const tokenData = {
    access_token: useCookie(TOKEN_NAMES.ACCESS).value || "",
    refresh_token: useCookie(TOKEN_NAMES.REFRESH).value || "",
    refresh_exp_time: Number(useCookie(TOKEN_NAMES.EXP_TIME).value),
    refresh_init_time: Number(useCookie(TOKEN_NAMES.INIT_TIME).value),
  };

  if (
    !(
      tokenData.access_token &&
      tokenData.refresh_token &&
      tokenData.refresh_exp_time &&
      tokenData.refresh_init_time
    )
  )
    return null;

  return tokenData;
}

function setTokenDataToLocalStorage(data: IToken) {
  if (!process.client) return;
  localStorage.setItem(TOKEN_NAMES.ACCESS, data.access_token);
  localStorage.setItem(TOKEN_NAMES.REFRESH, data.refresh_token);
  localStorage.setItem(TOKEN_NAMES.EXP_TIME, String(data.refresh_exp_time));
  localStorage.setItem(TOKEN_NAMES.INIT_TIME, String(data.refresh_init_time));
}

function clearTokenDataLocalStorage() {
  if (!process.client) return null;
  localStorage.removeItem(TOKEN_NAMES.ACCESS);
  localStorage.removeItem(TOKEN_NAMES.REFRESH);
  localStorage.removeItem(TOKEN_NAMES.EXP_TIME);
  localStorage.removeItem(TOKEN_NAMES.INIT_TIME);
}

function getTokenDataFromLocalStorage(): null | IToken {
  if (!process.client) return null;

  const tokenData = {
    access_token: localStorage.getItem(TOKEN_NAMES.ACCESS) || "",
    refresh_token: localStorage.getItem(TOKEN_NAMES.REFRESH) || "",
    refresh_exp_time: Number(localStorage.getItem(TOKEN_NAMES.EXP_TIME)),
    refresh_init_time: Number(localStorage.getItem(TOKEN_NAMES.INIT_TIME)),
  };

  if (
    !(
      tokenData.access_token &&
      tokenData.refresh_token &&
      tokenData.refresh_exp_time &&
      tokenData.refresh_init_time
    )
  )
    return null;

  return tokenData;
}
