import React from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider } from "antd";
import "antd/dist/antd.min.css";
import zhCN from "antd/es/locale/zh_CN";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Options from "./app/Options/Options";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      {/* http://localhost:8000/config/options.html */}
      <Options />
    </ConfigProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
