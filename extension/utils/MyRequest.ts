import Cookies from "js-cookie";
import { get, isEmpty, uniqueId } from "lodash";

class RequestManager {
  requestId: string;
  targetCookies: chrome.cookies.Cookie[];

  constructor() {
    this.requestId = `${Date.now()}${uniqueId()}`;
    this.targetCookies = [];
  }

  prepareCookie(url: string) {
    const cookiesConfig: chrome.cookies.Cookie[] = window.cookieConfig || [];
    const matchRules = get(window, "rulesConfig.rules", []).filter((rule) => {
      let match = false;
      (rule.pattern || []).forEach((pattern) => {
        if (url.includes(pattern)) {
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
  }

  injectCookie() {
    this.targetCookies.map((cookie) => {
      Cookies.set(cookie.name, cookie.value);
    });
  }
  clearCookie() {
    // 移除注入的Cookie
    this.targetCookies.map((cookie) => {
      Cookies.remove(cookie.name);
    });
  }
  clearId() {
    window.__myxhrsending = window.__myxhrsending.filter(
      (i) => i !== this.requestId
    );
  }
  sendRecover() {
    // 触发后续接口调用
    const event = new CustomEvent("recoverSend");
    window.dispatchEvent(event);
  }

  replaceParams(url: string) {
    const [path, originalSearchStr] = url.split("?");
    const matchRules = get(window, "rulesConfig.rules", []).filter((rule) => {
      let match = false;
      (rule.pattern || []).forEach((pattern) => {
        if (url.includes(pattern)) {
          match = true;
        }
      });
      return match;
    });
    // 目标替换规则
    const targetReplaceRules = get(matchRules, "[0].replaceParams", []);
    if (originalSearchStr) {
      let tempSearchStr = originalSearchStr;
      targetReplaceRules.forEach((replaceRule) => {
        const [patternRegexStr, valStr] = replaceRule.split("#$$#");
        try {
          if (patternRegexStr && valStr) {
            tempSearchStr = tempSearchStr.replace(
              new RegExp(patternRegexStr, "g"),
              valStr
            );
          }
        } catch (error) {
          // 异常静默失败，直接跳过
          console.warn(
            "Config for params replace is invalid, patternRegexStr: %s,valStr: %s",
            patternRegexStr,
            valStr
          );
        }
      });
      return `${path}?${tempSearchStr}`;
    }
    return path;
  }
}

class MyXMLHttpRequest extends XMLHttpRequest {
  manager: RequestManager;

  constructor() {
    super();
    this.manager = new RequestManager();
  }

  open(...args: any[]) {
    this.manager.prepareCookie(args[1]);
    args[1] = this.manager.replaceParams(args[1]);
    // @ts-ignore
    return super.open(...args);
  }

  /**
   * 关于send方法：此方法会将所有接口串行化，保证Cookie的正确性
   * 每个接口调用在初始化时创建了一个唯一标识requestId，接口调用开始时，会将此ID push到window.__myxhrsending
   * 当接口调用完成时，会将requestId从window.__myxhrsending中移除，并发送recoverSend事件，如果出现并发调用，
   * 后续接口调用会暂缓执行，并注册recoverSend事件，recoverSend触发时，如果__myxhrsending中的首位id为当
   * 前id，则执行接口调用，以上就是整个接口串行化调用的实现原理
   */
  send(body: any) {
    // 请求结束后，清空本轮注入的Cookie，清理请求ID队列，发送recoverSend事件
    const finishCallback = () => {
      this.manager.clearCookie();
      this.manager.clearId();
      this.manager.sendRecover();
    };

    // 如果当前请求ID队列不为空，则暂缓执行，并将当前请求ID推入请求ID队列，并注册recoverSend事件
    if (window.__myxhrsending && !isEmpty(window.__myxhrsending)) {
      window.__myxhrsending.push(this.manager.requestId);
      const recoverCallback = () => {
        if (window.__myxhrsending[0] === this.manager.requestId) {
          this.manager.injectCookie();
          this.addEventListener("loadend", finishCallback);
          window.removeEventListener("recoverSend", recoverCallback);
          super.send(body);
        }
      };
      window.addEventListener("recoverSend", recoverCallback);
      return;
    }

    // 如果当前请求ID队列为空，则直接执行接口调用
    window.__myxhrsending = window.__myxhrsending || [];
    window.__myxhrsending.push(this.manager.requestId);
    this.manager.injectCookie();
    this.addEventListener("loadend", finishCallback);
    return super.send(body);
  }
}

/**
 * fetch方法的拦截，流程与XHRHTTPRequest相同，Promise写法，更好理解
 */
function myFetch(
  input: URL | RequestInfo,
  init?: RequestInit
): Promise<Response> {
  const requestManager = new RequestManager();
  const finishCallback = () => {
    requestManager.clearCookie();
    requestManager.clearId();
    requestManager.sendRecover();
  };
  requestManager.prepareCookie(input.toString());
  const process = new Promise<void>((resolve) => {
    if (window.__myxhrsending && !isEmpty(window.__myxhrsending)) {
      window.__myxhrsending.push(requestManager.requestId);
      if (init.signal) {
        init.signal.addEventListener("abort", () => {
          window.__myxhrsending = window.__myxhrsending.filter(
            (i) => i !== requestManager.requestId
          );
        });
      }
      const recoverCallback = () => {
        if (window.__myxhrsending[0] === requestManager.requestId) {
          requestManager.injectCookie();
          window.removeEventListener("recoverSend", recoverCallback);
          resolve();
        }
      };
      window.addEventListener("recoverSend", recoverCallback);
      return;
    }
    window.__myxhrsending = window.__myxhrsending || [];
    window.__myxhrsending.push(requestManager.requestId);
    requestManager.injectCookie();
    resolve();
  })
    .then(() =>
      window.originalFetch(requestManager.replaceParams(input.toString()), init)
    )
    .then(
      (response) => {
        finishCallback();
        return response;
      },
      (err) => {
        finishCallback();
        throw err;
      }
    );
  return process;
}

export { myFetch, MyXMLHttpRequest };
