import { ExtensionsStorageUtils } from "./utils/storage";

(() => {
  function removeNode(selector) {
    const node = document.querySelector(selector);
    if (node) {
      node.parentNode.removeChild(node);
    }
  }

  function enableApiHooks() {
    const injectScript = document.createElement("script");
    injectScript.dataset.enableApiHooks = "true";
    injectScript.src = chrome.runtime.getURL("enableHTTPHook.js");
    document.documentElement.appendChild(injectScript);
    removeNode("script[data-disable-api-hooks]");
  }
  function disableApiHooks() {
    const injectScript = document.createElement("script");
    injectScript.dataset.disableApiHooks = "true";
    injectScript.src = chrome.runtime.getURL("disableHTTPHook.js");
    document.documentElement.appendChild(injectScript);
    removeNode("script[data-enable-api-hooks]");
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "hooked") {
      enableApiHooks();
    }
    if (message.type === "unhooked") {
      disableApiHooks();
    }
    sendResponse({ type: "done" });
  });

  document.addEventListener("requestConfig", () => {
    ExtensionsStorageUtils.getConfig().then((config) => {
      let cookieKeys: string[] = [];
      let domains: string[] = [];

      const currentConfig = config.configs.find((c) => c.key === config.target);
      if (currentConfig) {
        cookieKeys = currentConfig.cookiesPettern;
        domains = currentConfig.rules.map((i) => i.domain);
      }

      chrome.runtime.sendMessage(
        {
          type: "getCookie",
          data: {
            cookieKeys,
            domains,
          },
        },
        (response) => {
          const event = new CustomEvent("receiveConfig", {
            detail: {
              cookies: response.data,
              config: currentConfig,
            },
          });
          document.dispatchEvent(event);
        }
      );
    });
  });

  ExtensionsStorageUtils.getConfig().then((config) => {
    if (config.open) {
      enableApiHooks();
    }
  });
})();
