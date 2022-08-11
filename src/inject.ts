import MyXMLHttpRequest from "./utils/MyXMLHttpRequest";

(() => {
  function sendXHR() {
    console.log("sendXHR");
  }

  // @ts-ignore
  window.bridge = { sendXHR };
  // @ts-ignore
  window.XMLHttpRequest = MyXMLHttpRequest;
})();
