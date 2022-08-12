import React, { useCallback } from "react";
import { Button } from "antd";

interface Props {}

function Popup(props: Props) {
  const onClick = useCallback(() => {
    chrome.runtime.sendMessage({ type: "switch" });
  }, []);

  return (
    <>
      Popup
      <Button onClick={onClick}>Click</Button>
    </>
  );
}

export default Popup;
