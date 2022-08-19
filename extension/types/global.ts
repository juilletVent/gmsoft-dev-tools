interface Window {
  originalXMLHttpRequest: typeof XMLHttpRequest;
  originalFetch: typeof fetch;
  __getConfig: (e: any) => void;
  cookieConfig: any;
  rulesConfig: any;
  __myxhrsending?: string[];
}
