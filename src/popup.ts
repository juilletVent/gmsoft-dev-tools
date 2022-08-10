const $container = document.getElementById("container");
const $tip = document.getElementById("tip");
const $config = document.getElementById("config");

document.addEventListener("DOMContentLoaded", () => {
  $container.onclick = function (ev) {
    const content = $container.textContent;
    navigator.clipboard.writeText(content);
    $tip.textContent = "(copied)";
    console.log("copied:", content);
    const background = chrome.extension.getBackgroundPage();
  };

  
  $config.onclick = () => {
    const url = `chrome-extension://${chrome.runtime.id}/options.html`;
    chrome.tabs.create({ url });
  };

  chrome.tabs.query(
    { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
    function (tabs) {
      const url = new URL(tabs[0].url);
      const host = url.host;

      const zcjshow = "www.gpwbeta.com";
      const targetCookies = {
        platformName: "zcjshow",
        domain: "www.gpwbeta.com",
        cookie: "xxxxx",
      };

      chrome.cookies.getAll(
        {
          domain: zcjshow,
        },
        (cookies) => {
          console.log("cookies: ", cookies);
          const cookiesStr = cookies
            .map((c) => c.name + "=" + c.value)
            .join(";");

          $container.textContent = cookiesStr;
        }
      );
    }
  );
});
