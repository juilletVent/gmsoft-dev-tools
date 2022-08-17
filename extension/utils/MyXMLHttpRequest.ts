import Cookies from "js-cookie";
import { get, isEmpty, uniqueId } from "lodash";

class MyXMLHttpRequest extends XMLHttpRequest {
  requestId: string;
  targetCookies: chrome.cookies.Cookie[];
  constructor() {
    super();
    this.requestId = `${Date.now()}${uniqueId()}`;
    this.targetCookies = [];
  }

  open(...args: any[]) {
    const cookiesConfig: chrome.cookies.Cookie[] = window.cookieConfig || [];
    const matchRules = get(window, "rulesConfig.rules", []).filter((rule) => {
      let match = false;
      (rule.pattern || []).forEach((pattern) => {
        if (args[1].includes(pattern)) {
          match = true;
        }
      });
      return match;
    });
    const targetDomain = get(matchRules, "[0].domain");
    const targetCookies = cookiesConfig.filter(
      (cookie) => cookie.domain === targetDomain
    );
    this.targetCookies = targetCookies;
    // @ts-ignore
    return super.open(...args);
  }

  /**
   * 关于send方法：此方法会将所有接口串行化，保证Cookie的正确性
   * 每个接口调用在初始化时创建了一个唯一标识requestId，接口调用开始时，会将此ID push到window.__myxhrsending
   * 当接口调用完成时，会将requestId从window.__myxhrsending中移除，并发送recoverSendXHR事件，如果出现并发调用，
   * 后续接口调用会暂缓执行，并注册recoverSendXHR事件，recoverSendXHR触发时，如果__myxhrsending中的首位id为当
   * 前id，则执行接口调用，以上就是整个接口串行化调用的实现原理
   */
  send(body: any) {
    if (window.__myxhrsending && !isEmpty(window.__myxhrsending)) {
      window.__myxhrsending.push(this.requestId);
      const recoverCallback = () => {
        if (window.__myxhrsending[0] === this.requestId) {
          this.targetCookies.map((cookie) => {
            Cookies.set(cookie.name, cookie.value);
          });
          this.addEventListener("loadend", this.sendReciver.bind(this));
          window.removeEventListener("recoverSendXHR", recoverCallback);
          super.send(body);
        }
      };
      window.addEventListener("recoverSendXHR", recoverCallback);
      return;
    }
    window.__myxhrsending = window.__myxhrsending || [];
    window.__myxhrsending.push(this.requestId);
    this.targetCookies.map((cookie) => {
      Cookies.set(cookie.name, cookie.value);
    });
    this.addEventListener("loadend", this.sendReciver.bind(this));
    return super.send(body);
  }

  sendReciver() {
    // 移除注入的Cookie
    this.targetCookies.map((cookie) => {
      Cookies.remove(cookie.name);
    });
    // 移除队列中的当前requestId
    window.__myxhrsending = window.__myxhrsending.filter(
      (i) => i !== this.requestId
    );
    // 触发后续接口调用
    const event = new CustomEvent("recoverSendXHR");
    window.dispatchEvent(event);
  }
}

export default MyXMLHttpRequest;
