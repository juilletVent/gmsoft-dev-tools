class MyXMLHttpRequest extends XMLHttpRequest {
  private requestUrl: string;

  constructor() {
    super();
  }

  open(...args: any): void {
    const targetArgs = args;
    console.log("args: ", args);
    this.requestUrl = args[1];
    if (args[1].includes("/zcjopenbid/activities/progress")) {
      targetArgs[1] = `//${window.location.host}`;
    }
    // @ts-ignore
    return super.open(...targetArgs);
  }

  send(...args: any) {
    return super.send(...args);
  }

  get response() {
    return {};
  }
  get responseText() {
    const str = `{"nodes":[{"name":"签到","key":"openbid_sign","tasks":[{"name":"签到","key":"openbid_sign","state":3}]},{"name":"解密","key":"openbid_decrypt","tasks":[{"name":"解密","key":"openbid_decrypt","state":2}]},{"name":"确认","key":"openbid_confirm","tasks":[{"name":"确认","key":"openbid_confirm","state":1}]},{"name":"资格审查","key":"evaluate_qualif","tasks":[{"name":"资格审查","key":"evaluate_qualif","state":1}]},{"name":"评审报告","key":"evaluate_report","tasks":[{"name":"评审报告","key":"evaluate_report","state":1}]}]}`;
    if (this.requestUrl.includes("/zcjopenbid/activities/progress")) {
      // const data = JSON.parse(super.responseText);
      // data.nodes.pop();
      // return JSON.stringify(data);
      return str;
    }
    return super.responseText;
  }
}

export default MyXMLHttpRequest;
