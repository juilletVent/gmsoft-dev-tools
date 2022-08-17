import MessageUtils from "./utils/message";

/** 功能管理板块相关事件Payload */
type SwitchEventData = {
  open: boolean;
  target: string;
};
type GetCookieEventData = {
  cookieKeys: string[];
  domains: string[];
};
/** 获取Cookie响应的数据模型 */
type GetCookieEventResonseData = chrome.cookies.Cookie[];

/** 聚合相关类型 */
type MessagePayloadType = SwitchEventData | GetCookieEventData;
type MessageResponsePayloadType = GetCookieEventResonseData;

function isSwitchEventData(data: MessagePayloadType): data is SwitchEventData {
  return (data as SwitchEventData).open !== undefined;
}
function isGetCookieEventData(
  data: MessagePayloadType
): data is GetCookieEventData {
  return (data as GetCookieEventData).cookieKeys !== undefined;
}

function getCookie(name: string) {
  return new Promise<chrome.cookies.Cookie[]>((resolve) => {
    chrome.cookies.getAll({}, (cookie) => {
      const namePattern = new RegExp(name);
      const cookies = cookie.filter((c) => namePattern.test(c.name));
      resolve(cookies);
    });
  });
}

MessageUtils.addListener<MessagePayloadType, MessageResponsePayloadType>(
  (message, sender, sendResponse) => {
    const data = message.data;
    if (message.type === "switch" && isSwitchEventData(data)) {
      chrome.tabs.query(
        { active: true, lastFocusedWindow: true },
        function (tabs) {
          if (tabs[0] && tabs[0].id) {
            chrome.tabs.sendMessage(tabs[0].id, {
              type: data.open ? "hooked" : "unhooked",
            });
          }
          sendResponse({ type: "done" });
        }
      );
      return true;
    }
    if (message.type === "getCookie" && isGetCookieEventData(data)) {
      const cookies: chrome.cookies.Cookie[] = [];
      let chain = Promise.resolve();

      data.cookieKeys.forEach((cookieKey) => {
        chain = chain
          .then(() => getCookie(cookieKey))
          .then(
            (cookie) => {
              if (cookie) {
                cookie.forEach((c) => {
                  if (data.domains.includes(c.domain)) {
                    cookies.push(c);
                  }
                });
              }
            },
            () => {}
          );
      });

      chain.then(() => {
        sendResponse({ type: "done", data: cookies });
      });

      return true;
    }
  }
);
