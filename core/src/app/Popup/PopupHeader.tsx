import React, { useCallback } from "react";
import {
  Logo,
  PopupHeaderLayout,
  PopupHeaderLeft,
  PopupHeaderRight,
  Title,
} from "./style";
import logoImg from "../../imgs/cookie.png";
import { Button } from "antd";
import { SettingOutlined } from "@ant-design/icons";

interface Props {}

function PopupHeader(props: Props) {
  const onOpenConfig = useCallback(() => {
    window.open(`chrome-extension://${chrome.runtime.id}/config/options.html`);
  }, []);

  return (
    <PopupHeaderLayout>
      <PopupHeaderLeft>
        <Logo src={logoImg} />
        <Title>Gmsoft-Dev-Tools</Title>
      </PopupHeaderLeft>
      <PopupHeaderRight>
        <Button
          shape="circle"
          icon={<SettingOutlined />}
          onClick={onOpenConfig}
        />
      </PopupHeaderRight>
    </PopupHeaderLayout>
  );
}

export default PopupHeader;
