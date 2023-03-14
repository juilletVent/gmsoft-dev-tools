import React from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import { StyleSheetManager } from "styled-components";
import FillPwd from "./app/FillPwd/FillPwd";
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars, import/no-webpack-loader-syntax
import antdCss from "!!raw-loader!antd/dist/antd.min.css";
import { ExtensionsStorageUtils } from "./utils/storage";

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

  // 获取当前明文显示密码的站点列表，如果当前的站点域名在白名单中，则修改密码框为明文显示
  // 默认情况下，密码框都是密文显示，如果需要明文显示，需要在扩展设置中配置或直接编辑LocalStorage进行配置
  // 推荐的开发测试环境明文显示域名列表配置
  // key：gmsoft-dev-tools-local-config
  // value：{"showPwdSites":["localhost","REGEX:.gm$"]}

  const showPwdSites = (ExtensionsStorageUtils.getLocalConfig().showPwdSites ??
    []) as string[];
  const regexRule = showPwdSites
    .filter((i: string) => i.startsWith("REGEX:"))
    .map((i: string) => new RegExp(i.replace(/^REGEX:/, "")));
  const stringRule = showPwdSites.filter(
    (i: string) => !i.startsWith("REGEX:")
  );

  const regexHit =
    regexRule.map((r) => r.test(window.location.hostname)).length > 0;
  const stringHit = stringRule.includes(window.location.hostname);

  if (regexHit || stringHit) {
    passwordNode.type = "iuput";
  }

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
