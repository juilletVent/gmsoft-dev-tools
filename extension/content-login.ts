import { ExtensionsStorageUtils } from "./utils/storage";

(() => {
  async function injectPwdConfig() {
    const { pwdList = [] } = await ExtensionsStorageUtils.getConfig();
    document.addEventListener("requestPwd", () => {
      const event = new CustomEvent("receivePwd", {
        detail: {
          pwdList,
        },
      });
      document.dispatchEvent(event);
    });
  }

  function injectPwdJs() {
    const injectScript = document.createElement("script");
    injectScript.dataset.enableApiHooks = "true";
    injectScript.src = chrome.runtime.getURL("config/static/js/fillPwd.js");
    document.documentElement.appendChild(injectScript);
  }

  injectPwdConfig().then(injectPwdJs);
})();
