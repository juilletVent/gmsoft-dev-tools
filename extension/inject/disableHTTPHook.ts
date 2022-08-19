(() => {
  // 恢复原始XHR对象
  window.XMLHttpRequest = window.originalXMLHttpRequest;
  // 恢复原始fetch对象
  window.fetch = window.originalFetch;
})();
