import MyXMLHttpRequest from "../utils/MyXMLHttpRequest";
import Cookies from "js-cookie";

(() => {
  // 保存原始XHR对象
  window.originalXMLHttpRequest = window.XMLHttpRequest;
  // Hook xhr
  window.XMLHttpRequest = MyXMLHttpRequest;

  if (window.__getTargetCookie) {
    document.removeEventListener("receiveCookie", window.__getTargetCookie);
  }
  window.__getTargetCookie = function (e) {
    console.log("receiveCookie: ", e.detail.value);
    // Cookies.set("Auth", e.detail.value);
    // console.log("Cookies.get", Cookies.get("Auth"));

    window.cookieConfig = e.detail;
  };
  document.addEventListener("receiveCookie", window.__getTargetCookie);

  const event = new CustomEvent("requestCookie");
  document.dispatchEvent(event);
})();
