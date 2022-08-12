import React, { useCallback, useEffect } from "react";
import { Form, Switch } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { PopupLayout } from "./style";

const { Item: FormItem } = Form;
interface Props {}

function Popup(props: Props) {
  const [form] = Form.useForm();
  console.log("form: ", form);
  const onSwitchChange = useCallback((val: boolean) => {
    chrome.runtime.sendMessage({ type: "switch", val });
    chrome.storage.sync.set({ open: val });
  }, []);

  useEffect(() => {
    if (form) {
      const { setFieldsValue } = form;
      chrome.storage.sync.get("open", (res) => {
        setFieldsValue({
          open: res.open,
        });
      });
    }
  }, [form]);

  return (
    <PopupLayout>
      <Form name="popup" form={form}>
        <FormItem label="代理主开关：" name="open" valuePropName="checked">
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            defaultChecked
            onChange={onSwitchChange}
          />
        </FormItem>
      </Form>
    </PopupLayout>
  );
}

export default Popup;
