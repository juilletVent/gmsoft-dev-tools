import React from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import { StyleSheetManager } from "styled-components";
import FillPwd from "./app/FillPwd/FillPwd";
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars, import/no-webpack-loader-syntax
import antdCss from "!!raw-loader!antd/dist/antd.min.css";

let handle: any = 0;
let checkCount = 0;

function injectCss(root: ShadowRoot) {
  const styleNode = document.createElement("style");
  styleNode.textContent = antdCss;
  root.appendChild(styleNode);
}

function steupObserver(observedNode: HTMLDivElement) {
  const observer = new MutationObserver(() => {
    const pwdInput = observedNode.querySelector<HTMLInputElement>(
      '[ng-model="account.password"]'
    );
    const fillPwd = observedNode.querySelector("#fille-pwd");
    if (pwdInput && !fillPwd) {
      // 需要重新渲染
      init();
    }
  });
  observer.observe(observedNode, {
    childList: true,
    subtree: true,
  });
}

function init() {
  checkCount++;
  const referencePointer =
    document.querySelector<HTMLDivElement>(".login-form-box");
  if (!referencePointer) {
    return;
  }
  if (checkCount > 10) {
    return clearInterval(handle);
  }

  steupObserver(referencePointer);

  const passwordNode = referencePointer.querySelector<HTMLInputElement>(
    '[ng-model="account.password"]'
  );
  if (!passwordNode) {
    return;
  }
  passwordNode.type = "iuput";
  const parent = passwordNode.parentElement!;
  // parent.style.position = "relative";
  const rootNode = document.createElement("div");
  rootNode.id = "fille-pwd";
  const shadow = rootNode.attachShadow({ mode: "open" });
  const shadowRoot = document.createElement("div");

  injectCss(shadow);

  shadow.appendChild(shadowRoot);
  parent.appendChild(rootNode);
  const root = ReactDOM.createRoot(shadowRoot);
  root.render(
    <React.StrictMode>
      <ConfigProvider locale={zhCN}>
        <StyleSheetManager target={shadow}>
          <FillPwd />
        </StyleSheetManager>
      </ConfigProvider>
    </React.StrictMode>
  );
  clearInterval(handle);
}

handle = setInterval(init, 500);
