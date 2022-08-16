type Message<T = any> = {
  type: string;
  data?: T;
};
type Listener<T1 = any, T2 = any> = {
  (
    message: Message<T1>,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: Message<T2>) => void
  ): void | boolean;
};

class MessageUtils {
  static sendMessage<T = any>(message: Message<T>) {
    try {
      chrome.runtime.sendMessage(message);
    } catch (error) {
      // 静默失败
    }
  }

  static addListener<T1 = any, T2 = any>(pListener: Listener<T1, T2>) {
    try {
      const listener: Listener<T1, T2> = (message, sender, sendResponse) => {
        let called = false;
        const responseCb = (message: Message<T2>) => {
          // 调用过，打上调用标记
          called = true;
          sendResponse(message);
        };
        const result = pListener(message, sender, responseCb);
        // 如果没有调用过且返回值不是true，则调用默认的responseCb
        if (!called && result !== true) {
          sendResponse({
            type: "done",
          });
          return;
        }
        // 已经调用过，或者返回值是true，则不再调用默认的responseCb
        if (result) {
          return true;
        }
      };
      chrome.runtime.onMessage.addListener(listener);
    } catch (error) {
      // 静默失败
    }
  }
}

export default MessageUtils;
