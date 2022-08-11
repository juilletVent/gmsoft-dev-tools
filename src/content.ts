(() => {
  chrome.runtime.sendMessage(
    { info: "Hello background - from content" },
    (res) => {
      console.log("content receive: ", res);
    }
  );

  var injectScript = document.createElement("script");
  injectScript.src = chrome.runtime.getURL("inject.js");

  (document.head || document.documentElement).appendChild(injectScript);
})();
