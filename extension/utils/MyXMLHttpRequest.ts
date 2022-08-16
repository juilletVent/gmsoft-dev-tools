import Cookies from "js-cookie";

class MyXMLHttpRequest extends XMLHttpRequest {
  constructor() {
    super();
  }

  send(body: any) {
    // Cookies.set("Auth", window.cookieConfig.value);
    // FIXME: 如果多个域的接口并发访问，可能会导致cookie冲突，如果在loadstart事件中进行Cookie移除
    // 整个访问的Cookie注入将不会生效，非常蛋疼，暂时没想到合适的解决方案，暂时先这样处理
    super.addEventListener("loadend", () => {
      Cookies.remove("Auth");
    });
    return super.send(body);
  }
}

export default MyXMLHttpRequest;
