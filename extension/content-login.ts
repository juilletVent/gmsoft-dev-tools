const injectScript = document.createElement("script");
injectScript.dataset.enableApiHooks = "true";
injectScript.src = chrome.runtime.getURL("config/static/js/fillPwd.js");
document.documentElement.appendChild(injectScript);
