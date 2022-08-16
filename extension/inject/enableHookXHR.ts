import MyXMLHttpRequest from "../utils/MyXMLHttpRequest";

(() => {
  if (!window.originalXMLHttpRequest) {
    // 保存原始XHR对象
    window.originalXMLHttpRequest = window.XMLHttpRequest;
  }
  // Hook xhr
  window.XMLHttpRequest = MyXMLHttpRequest;

  if (window.__getConfig) {
    document.removeEventListener("receiveConfig", window.__getConfig);
  }
  window.__getConfig = function (e) {
    window.cookieConfig = e.detail;
  };
  document.addEventListener("receiveConfig", window.__getConfig);

  const event = new CustomEvent("requestConfig");
  document.dispatchEvent(event);
})();
