chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("background receive: ", message);
  sendResponse({ info: "Hello content - from background" });
});
