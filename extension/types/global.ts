interface Window {
  originalXMLHttpRequest: typeof XMLHttpRequest;
  __getConfig: (e: any) => void;
  cookieConfig: any;
  rulesConfig: any;
  __myxhrsending?: string[];
}
