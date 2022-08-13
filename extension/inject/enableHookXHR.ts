import MyXMLHttpRequest from "../utils/MyXMLHttpRequest";

(() => {
  // 保存原始XHR对象
  window.originalXMLHttpRequest = window.XMLHttpRequest;
  // Hook xhr
  window.XMLHttpRequest = MyXMLHttpRequest;
})();
