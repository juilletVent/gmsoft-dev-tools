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
    injectScript.src = chrome.runtime.getURL("enableHookXHR.js");
    document.documentElement.appendChild(injectScript);
    removeNode("script[data-disable-api-hooks]");
  }
  function disableApiHooks() {
    const injectScript = document.createElement("script");
    injectScript.dataset.disableApiHooks = "true";
    injectScript.src = chrome.runtime.getURL("disableHookXHR.js");
    document.documentElement.appendChild(injectScript);
    removeNode("script[data-enable-api-hooks]");
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("message: ", message);
    if (message.type === "hooked") {
      enableApiHooks();
    }
    if (message.type === "unhooked") {
      disableApiHooks();
    }
    sendResponse({ type: "done" });
  });

  ExtensionsStorageUtils.getConfig().then((config) => {
    if (config.open) {
      enableApiHooks();
    }
  });

  document.addEventListener("gmsoftDevEvent", (e: any) => {
    console.log("e: ", e);
    chrome.runtime.sendMessage({ type: "request", data: e.detail });
  });
})();
