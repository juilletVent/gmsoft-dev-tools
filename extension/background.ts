import MessageUtils from "./utils/message";

/** 功能管理板块相关事件Payload */
type SwitchEventData = {
  open: boolean;
  target: string;
};
/** 获取Cookie响应的数据模型 */
type GetCookieEventResonseData = chrome.cookies.Cookie;

/** 聚合相关类型 */
type MessagePayloadType = SwitchEventData;
type MessageResponsePayloadType = GetCookieEventResonseData;

MessageUtils.addListener<MessagePayloadType, MessageResponsePayloadType>(
  (message, sender, sendResponse) => {
    if (message.type === "switch") {
      chrome.tabs.query(
        { active: true, lastFocusedWindow: true },
        function (tabs) {
          if (tabs[0] && tabs[0].id) {
            chrome.tabs.sendMessage(tabs[0].id, {
              type: message.data.open ? "hooked" : "unhooked",
            });
          }
          sendResponse({ type: "done" });
        }
      );
      return true;
    }
    if (message.type === "getCookie") {
      chrome.cookies.getAll(
        {
          domain: "www.gpwbeta.com",
        },
        (cookies) => {
          const targetCookie = cookies.find((c) => c.name === "Auth");
          sendResponse({ type: "done", data: targetCookie });
        }
      );
      return true;
    }
  }
);
