chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("message: ", message);
  if (message.type === "switch") {
    chrome.tabs.query(
      { active: true, lastFocusedWindow: true },
      function (tabs) {
        if (tabs[0] && tabs[0].id) {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: message.val ? "hooked" : "unhooked",
          });
        }
      }
    );
    return true;
  }
  sendResponse({ type: "done" });
});
