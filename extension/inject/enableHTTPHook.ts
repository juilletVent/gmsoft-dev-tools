import { MyXMLHttpRequest, myFetch } from "../utils/MyRequest";

(() => {
  if (!window.originalXMLHttpRequest) {
    // 保存原始XHR对象
    window.originalXMLHttpRequest = window.XMLHttpRequest;
  }
  // Hook xhr
  window.XMLHttpRequest = MyXMLHttpRequest;
  if (!window.originalFetch) {
    // 保存原始对象
    window.originalFetch = window.fetch;
  }
  // Hook fetch
  window.fetch = myFetch;

  if (window.__getConfig) {
    document.removeEventListener("receiveConfig", window.__getConfig);
  }
  window.__getConfig = function (e) {
    window.cookieConfig = e.detail.cookies;
    window.rulesConfig = e.detail.config;
  };
  document.addEventListener("receiveConfig", window.__getConfig);

  const event = new CustomEvent("requestConfig");
  document.dispatchEvent(event);
})();
