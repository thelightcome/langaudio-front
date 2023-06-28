export default defineNuxtPlugin(() => {
  const options = reactive({
    ready: false,
  });
  let scriptUrl =
    "https://www.youtube.com/s/player/8c7583ff/www-widgetapi.vflset/www-widgetapi.js";
  window.yt_embedsEnableHouseBrandAndYtCoexistence = true;
  try {
    const ttPolicy = window.trustedTypes.createPolicy("youtube-widget-api", {
      createScriptURL: (x) => x,
    });
    scriptUrl = ttPolicy.createScriptURL(scriptUrl);
  } catch (e) {}
  if (!window.YT) window.YT = { loading: 0, loaded: 0 };
  if (!window.YTConfig) window.YTConfig = { host: "https://www.youtube.com" };
  if (!window.YT.loading) {
    window.YT.loading = 1;
    (function () {
      const l = [];
      window.YT.ready = function (f) {
        if (window.YT.loaded) {
          f();
        } else l.push(f);
      };
      window.onYTReady = function () {
        window.YT.loaded = 1;
        options.ready = true;
        let i = 0;
        for (; i < l.length; i++)
          try {
            l[i]();
          } catch (e$0) {}
      };
      window.YT.setConfig = function (c) {
        let k;
        for (k in c) if (c.hasOwnProperty(k)) window.YTConfig[k] = c[k];
      };
      const a = document.createElement("script");
      a.type = "text/javascript";
      a.id = "www-widgetapi-script";
      a.src = scriptUrl;
      a.async = true;
      const c = document.currentScript;
      if (c) {
        const n = c.nonce || c.getAttribute("nonce");
        if (n) a.setAttribute("nonce", n);
      }
      const b = document.getElementsByTagName("script")[0];
      b.parentNode.insertBefore(a, b);
    })();
  }

  return {
    provide: {
      youtubeApi: {
        options,
      },
    },
  };
});
