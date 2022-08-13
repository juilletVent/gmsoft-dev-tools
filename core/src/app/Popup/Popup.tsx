import { useCallback, useEffect } from "react";
import { Form, Switch, Select } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import {
  FormGroup,
  FormItemTitle,
  PopupContentLayout,
  PopupLayout,
} from "./style";
import { ExtensionsStorageUtils } from "../../utils/storage";
import PopupHeader from "./PopupHeader";
import PopupFooter from "./PopupFooter";

const { Item: FormItem } = Form;
const { Option } = Select;
interface Props {}

function Popup(props: Props) {
  const [form] = Form.useForm();

  const onSwitchChange = useCallback((val: boolean) => {
    ExtensionsStorageUtils.setConfig({
      open: val,
    });
  }, []);

  useEffect(() => {
    if (form) {
      const { setFieldsValue } = form;
      ExtensionsStorageUtils.getConfig().then((config) => {
        setFieldsValue({
          open: config.open,
          platform: "test1-zcj",
        });
      });
    }
  }, [form]);

  return (
    <PopupLayout>
      <PopupHeader />
      <PopupContentLayout>
        <Form name="popup" form={form}>
          <FormGroup>
            <FormItemTitle>代理开关：</FormItemTitle>
            <FormItem name="open" valuePropName="checked">
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                defaultChecked
                onChange={onSwitchChange}
              />
            </FormItem>
          </FormGroup>
          <FormGroup>
            <FormItemTitle>目标平台：</FormItemTitle>
            <FormItem name="platform">
              <Select>
                <Option value="test1-zcj">test1-zcj</Option>
                <Option value="test1-xcj">test1-xcj</Option>
                <Option value="show-zcj">show-zcj</Option>
                <Option value="show-xcj">show-xcj</Option>
              </Select>
            </FormItem>
          </FormGroup>
        </Form>
      </PopupContentLayout>
      <PopupFooter />
    </PopupLayout>
  );
}

export default Popup;
