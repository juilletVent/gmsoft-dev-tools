import Cookies from "js-cookie";
import { get, isEmpty, uniqueId } from "lodash";

class RequestManager {
  requestId: string;
  targetCookies: chrome.cookies.Cookie[];
  finished: boolean;

  constructor() {
    this.requestId = `${Date.now()}${uniqueId()}`;
    this.targetCookies = [];
    this.finished = false;
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
      // Auth是特殊Cookie，不需要注入，使用Header的方式注入
      if (cookie.name === "Auth") {
        return;
      }
      Cookies.set(cookie.name, cookie.value);
    });
  }

  injectAuthHeader(xhr: RequestInit): RequestInit;
  injectAuthHeader(xhr: MyXMLHttpRequest): void;
  injectAuthHeader(xhr: MyXMLHttpRequest | RequestInit): RequestInit {
    // XHR对象和fetch对象的Header设置方式不同，分别处理
    if (xhr instanceof MyXMLHttpRequest) {
      for (const cookie of this.targetCookies) {
        if (cookie.name === "Auth") {
          xhr.setRequestHeader("Authorization", `Auth ${cookie.value}`);
          break;
        }
      }
      return;
    }

    const initObj = xhr as RequestInit;
    const headers = initObj.headers || {};
    for (const cookie of this.targetCookies) {
      if (cookie.name === "Auth") {
        headers["Authorization"] = `Auth ${cookie.value}`;
        break;
      }
    }
    initObj.headers = headers;
    return initObj;
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
  done() {
    if (!this.finished) {
      this.clearCookie();
      this.clearId();
      this.sendRecover();
      this.finished = true;
    }
  }
  startCountDown() {
    setTimeout(this.done.bind(this), 3000);
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
    const result = super.open(...args);
    // 设置Header，setRequestHeader必须在open之后，send之前调用，因此插入在此位置
    this.manager.injectAuthHeader(this);
    return result;
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
    const finishCallback = () => this.manager.done();

    // 如果当前请求ID队列不为空，则暂缓执行，并将当前请求ID推入请求ID队列，并注册recoverSend事件
    if (window.__myxhrsending && !isEmpty(window.__myxhrsending)) {
      window.__myxhrsending.push(this.manager.requestId);
      const recoverCallback = () => {
        if (window.__myxhrsending[0] === this.manager.requestId) {
          this.manager.injectCookie();
          // 启动超时定时器，如果未能在3000ms内得到响应，则不再等待，启动后续流程
          this.manager.startCountDown();
          // 订阅请求完成，完成后启动后续调用流程
          this.addEventListener("loadend", finishCallback);
          // 移除自定义事件监听，已经触发了后续流程，当前事件处理程序已经完成他的使命了
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
    this.manager.startCountDown();
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
  const finishCallback = () => requestManager.done();
  requestManager.prepareCookie(input.toString());
  const process = new Promise<void>((resolve) => {
    if (window.__myxhrsending && !isEmpty(window.__myxhrsending)) {
      window.__myxhrsending.push(requestManager.requestId);
      const recoverCallback = () => {
        if (window.__myxhrsending[0] === requestManager.requestId) {
          requestManager.injectCookie();
          window.removeEventListener("recoverSend", recoverCallback);
          resolve();
        }
      };

      if (init && init.signal) {
        init.signal.addEventListener("abort", () => {
          window.__myxhrsending = window.__myxhrsending.filter(
            (i) => i !== requestManager.requestId
          );
          window.removeEventListener("recoverSend", recoverCallback);
        });
      }

      window.addEventListener("recoverSend", recoverCallback);
      return;
    }
    window.__myxhrsending = window.__myxhrsending || [];
    window.__myxhrsending.push(requestManager.requestId);
    requestManager.injectCookie();
    resolve();
  })
    .then(() => {
      const finalInit = requestManager.injectAuthHeader(init);
      return window.originalFetch(
        requestManager.replaceParams(input.toString()),
        finalInit
      );
    })
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
