type Message<T = any> = {
  type: string;
  data?: T;
};
type Listener<T = any> = {
  (
    message: Message<T>,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: Message<T>) => void
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

  static addListener<T = any>(pListener: Listener<T>) {
    try {
      const listener: Listener<T> = (message, sender, sendResponse) => {
        let called = false;
        const responseCb = (message: Message<T>) => {
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
