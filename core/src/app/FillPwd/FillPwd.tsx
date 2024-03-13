import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Menu, Dropdown, Button, Space } from "antd";
import styled from "styled-components";
import { DownOutlined } from "@ant-design/icons";
const Layout = styled.div<{ isZCJ?: boolean }>`
  position: absolute;
  right: 0px;
  top: 0px;
  bottom: 0px;
  z-index: 9;
  button {
    width: 100%;
    height: 100%;
    border-radius: ${(props) => (!props.isZCJ ? "0 200px 200px 0" : "none")};
  }
`;

interface Props {}

function FillPwd(props: Props) {
  const isZCJ = useMemo(() => window.location.href.includes("ZCJ"), []);
  const [pwds, setPwds] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const onPwdChange = useCallback(({ key }: any) => {
    const passwordNode = document.querySelector(
      '[ng-model="account.password"]'
    ) as HTMLInputElement;
    if (passwordNode) {
      passwordNode.value = key;
      passwordNode.dispatchEvent(
        new CustomEvent("change", { bubbles: true, cancelable: true })
      );
    }
  }, []);

  const items = useMemo(
    () => pwds.map((pwd) => ({ key: pwd, label: pwd })),
    [pwds]
  );

  useEffect(() => {
    document.addEventListener("receivePwd", (e: any) => {
      setPwds(e.detail.pwdList);
    });
    const event = new CustomEvent("requestPwd");
    document.dispatchEvent(event);
  }, []);

  const menu = useMemo(
    () => <Menu style={{ width: 150 }} onClick={onPwdChange} items={items} />,
    [items, onPwdChange]
  );

  return (
    <Layout ref={containerRef} isZCJ={isZCJ}>
      <Dropdown overlay={menu} getPopupContainer={(t) => containerRef.current!}>
        <Button>
          <Space>
            填充密码
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
    </Layout>
  );
}

export default FillPwd;
