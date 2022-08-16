import MyXMLHttpRequest from "../utils/MyXMLHttpRequest";

(() => {
  if (!window.originalXMLHttpRequest) {
    // 保存原始XHR对象
    window.originalXMLHttpRequest = window.XMLHttpRequest;
  }
  // Hook xhr
  window.XMLHttpRequest = MyXMLHttpRequest;

  if (window.__getTargetCookie) {
    document.removeEventListener("receiveCookie", window.__getTargetCookie);
  }
  window.__getTargetCookie = function (e) {
    window.cookieConfig = e.detail;
  };
  document.addEventListener("receiveCookie", window.__getTargetCookie);
  const event = new CustomEvent("requestCookie");
  document.dispatchEvent(event);
})();
